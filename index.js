require("dotenv").config();

import { Database } from "bun:sqlite";
const express = require("express");
const app = express();

const db = new Database("sqlite3.db");
var currentPrompt = "Build a quiz app";

app.get("/submit", (req, res, next) => {
	if(!req.query.code && !req.headers.cookie?.includes("token=")) return res.redirect("/");
	if(req.query.repo) {
		const token = req.headers.cookie.split("token=")[1];
		fetch(`https://api.github.com/user`, {headers: {"Authorization": `Bearer ${token}`}}).then(res => res.json()).then(user => {
			if(!user) return res.redirect("/");
			fetch(`https://api.github.com/repos/${req.query.repo}`, {headers: {"Authorization": `Bearer ${token}`}}).then(res => res.json()).then(repo => {
				if(!repo || repo.owner.login != user.login) return res.redirect("/");
				db.exec("INSERT INTO submission (name, date) VALUES (?)", [repo.full_name, (new Date()).toUTCString()]);
				return res.end();
			})
		})
	}
	next();
})
app.use(express.static("public"));
app.get("/login", (req, res) => {
	if(!req.headers.cookie?.includes("token=")) 
		res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env["CLIENT_ID"]}&scope=public_repo,read:user&redirect_uri=http://localhost:8080/submit`)
	else res.redirect("/submit")
});
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
	fetch(`https://github.com/login/oauth/access_token?client_id=${process.env["CLIENT_ID"]}&client_secret=${process.env["CLIENT_SECRET"]}&code=${req.query.code}`, {method: "POST", headers: {"Accept": "application/json"}})
		.then(res => res.json())
		.then(json => res.end(json.access_token))
		.catch(err => {
			console.error(err);
			res.end();
		})
})


app.listen(8080, () => console.log("Project running at http://localhost:8080"));