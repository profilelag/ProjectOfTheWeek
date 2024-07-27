import express from "express";
const app = express();

interface Project {
    author: string;
    github: string;
}

var currentPrompt = "Build a quiz app";
var showcase: Project[] = [];
app.use((req, res, next) => {console.log(`${req.method} ${req.path}`); next()});
app.use(express.static("public"));
app.get("/prompt", (req, res) => res.end(currentPrompt));
app.get("/showcase", (req, res) => {
    res.json(showcase);
    res.end();
})
app.listen(8080, () => console.log("http://localhost:8080"));