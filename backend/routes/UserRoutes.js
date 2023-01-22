const express = require("express");
const router = express.Router();


//controller
const {register, login} = require("../controllers/UserController");

//middlewares
const validate = require("../middlewares/handleValidation");
const {userCreateValidation, loginValidation} = require("../middlewares/userValidation");

//routes
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);

module.exports = router;