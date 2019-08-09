const mongoose = require("mongoose");
const mongodbUri = `mongodb://:@ds259577.mlab.com:59577/store`;
const chalk = require("chalk");

mongoose.connect(mongodbUri, {
    useNewUrlParser: true,
    auth: {
        user: "erislandio",
        password: "Er1sl@ndio"
      }
});

const conn = mongoose.connection;

conn.on("error", console.error.bind(console, "Error!"));

conn.once("open", () => {
    console.log(chalk.bgMagenta(`connected to mlab!`));
});

mongoose.Promise = global.Promise;
module.exports = mongoose;
