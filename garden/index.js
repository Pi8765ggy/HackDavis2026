const express = require('express');

/*
 * Init application with expressJS
 */
const app = express();
const port = 3000;
const path = require('path');

/*
 * Init Database with SQLite3
 */
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sql');

/*
 * User Routes
 */
app.post('/user', (req, res) => {
  	const { email, zipcode, zone_code, name } = req.body;

  	const stmt = db.prepare('INSERT INTO users (email, zipcode, zone_code, name) VALUES (?, ?, ?, ?)');

	stmt.run(email, zipcode, zone_code, function (err) {
		if (err) return res.status(400).json({ error: err.message });

		res.status(201);
	});

	stmt.finalize();
});

app.put('/users/:email/zipcode', (req, res) => {
	const { zipcode } = req.body;

	const stmt = db.prepare('UPDATE users SET zipcode = ? WHERE email = ?');

	stmt.run(zipcode, req.params.email, function (err) {
		if (err) return res.status(400).json({ error: err.message });
		if (this.changes === 0) return res.status(404).json({ error: 'User not found' });

		res.json({ message: 'Zipcode updated' });
	});

	stmt.finalize();
});

/*
 * Garden Routes
 */
app.get('/plants/:email', (req, res) => {
	const stmt = db.prepare('SELECT name, date_planted FROM plants WHERE owner = ?');
	stmt.all(req.params.email, (err, rows) => {
		if (err) return res.status(400).json({ error: err.message });

		const json = JSON.stringify(rows);
  		res.send(json)
	});
	stmt.finalize();
})

app.post('/plants/:email', (req, res) => {
	const { owner, name, date_planted } = req.body;

	const stmt = db.prepare('INSERT INTO plants (owner, name, date_planted) VALUES (?, ?, ?)');

	stmt.run(owner, name, date_planted, function (err) {
		if (err) return res.status(400).json({ error: err.message });

		res.status(201)
  	});

  	stmt.finalize();
})

/*
 * Serve static index.html file.
 * Located at HackDavis2026/garden/static/index.html
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

/*
 * API Route Definitions
 */

// Return zone information based on a provided zipcode
const zone = require(path.join(__dirname, 'static', 'zoneinfo', 'zipcode_zone.json'));
app.get('/api/zip/:zipcode', (req, res) => {
    const zipcode = req.params.zipcode;
    const data = zone[zipcode];

    if (!data) {
        return res.status(404).json({
            error: "ZIP code not found.",
            zip: zipcode
        })
    };
    
    // Returns data related to the specific zip code in this format:
    /*
     * zone: A string that gives the hardiness zone of the zipcode. (ex: "7a")
     * trange: A string that give the temperature range of the zone in degrees F. (ex: "0 to 5")
     * zonetitle: String that combines the previous two fields. (ex: "7a: 0 to 5")
     */
    res.json(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
