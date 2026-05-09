const express = require('express')
const app = express()
const port = 3000

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sql');

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

app.get('/plants/:email', (req, res) => {
	const stmt = db.prepare('SELECT (name, date_planted) FROM plants WHERE owner = ?');
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

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
