const express = require('express');
const { Exa } = require("exa-js");
const aiRecommendPlants = require('./find_plants.js')

/*
 * Init application with expressJS
 */
const app = express();
const port = 3000;
const path = require('path');
app.use(express.static(path.join(__dirname, 'static', 'build')));
app.use(express.json());
app.use((req, res, next) => {
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Method:", req.method);
  next();
});

/*
 * Load environment variables
 */ 
require('dotenv').config()

/*
 * Init Database with SQLite3
 */
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sql');

/*
 * Import auth0 middleware
 */
const { auth } = require("express-oauth2-jwt-bearer");
const auth0Domain = process.env.AUTH0_DOMAIN;
const checkJWT = auth({
    audience: 'garden-api',
    issuerBaseURL: auth0Domain,
    tokenSigningAlg: 'RS256'
})

/*
 * exa.ai agent chatbot clanker
 */
const exa = new Exa(process.env.EXA_API_KEY);

/*
 * Database helper function for db access
 */
const dbAll = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
    });
});
const dbGet = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        })
    })

/////////////////////////
//
// API Route Definitions
//
/////////////////////////

// Return zone information based on a provided zipcode
const zone = require(path.join(__dirname, 'static', 'zoneinfo', 'zipcode_zone.json'));

function getZone(zipcode) {
    const data = zone[zipcode];
    if (!data) {
        return null
    } else {
    /* 
     * Returns data related to the specific zip code in this format:
     *
     * zone: A string that gives the hardiness zone of the zipcode. (ex: "7a")
     * trange: A string that give the temperature range of the zone in degrees F. (ex: "0 to 5")
     * zonetitle: String that combines the previous two fields. (ex: "7a: 0 to 5")
     *
     */
        return data
    }
}

const zonecities = require(path.join(__dirname, 'static', 'zoneinfo', 'zipcode_city.json'));

function titlecase(str) {
	return str.split(' ')
		.map(s => s.substring(0,1)+s.substring(1).toLowerCase())
		.reduce((acc, cur) => `${acc} ${cur}`, '').trim()
}

function getCityState(zipcode) {
	const z = zipcode.toString().padStart(5, "0");
	const data = zonecities[z]
	if (!data) {
		return null
	}
	return {
		city: titlecase(data.city),
		state: data.state,
	}
}

app.get('/api/zip/:zipcode', (req, res) => {
    const zipcode = req.params.zipcode;
    
    const data = getZone(zipcode)

    if (!data) {
        throw {
            error: "ZIP code not found.",
            zip: zipcode
        }
    };

    res.json(data);
});



/*
 * User Routes
 */

app.get('/api/me', checkJWT, (req, res) => {
    const sub = req.auth.payload.sub;
  	const stmt = db.prepare('SELECT zipcode, zone_code FROM users WHERE sub = ?');
	stmt.get(sub, (err, row) => {
		if (err) {
			return res.status(400).json({ error: err.messaage });
		}
		return res.status(200).send({...row, ...getCityState(row.zipcode)})
	})
})


// Middleware func to ensure user for specific endpoints.
const ensureUser = async (req, res, next) => {
    try {
        await verifyUser(req.auth.payload.sub);
        next();
    } catch (err) {
        next(err);
    }
};

// Helper func for useful user verification purpose
const verifyUser = async (sub) => {
    const defaultZip = '95616' // Davis CA
    const defaultZone = getZone(defaultZip)
    
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT OR IGNORE INTO users (sub, zipcode, zone_code) VALUES (?, ?, ?)',
            [sub, defaultZip, defaultZone],
            (err) => err ? reject(err) : resolve()
        );
    });
}


// Creates a user, defaults location to Davis CA
app.post('/api/user', checkJWT, async (req, res) => {
    const sub = req.auth.payload.sub;
    try {
        await verifyUser(sub);
        res.status(201).json("User ensured.")
    } catch (err) {
        console.error('Err at POST /api/user: ', err)
        res.status(500).json({error: err.messaage})
    }
});

// Updates zipcode and zone code for user based on input
app.put('/api/users', checkJWT, ensureUser, (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Empty request body. "});
    }
	const { zipcode } = req.body;
	const zone = getZone(zipcode).zone;

    if (!zone) {
        return res.status(404).json({ error: "Invalid zipcode provided. "})
    }

	const stmt = db.prepare('UPDATE users SET zipcode = ?, zone_code = ? WHERE sub = ?');

	stmt.run(zipcode, zone, req.auth.payload.sub, function (err) {
		if (err) return res.status(400).json({ error: err.message });
		if (this.changes === 0) return res.status(404).json({ error: 'User not found' });

		return res.status(200).json({ message: 'Zipcode updated' });
	});

	stmt.finalize();
});



/*
 * Garden Routes
 */
app.get('/api/plants', checkJWT, (req, res) => {
	const stmt = db.prepare('SELECT name, date_planted FROM plants WHERE owner = ?');
	stmt.all(req.auth.payload.sub, (err, rows) => {
		if (err) return res.status(400).json({ error: err.message });

		const json = JSON.stringify(rows);
  		return res.status(200).send(json)
	});
	stmt.finalize();
})

app.post('/api/plants', checkJWT, ensureUser, (req, res) => {
	const { name, date_planted } = req.body;
    const owner = req.auth.payload.sub

	const stmt = db.prepare('INSERT INTO plants (owner, name, date_planted) VALUES (?, ?, ?)');
	stmt.run(owner, name, date_planted, function (err) {
		if (err) return res.status(400).json({ error: err.message });
        console.log("No error for database insert.")
		return res.status(201).end()
  	});
  	stmt.finalize();
})

/*
 * Return a chatbot response to a query from the frontend
 * links within the response are sent in markdown eg [google](google.com)
*/ 
app.get('/api/ai/plants/:zipcode', async (req, res) => {
	const zipcode = req.params.zipcode
	return res.status(200).send(await aiRecommendPlants(exa, zipcode, getZone(zipcode).zone))
})

app.get('/api/ai/plants-auth', checkJWT, async (req, res) => {
  	const stmt = db.prepare('SELECT zipcode FROM users WHERE sub = ?');

	stmt.get(req.auth.payload.sub, async (err, row) => {
		if (err) return res.status(400).json({ error: err.message });
		const zipcode = row.zipcode;
        const zone = row.zone_code;
		return res.status(200).send(await aiRecommendPlants(exa, zipcode, zone));
	})
})

/*
 * Returns a chatbot's response to a user submitted prompt.
 * The context is provided using the database.
 */
app.post('/api/ai/user', checkJWT, ensureUser, async (req, res) => {

    const { prompt } = req.body

    try {
        const rows = await dbAll(
            'SELECT name, date_planted FROM plants WHERE owner = ?',
            [req.auth.payload.sub]
        );
        
        // Format: YYYY-MM-DD
        const date = new Date().toISOString().split('T')[0];
        let plants;
        if (rows.length == 0) {
            plants = "The user has no plants."
        } else {
            const plantList = rows
            .map((row, i) => `${i + 1}. ${row.name}, planted on ${row.date_planted}`)
            .join('\n');
            plants = `The user has ${rows.length} plant${rows.length === 1 ? '' : 's'}:\n${plantList}`;
        }
        let user;
        try {
            user = await dbGet(
                'SELECT * FROM users WHERE sub = ?',
                [req.auth.payload.sub]
            );
        } catch (err) {
            console.error('Error in dbGet', err)
            return res.status(400).json({ error:err.message })
        }

        console.log("User: ", user)

        const context = `You are a helpful AI model who wants to provide users with information regarding gardening. \
        You will be polite and concise with your answers, striving to provide the most accurate information. \
        You should not take more than three sentences to answer a user's question, unless it is extremely nuanced. \
        Avoid citing sources directly in text, a citation list will be provided from your response elsewhere. \
        Try to talk in plain English, without using overly technical terms. \
        You will absolutely never provide any inforation that you deem to be dangerous or risky for the user. \
        The user lives in the zone ${user.zone_code}. You should base your response around the zone of the user. \
        The current date is ${date}. You should base your response around the current time of the year. \
        ${plants} \n\
        The user has submitted the following prompt, answer to the best of your ability. \n\
        \"${prompt}\"`;

        const result = await exa.answer(context, {
            text: true
        });

        return res.status(200).json({
            answer: result.answer,
            citations: result.citations
        });

    } catch (err) {
        console.error('Error in POST /api/ai/user', err)
        return res.status(500).json({ error: err.message })
    }
})

/*
 * Serve static index.html file.
 * Located at HackDavis2026/garden/static/build/index.html
 */
app.get(/.*/, (req, res) => {
    console.log(path.join(__dirname, 'static', 'build', 'index.html'));
    res.sendFile(path.join(__dirname, 'static', 'build', 'index.html'));
});
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

/*
// zone string like 7a (always contains letter at the end, see json file)
function plantCanGrowInZone(plant, zone) {
	let z = zone.substring(0, zone.length-1);
	return z >= plant.zoneMin && z <= plant.zoneMax
}
*/
