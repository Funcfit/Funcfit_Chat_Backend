const { StatusCodes } = require("http-status-codes");
//import { StatusCodes } from "http-status-codes";
const User = require("../models/user.js");
//import User from "../models/user.js";
const bcrypt = require("bcryptjs");
//import bcrypt from "bcryptjs";
const jwt = require("jsonwebtoken");
//import jwt from "jsonwebtoken";

const {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError
} = require("../errors/index.js");
/*
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index.js";
*/

const register = async (req, res) => {
  const { username, email, password, avatar } = req.body;
  if (!username || !email || !password) {
    console.log(username);
    throw new BadRequestError("Please Provide All Values");
  }

  const isUserExists = await User.findOne({ email: email });

  if (isUserExists) {
    throw new BadRequestError("User with this Email Already Exists");
  }

  //hashing password
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashPassword,
    avatar,
  });

  const token = jwt.sign(
    {
      userId: user._id,
      username: user.username,
      userEmail: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res.status(StatusCodes.CREATED).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    token,
  });
};

const login = async (req, res) => {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    throw new BadRequestError("Please Provide All the Values");
  }

  const isUser = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });

  if (!isUser) {
    throw new NotFoundError("Invalid Credentials");
  }

  //compare password
  const comparePassword = await bcrypt.compare(password, isUser.password);

  if (!comparePassword) {
    throw new BadRequestError(
      "Please Make Sure You have entered Correct Password!"
    );
  }

  const token = jwt.sign(
    {
      userId: isUser._id,
      username: isUser.username,
      userEmail: isUser.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res.status(StatusCodes.OK).json({
    _id: isUser._id,
    username: isUser.username,
    email: isUser.email,
    avatar: isUser.avatar,
    token,
  });
};

const searchUser = async (req, res) => {
  const search = req.query.search;

  console.log(search);
  const user = await User.find({
    username: { $regex: search, $options: "i" },
  }).select("username avatar _id email bio");

  res.status(StatusCodes.OK).json(user);
};

module.exports = { register, login, searchUser };
