const express = require('express');
const { Exa } = require("exa-js");

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
const exa = new Exa();



/////////////////////////
//
// API Route Definitions
//
/////////////////////////

// Return zone information based on a provided zipcode
const zone = require(path.join(__dirname, 'static', 'zoneinfo', 'zipcode_zone.json'));

// Returns data related to the specific zip code in this format:
/*
 * zone: A string that gives the hardiness zone of the zipcode. (ex: "7a")
 * trange: A string that give the temperature range of the zone in degrees F. (ex: "0 to 5")
 * zonetitle: String that combines the previous two fields. (ex: "7a: 0 to 5")
 */
function zipcodeToZoneData(zipcode) {
    const data = zone[zipcode];

    if (!data) {
        throw {
            error: "ZIP code not found.",
            zip: zipcode
        }
    };

	return data
}

app.get('/api/zip/:zipcode', (req, res) => {
	try {
		const zipcode = req.params.zipcode;
		res.json(zipcodeToZoneData(zipcode));
	} catch (e) {
        return res.status(404).json(e)
	}
});



/*
 * User Routes
 */
app.post('/api/user', checkJWT, (req, res) => {

    console.log(req.body)

    const sub = req.auth.payload.sub
  	const {zipcode, zone_code} = req.body;

  	const stmt = db.prepare('INSERT INTO users (sub, zipcode, zone_code) VALUES (?, ?, ?)');

	stmt.run(sub, zipcode, zone_code, (err) => {
		if (err) {
            return res.status(200).json({ error: err.messaage });
        } else {
            return res.status(201).json({ message: "Created User" })
        }
	});
	stmt.finalize();
});

// also updates zone code (based on zipcode)
app.put('/api/users', checkJWT, (req, res) => {
	const { zipcode } = req.body;
	const zone = zipcodeToZoneData(zipcode).zone;

	const stmt = db.prepare('UPDATE users SET zipcode = ?, zone_code = ? WHERE sub = ?');

	stmt.run(zipcode, zone, req.auth.payload.sub, function (err) {
		if (err) return res.status(400).json({ error: err.message });
		if (this.changes === 0) return res.status(404).json({ error: 'User not found' });

		res.json({ message: 'Zipcode updated' });
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
  		res.send(json)
	});
	stmt.finalize();
})

app.post('/api/plants', checkJWT, (req, res) => {
	const { name, date_planted } = req.body;

	const stmt = db.prepare('INSERT INTO plants (owner, name, date_planted) VALUES (?, ?, ?)');

	stmt.run(owner, name, date_planted, function (err) {
		if (err) return res.status(400).json({ error: err.message });

		res.status(201)
  	});

  	stmt.finalize();
})

/*
 * Return a chatbot response to a query from the frontend
*/ 

app.get('/api/ai/:query', checkJWT, async (req, res) => {
  	const stmt = db.prepare('SELECT zipcode, zone_code FROM users WHERE sub = ?');

	stmt.get(req.user.email, (err, row) => {
		if (err) return res.status(400).json({ error: err.message });

		let zone = row.zone_code
		let zipcode = row.zipcode
		let context = `Context: user in the US lives in a zone with a hardinesslevel=${} and zipcode=${zipcode}.`

		const response = await exa.answer(`${context}${req.params.query}`);
		console.log(response)

		res.status(200)
	})

	// todo 

    res.json({
        message: "User verified success!",
        user: req.auth.payload.sub
    })
})


/*
 * Serve static index.html file.
 * Located at HackDavis2026/garden/static/build/index.html
 */
app.get(/.*/, (req, res) => {
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
