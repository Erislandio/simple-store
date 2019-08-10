const express = require("express");
const routes = express.Router();
const userController = require("../app/controllers/UserController");
const authController = require("../app/controllers/AuthController");
const categoryController = require("../app/controllers/CategoryControllers");
const brandController = require("../app/controllers/BrandControllers");
const multer = require("multer");
const multerConfig = require("../config/multer");
const auth = require('../app/middlewares/auth')
const path = require('path')

routes.use('/user', auth)
routes.use('/users', auth)
routes.use('/category', auth)
routes.use('/brand', auth)

// * Users
routes.post("/user", userController.store);
routes.get("/users", userController.index);
routes.put("/user", userController.update);
routes.delete("/user", userController.delete);
routes.get('/user', userController.getUserByEmail)

// * Autenticação
routes.post("/authenticate", authController.authenticate);
routes.post("/login", authController.login);
routes.post("/confirmation", authController.loginConfirmation);
routes.post("/reset/token", authController.resendTokenPost);

// * Category
routes.post('/category', categoryController.store)

// * brand
routes.post('/brand', multer(multerConfig).single("file"), brandController.store)

// * files

routes.use(
    "/files",
    express.static(path.resolve(__dirname, "..", "..", "tmp", "uploads"))
  );
  

module.exports = routes;
