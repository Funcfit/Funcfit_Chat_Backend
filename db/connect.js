const mongoose = require("mongoose");
//import mongoose from "mongoose";



const connect = (url) => {
  return mongoose
    .connect(url)
    .then(() => console.log(`Connection Established!😁`))
    .catch((error) => console.log(`Connection Error ${error}`));
};

module.exports = connect;
