const express = require("express");
import { Database } from "bun:sqlite";
const app = express();

const db = new Database("sqlite3.db");

var currentPrompt = "Build a quiz app";
var showcase = [
    {author: "John", github: "https://github.com/profilelag/ProjectOfTheWeek"},
    {author: "Amy", github: "https://github.com/profilelag/ProjectOfTheWeek"},
    {author: "Mikey", github: "https://github.com/profilelag/ProjectOfTheWeek"},
    {author: "Matt", github: "https://github.com/profilelag/ProjectOfTheWeek"},
    {author: "Jerry", github: "https://github.com/profilelag/ProjectOfTheWeek"}
];
showcase = db.prepare("SELECT user,name FROM submission WHERE approved = true").all().map(row => {
  const username = db.prepare("SELECT name FROM user WHERE id = ?").get(row.user).name
  return {
    author: username,
    github: `https://github.com/${username}/${row.name}`
  }
})
// app.use((req, res, next) => {console.log(`${req.method} ${req.path}`); next()});
app.use(express.static("public"));
app.get("/prompt", (req, res) => res.end(currentPrompt));
app.get("/showcase", (req, res) => {
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
app.listen(8080, () => console.log("http://localhost:8080"));