import { Database } from "bun:sqlite";
const express = require("express");
const fs = require("fs");
const log = require("pino")();

require("dotenv").config();
const app = express();

log.info("Starting Project of the Day");

if (!fs.existsSync("sqlite3.db")) {
    log.warn("Database not found, creating a new one");
    fs.writeFileSync("sqlite3.db", "");
    const db = new Database("sqlite3.db");
    db.prepare(fs.readFileSync("setup.sql").toString()).run();
    log.info("Database created");
}

const db = new Database("sqlite3.db");
log.info("Database loaded");
var currentPrompt = "Build a quiz app"; //TODO: Add a way to change and queue this
app.use((req, res, next) => {
    log.info(`${req.method} ${req.url}`);
    next();
});

app.post("/submit", async (req, res) => {
    if (!req.headers.cookie?.includes("token=")) {
        log.info("No token found");
        return res.sendStatus(403).end({ error: "No token found" });
    }
    const token = req.headers.cookie.split("token=")[1];
    const user = await fetch(`https://api.github.com/user`, {
        headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json());
	if (!user) {
		log.info("Invalid token");
		return res.sendStatus(403).end({ error: "Invalid token" });
	}
	if(!req.query.repo) {
		log.info("No repo found");
		return res.sendStatus(400).end({ error: "No repo found" });
	}
	const repo = await fetch(`https://api.github.com/repos/${req.query.repo}`, {
		headers: { Authorization: `Bearer ${token}` },
	}).then((res) => res.json());
	if (!repo || repo.owner.login != user.login) {
		log.info("Invalid repo");
		return res.sendStatus(403).end({ error: "Invalid repo" });
	}
	try {
		db.prepare(
			"INSERT INTO submission (name, date) VALUES (?, ?)",
			[repo.full_name, new Date().toUTCString()]
		).run();
	} catch {
		return res.sendStatus(500).end({ error: "Error submitting" });
	}
});

app.get("/submit", (req, res, next) => {
    if (!req.query.code && !req.headers.cookie?.includes("token="))
        return res.redirect("/");

    if (req.query.repo) {
        const token = req.headers.cookie.split("token=")[1];
        fetch(`https://api.github.com/user`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((user) => {
                if (!user) return res.redirect("/");
                fetch(`https://api.github.com/repos/${req.query.repo}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                    .then((res) => res.json())
                    .then((repo) => {
                        if (!repo || repo.owner.login != user.login)
                            return res.redirect("/");
                        db.prepare(
                            "INSERT INTO submission (name, date) VALUES (?, ?)",
                            [repo.full_name, new Date().toUTCString()]
                        ).run();
                    });
            });
        res.redirect("/");
        return res.end();
    }
    next();
});
app.use(express.static("public"));
app.get("/login", (req, res) => {
    if (!req.headers.cookie?.includes("token="))
        res.redirect(
            `https://github.com/login/oauth/authorize?client_id=${process.env["CLIENT_ID"]}&scope=public_repo,read:user&redirect_uri=http://localhost:8080/submit`
        );
    else res.redirect("/submit");
});
app.get("/prompt", (req, res) => res.end(currentPrompt));
app.get("/showcase", (req, res) => {
    const showcase = db
        .prepare("SELECT name FROM submission WHERE approved = true")
        .all()
        .map((row) => {
            return {
                author: row.name,
                github: `https://github.com/${row.name}`,
            };
        });
    res.json(
        showcase.sort(function (a, b) {
            if (a.author < b.author) {
                return -1;
            }
            if (a.author > b.author) {
                return 1;
            }
            return 0;
        })
    );
    res.end();
});
app.get("/genToken", (req, res) => {
    fetch(
        `https://github.com/login/oauth/access_token?client_id=${process.env["CLIENT_ID"]}&client_secret=${process.env["CLIENT_SECRET"]}&code=${req.query.code}`,
        { method: "POST", headers: { Accept: "application/json" } }
    )
        .then((res) => res.json())
        .then((json) => res.end(json.access_token))
        .catch((err) => {
            console.error(err);
            res.end();
        });
});

app.listen(process.env["PORT"], () =>
    log.info(`Available at http://localhost:${process.env["PORT"]}`)
);
