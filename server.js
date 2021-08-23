//dependencies
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connectDB");
const helmet = require("helmet");

// init express app
const app = express();

// connect to DB
connectDB();

//init middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(helmet());

//routes
app.use("/api/user", require("./routes/authRouter.js"));
app.use("/api/url", require("./routes/urlRouter.js"));

//static route in production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
}

// run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, (error) => {
  error
    ? console.log("Connection failed")
    : console.log(`Server is running on port ${PORT}`);
});
