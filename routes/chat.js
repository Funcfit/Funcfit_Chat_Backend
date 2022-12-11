const express = require("express");
//import express from "express";
const router = express.Router();

const {
  getChat,
  getChats
  /*createGroup,
  renameGroup,
  removeFromGroup,
  addUserToGroup
  */
} = require("../controllers/chat.js");
/*
import {
  getChat,
  getChats,
  createGroup,
  renameGroup,
  removeFromGroup,
  addUserToGroup,
} from "../controllers/chat.js";
*/

router.route("/").post(getChat).get(getChats);

module.exports = router;
