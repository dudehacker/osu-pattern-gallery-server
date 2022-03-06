const logger = require("pino")();
const api = require("./api");
const express = require("express");
const db = require("./db");

const app = express();

app.use(express.json());
const session = require("express-session");

const MongoStore = require("connect-mongo");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({ 
        clientPromise: db.init(),
        dbName: process.env.MONGO_DATABASE
    }),
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/api", api);

// any server errors cause this function to run
app.use((err, req, res, next) => {
    const status = err.status || 500;
    if (status === 500) {
      logger.error("The server errored when processing a request!");
      logger.error(err);
    }
  
    res.status(status);
    res.send({
      status: status,
      message: err.message,
    });
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server running on port: ${port}`);
});