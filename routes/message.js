const express = require("express");
//import express from "express";
const { allMessages, sendMessage } = require("../controllers/message.js");
//import { allMessages, sendMessage } from "../controllers/message.js";
const router = express.Router();

router.route("/:chatId").get(allMessages);
router.route("/").post(sendMessage);

module.exports = router;
