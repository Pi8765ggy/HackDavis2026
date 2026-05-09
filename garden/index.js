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
