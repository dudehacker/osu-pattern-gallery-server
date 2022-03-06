const mongoose = require("mongoose"); // library to connect to MongoDB
const logger = require("pino")(); // import pino logger

module.exports = {
  init: () => {
    // connect to mongodb
    return mongoose
      .connect(process.env.MONGO_URL, {
          dbName: process.env.MONGO_DATABASE
        })
      .then(m => {
          logger.info("Server connected to MongoDB") 
          return m.connection.getClient()
        })
      .catch((err) => logger.error("Error connecting to MongoDB", err));
  }
};