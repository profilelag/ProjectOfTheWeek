require("dotenv").config();

import { Database } from "bun:sqlite";
const express = require("express");
const app = express();

const db = new Database("sqlite3.db");
var currentPrompt = "Build a quiz app";

app.use(express.static("public"));
app.get("/login", (req, res) => 
	res
		.setHeader("content-type", "text-html")
		.end(`<script>document.location.replace("https://github.com/login/oauth/authorize?client_id=${process.env["CLIENT_ID"]}&scope=public_repo,read:user&redirect_uri=http://localhost:8080/submit");</script>`)
);
app.get("/prompt", (req, res) => res.end(currentPrompt));
app.get("/showcase", (req, res) => {
	const showcase = db.prepare("SELECT user,name FROM submission WHERE approved = true").all().map(row => {
		const username = db.prepare("SELECT name FROM user WHERE id = ?").get(row.user).name
		return {
			author: username,
			github: `https://github.com/${username}/${row.name}`
		}
	})
	res.json(showcase.sort(function (a, b) {
		if (a.author < b.author) {
			return -1;
		}
		if (a.author > b.author) {
			return 1;
		}
		return 0;
	}));
	res.end();
})
app.get("/genToken", (req, res) => {
	fetch(`https://github.com/login/oauth/access_token?client_id=${process.env["CLIENT_ID"]}&client_secret=${process.env["CLIENT_SECRET"]}&code=${req.query.code}`, {}, {headers: {"Accept": "application/json"}})
		.then(res => console.log(res))
		.then(res => res.json())
		.then(json => {
			res.setHeader("Set-Cookie", `token=${json.access_token}; HttpOnly`);
			res.end();
		})
		.catch(err => {
			console.error(err);
			res.end();
		})
	res.end()
})
app.listen(8080, () => console.log("Project running at http://localhost:8080"));