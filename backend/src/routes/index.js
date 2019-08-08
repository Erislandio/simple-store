const express = require("express");
const routes = express.Router();
const userController = require("../controllers/UserController");

routes.post("/user", userController.store);
routes.get("/users", userController.index);

module.exports = routes;
