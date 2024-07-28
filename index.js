require("dotenv").config();

import { Database } from "bun:sqlite";
const express = require("express");
const app = express();

const db = new Database("sqlite3.db");
var currentPrompt = "Build a quiz app";

app.use(express.static("public"));
app.get("/login", (req, res) => res.setHeader("content-type", "text-html").end(`<script>document.location.replace("https://github.com/login/oauth/authorize?client_id=${process.env["CLIENT_ID"]}&scope=public_repo,read:user");</script>`));
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
app.listen(8080, () => console.log("Project running at http://localhost:8080"));