import express from "express";
const app = express();
app.use((req, res, next) => {console.log(`${req.method} ${req.path}`); next()});
app.use(express.static("public"));
app.listen(8080, () => console.log("http://localhost:8080"));