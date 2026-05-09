const express = require('express')
const app = express()
const port = 3000

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sql');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
