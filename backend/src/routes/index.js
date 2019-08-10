const express = require("express");
const routes = express.Router();
const userController = require("../app/controllers/UserController");
const authController = require("../app/controllers/AuthController");
const auth = require('../app/middlewares/auth')

routes.use('/user', auth)
routes.use('/users', auth)

routes.post("/user", userController.store);
routes.get("/users", userController.index);
routes.put("/user", userController.update);
routes.delete("/user", userController.delete);
routes.get('/user', userController.getUserByEmail)

routes.post("/authenticate", authController.authenticate);

module.exports = routes;
