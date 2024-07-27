import express from "express";
const app = express();

interface Project {
    author: string;
    github: string;
}

var currentPrompt = "Build a quiz app";
var showcase: Project[] = [
    {author: "John", github: "https://github.com/profilelag/ProjectOfTheWeek"},
    {author: "Amy", github: "https://github.com/profilelag/ProjectOfTheWeek"},
    {author: "Mikey", github: "https://github.com/profilelag/ProjectOfTheWeek"},
    {author: "Matt", github: "https://github.com/profilelag/ProjectOfTheWeek"},
    {author: "Jerry", github: "https://github.com/profilelag/ProjectOfTheWeek"}
];
app.use((req, res, next) => {console.log(`${req.method} ${req.path}`); next()});
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