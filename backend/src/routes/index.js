const express = require("express");
const routes = express.Router();
const userController = require("../app/controllers/UserController");
const authController = require("../app/controllers/AuthController");
const auth = require('../app/middlewares/auth')

routes.use('/user', auth)

routes.post("/user", userController.store);
routes.get("/user", userController.index);
routes.get('/user:id', userController.getUserByEmail)
routes.post("/authenticate", authController.authenticate);

module.exports = routes;
