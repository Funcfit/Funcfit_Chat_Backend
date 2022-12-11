const StatusCodes = require("http-status-codes"); 
//import { StatusCodes } from 'http-status-codes'
const CustomAPIError = require("./custom-api.js");
//import CustomAPIError from './custom-api.js'

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.NOT_FOUND
  }
}

module.exports = NotFoundError
