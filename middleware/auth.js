const jwt = require("jsonwebtoken");
//import jwt from "jsonwebtoken";
const UnAuthenticatedError = require("../errors/index.js");
//import { UnAuthenticatedError } from "../errors/index.js";
const User = require("../models/user.js");
//import User from "../models/user.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    console.log("here")
    throw new UnAuthenticatedError("Authentication Invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.userId };

    next();
  } catch (error) {
    console.log(token)
    throw new UnAuthenticatedError("Authentication Invalid");
  }
};

module.exports = auth;
