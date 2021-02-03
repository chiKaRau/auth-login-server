/**
 * Note: admindbService.js supposes serves inside Admin microservices
 * This node.js app is just a sample of modern server (We are using Profile as example)
 */

const { connect } = require("./dbConnect");
const AdminConfigModel = require("../models/config");
const config = require("../config/config");
const mongoose = require("mongoose");

//add
function add_adminConfig(req, res, next) {
  try {

    let admin_connectionUrl = config.env.mongoDBUri.replace("ConfigReader", "ConfigWriter")

    connect(
      admin_connectionUrl,
      config.env.databaseName
    ).then(async () => {

      let data = {
          _id: 2,
          databaseName: [{ profileService: "profile" }, { projectService: "project"}],
          port: [{ profileService: "3000" }, {projectService: "4000"}],
          connectionUrl: [{
            profileService:
              "mongodb+srv://ProfileWriter:12345678Abc@cluster0-7pv9s.mongodb.net/profile?retryWrites=true&w=majority",
          }, {projectService: "mongodb+srv://ProjectWriter:12345678Abc@cluster0-7pv9s.mongodb.net/project?retryWrites=true&w=majority"}]
        }

      let createConfig = AdminConfigModel(data);
      //Wait for the result of createAccount
      //if "err", it breaks and send error to catch block
      let createConfigResult = await new Promise((resolve, reject) => {
        createConfig.save((err, result) => {
          if (err) reject(err);
          else if (!result) resolve(false);
          else resolve(result);
        });
      });

      console.log(createConfigResult)
    }).finally(() => {
      console.log("MongoDB has closed.");
      mongoose.connection.close();
    });
  } catch (e) {
    console.log("adminConfigInsert Error -> ");
    console.log(e);
  }
};


//Update
function update_adminConfig(req, res, next) {
  try {

    let admin_connectionUrl = config.env.mongoDBUri.replace("ConfigReader", "ConfigWriter")

    connect(
      admin_connectionUrl,
      config.env.databaseName
    ).then(async () => {
      await AdminConfigModel.updateOne(
        { _id: 1 },
        {
          databaseName: [{ profileService: "profile" }, { projectService: "project"}],
          port: [{ profileService: "3000" }, {projectService: "4000"}],
          connectionUrl: [{
            profileService:
              "mongodb+srv://ProfileWriter:12345678Abc@cluster0-7pv9s.mongodb.net/profile?retryWrites=true&w=majority",
          }, {projectService: "mongodb+srv://ProjectWriter:12345678Abc@cluster0-7pv9s.mongodb.net/project?retryWrites=true&w=majority"}]
        },
        { upsert: true },
        function(err, result) {
          if(err) throw err
        }
      );
    }).finally(() => {
      console.log("MongoDB has closed.");
      mongoose.connection.close();
    });
  } catch (e) {
    console.log("adminConfigUpdate Error -> ");
    console.log(e);
  }
};

module.exports = { 
  add_adminConfig,
  update_adminConfig,
};