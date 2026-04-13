const express = require("express");
const router = express.Router();

const register = require("../controllers/authController").register;
const login = require("../controllers/authController").login;
const refresh = require("../controllers/authController").refresh;
const logout = require("../controllers/authController").logout;

router.post("/register", register);
router.post("/login", login);
router.post("/refresh",refresh);
router.post("/logout", logout);
module.exports = router;