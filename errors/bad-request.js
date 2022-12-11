const StatusCodes = require("http-status-codes");
//import { StatusCodes } from 'http-status-codes'
const CustomAPIError = require("./custom-api.js");
//import CustomAPIError from './custom-api.js'

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.BAD_REQUEST
  }
}

module.exports = BadRequestError
