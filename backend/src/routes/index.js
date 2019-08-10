const express = require("express");
const routes = express.Router();
const userController = require("../app/controllers/UserController");
const authController = require("../app/controllers/AuthController");
const categoryController = require("../app/controllers/CategoryControllers");

const auth = require('../app/middlewares/auth')

routes.use('/user', auth)
routes.use('/users', auth)
routes.use('/category', auth)

// * Users
routes.post("/user", userController.store);
routes.get("/users", userController.index);
routes.put("/user", userController.update);
routes.delete("/user", userController.delete);
routes.get('/user', userController.getUserByEmail)

// * Autenticação
routes.post("/authenticate", authController.authenticate);
routes.post("/login", authController.login);

// * Category
routes.post('/category', categoryController.store)

module.exports = routes;
