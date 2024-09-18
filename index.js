const express = require("express");
const logger = require("morgan");
const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	port: process.env.PORT,
});

connection.connect();

const app = express();

app.use(logger("dev")); // Dev-vennlig logging av requests (statuskode og tidsbruk på requests)
app.use(express.json()); // Konverterer alle incoming req.body til json format

app.get("/", (req, res) => {
	res.send("Hello.");
});

// Hent alle bøker
app.get("/books", (req, res) => {
	connection.query("SELECT * FROM books", (err, rows, fields) => {
		if (err) throw err;
		res.send(rows);
	});
});

// Hent en bok med id
app.get("/books/:id", (req, res) => {
	const sql = "SELECT * FROM books WHERE id = ?";
	connection.query(sql, [req.params.id], (err, rows, fields) => {
		if (err) throw err;
		res.send(rows);
	});
});

// legg til ny bok -- ikke ferdig --
app.post("/books", (req, res) => {
	const sql = "INSERT INTO books(title, author_id) VALUES (?, ?)";
	const { title, author_id } = req.body;

	connection.query(sql, [title, author_id], (err, rows, fields) => {
		if (err) throw err;
		res.status(201).send();
	});
});

// Endre eksisterende bok
app.put("/books/:id");

// Slette eksisterende bok
app.delete("/books/:id");

app.listen(3001);
