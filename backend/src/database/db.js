const mongoose = require("mongoose");
const mongodbUri = `mongodb://:@ds259577.mlab.com:59577/store`;
const config = require("../env");
const chalk = require("chalk");

mongoose.connect(mongodbUri, {
    useNewUrlParser: true,
    ...config
});

const conn = mongoose.connection;

conn.on("error", console.error.bind(console, "Error!"));

conn.once("open", () => {
    console.log(chalk.bgMagenta(`connected to mlab!`));
});

mongoose.Promise = global.Promise;
module.exports = mongoose;
