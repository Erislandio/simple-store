const express = require("express");
const routes = express.Router();
const userController = require("../controllers/UserController");
const authController = require("../controllers/AuthController");
const auth = require('../middlewares/auth')

routes.use('/user', auth)

routes.post("/user", userController.store);
routes.get("/user", userController.index);
routes.post("/authenticate", authController.authenticate);

module.exports = routes;
