const express = require("express");
const cors = require("cors");
const app = express();
const chalk = require("chalk");
const db = require("./database/db");
const port = 3334;

const routes = require("./routes/index");

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(port, () => {
    console.log(chalk.bgCyan(`Server running in http://localhost:${port}/`));
});
