const express = require('express');

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

app.get('/api/zip/:zipcode', (req, res) => {
    const zipcode = req.params.zipcode;
    
    const data = getZone(zipcode)

    if (!data) {
        return res.status(404).json({
            error: "ZIP code not found.",
            zip: zipcode
        })
    };
    
    res.json(data);
});


/*
 * User Routes
 */
app.post('/api/user', checkJWT, (req, res) => {

    console.log(req.body)
    if (!req.body) {
        return res.status(400).json({ error: "Empty request body." })
    }

    const sub = req.auth.payload.sub;
  	const {zipcode} = req.body;

    const data = getZone(zipcode);
    if (!data) {
        return res.status(404).json({ error: "Zip code not found." })
    }
    const zone_code = data["zone"]

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

app.put('/api/users', checkJWT, (req, res) => {
	const { zipcode } = req.body;

	const stmt = db.prepare('UPDATE users SET zipcode = ? WHERE sub = ?');

	stmt.run(zipcode, req.auth.payload.sub, function (err) {
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


// Return a chatbot response to a query from the frontend
app.get('/api/ai', checkJWT, (req, res) => {
    console.log("This code ran!")
    console.log(req.auth.payload)
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
