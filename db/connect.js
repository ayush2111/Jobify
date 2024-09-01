const mongoose = require("mongoose");
const option = {
  socketTimeoutMS: 30000,
  keepAlive: true,
  reconnectTries: 30000,
};
const connectDB = (url) => {
  return mongoose.connect(url);
};
module.exports = connectDB;
