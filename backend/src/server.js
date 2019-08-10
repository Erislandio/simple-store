const express = require("express");
const cors = require("cors");
const app = express();
const chalk = require("chalk");
const db = require("./database/db");
const port = 3333;
const server = require('http').createServer(app)
const io = require('socket.io')(server)


const routes = require("./routes/index");

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(port, () => {
    console.log(chalk.bgCyan(`Server running in http://localhost:${port}/`));
});
