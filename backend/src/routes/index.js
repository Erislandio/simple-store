const express = require("express");
const routes = express.Router();
const userController = require("../controllers/UserController");
const authController = require("../controllers/AuthController");

routes.post("/user", userController.store);
routes.get("/users", userController.index);
routes.post("/authenticate", authController.authenticate);

module.exports = routes;
