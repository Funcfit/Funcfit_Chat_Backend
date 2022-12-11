const express = require("express");
//import express from "express";
const router = express.Router();
const { register, login, searchUser } = require("../controllers/auth.js");
//import { register, login, searchUser } from "../controllers/auth.js";
const rateLimiter = require("express-rate-limit");
//import rateLimiter from "express-rate-limit";
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const authenticateUser = require("../middleware/auth.js");
//import authenticateUser from "../middleware/auth.js";

router.route("/register").post(apiLimiter, register);
router.route("/login").post(apiLimiter, login);
router.route("/users").get(authenticateUser, searchUser);

module.exports = router;
