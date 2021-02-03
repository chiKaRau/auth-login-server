const { connect } = require("./dbConnect");
const AdminConfigModel = require("../models/config");
const config = require("../config/config");
const mongoose = require("mongoose");

exports.callConfig = function() {
  try {
    return connect(
      config.env.mongoDBUri,
      config.env.databaseName,
    ).then(() => {
      return new Promise((resolve, reject) => {
        AdminConfigModel.findOne({ _id: 1 }, (err, result) => {
          if(err) reject(err);
          else if(!result) resolve(false);
          else resolve(result);
        });
      })
    }).finally(() => {
      console.log("MongoDB has closed.");
      mongoose.connection.close();
    })
  } catch (e) {
    console.log("callConfig Error -> ");
    console.log(e);
  }
};
