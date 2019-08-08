const express = require("express");
const cors = require("cors");
const app = express();
const chalk = require("chalk");
const db = require("./database/db");
const port = 3333;

app.use(express.json());
app.use(cors());

app.get("/", (req, res, next) => {
    return res.send({
        ok: true
    });
});

app.listen(port, () => {
    console.log(chalk.bgCyan(`Server running in http://localhost:${port}/`));
});
