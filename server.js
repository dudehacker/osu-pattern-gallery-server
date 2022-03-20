const logger = require("pino")();
const api = require("./api");
const auth = require("./auth");
const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const db = require("./db");
const cors = require("cors")

const app = express();
app.set("trust proxy", true);
app.use(cors({origin:true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie parser middleware
app.use(cookieParser());
const session = require("express-session");

const MongoStore = require("connect-mongo");
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({ 
        clientPromise: db.init(),
        dbName: process.env.MONGO_DATABASE
    }),
    cookie: { maxAge: oneDay },
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Redirect to non-www url
app.get("*", (req, res, next) => {
  if (req.headers.host.slice(0, 4) === "www.") {
    const newHost = req.headers.host.slice(4);
    return res.redirect(301, req.protocol + "://" + newHost + req.originalUrl);
  }
  next();
});

app.use("/api", api);
app.use("/auth", auth);

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