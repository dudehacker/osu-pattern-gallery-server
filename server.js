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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server running on port: ${port}`);
});