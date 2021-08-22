//dependencies
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connectDB");

// init express app
const app = express();

// connect to DB
connectDB();

//init middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//routes
app.use("/api/user", require("./routes/authRouter.js"));
app.use("/api/url", require("./routes/urlRouter.js"));

// run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, (error) => {
  error
    ? console.log("Connection failed")
    : console.log(`Server is running on port ${PORT}`);
});
