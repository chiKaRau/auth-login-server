const mongoose = require("mongoose"),
  ObjectId = require("mongoose").Types.ObjectId;

exports.connect = (connectionUrl, databaseName) => {
  try {
    return mongoose
      .connect(
        connectionUrl,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          dbName: databaseName
        }
      )
      .then(() => {
        console.log("Mongoose is connecting to database");
      })
  } catch(e) {
    console.log("connect Error -> ");
    console.log(e)
  }
};