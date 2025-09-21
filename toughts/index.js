const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express();
const port = 5000;

const conn = require("./db/conn");

// Models
const Tought = require("./models/Tought");
const User = require("./models/User");

// Import Routes
const toughtsRoutes = require("./routes/toughtsRoutes");
const authRoutes = require("./routes/authRoutes");

// Import Controller
const ToughtController = require("./controllers/ToughtController");

// Template engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// Receber resposta do body
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// Session middleware
app.use(
  session({
    name: "session",
    secret: "itLl#XW7!97w",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  })
);

// Flash messages
app.use(flash());

app.use(express.static("public"));

// set session to res
app.use((req, res, next) => {
  res.locals.session = req.session;

  next();
});

// Routes
app.use("/toughts", toughtsRoutes);
app.use("/", authRoutes);

app.get("/", ToughtController.showToughts);

conn
  //.sync({ force: true })
  .sync()
  .then(() => {
    app.listen(port);
  })
  .catch((err) => console.log(err));
