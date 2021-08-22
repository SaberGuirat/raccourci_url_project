const mongoose = require("mongoose");

const URI = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(URI, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to MongoDB database ...");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
