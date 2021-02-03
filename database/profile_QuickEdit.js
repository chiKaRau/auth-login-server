/**
 * Note: admindbService.js supposes serves inside Admin microservices
 * This node.js app is just a sample of modern server (We are using Profile as example)
 */

const { connect } = require("./dbConnect");
const {ProfileAccountInfoModelForAdmin, ProfileUserInfoModelForAdmin} = require("../models/profile");
const config = require("../config/config");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

//add
function add_account(databaseName, port, connectionUrl) {
  try {
    connect(
      connectionUrl,
      databaseName
    ).then(async () => {
      
      let data = {
        username: "Rex",
        password: "12345678",
        email: "Rex@live.com"
      }

      let createAccount = ProfileAccountInfoModelForAdmin(data);
      //Wait for the result of createAccount
      //if "err", it breaks and send error to catch block
      let createAccountResult = await new Promise((resolve, reject) => {
        createAccount.save((err, result) => {
          if (err) reject(err);
          else if (!result) resolve(false);
          else resolve(result);
        });
      });

      console.log(createAccountResult)
     
    
    }).finally(() => {
      console.log("MongoDB has closed.");
      mongoose.connection.close();
    });
    
  } catch (e) {
    console.log("profileAccountInfoInsert Error -> ");
    console.log(e);
  }
};

//Update
function update_account(databaseName, port, connectionUrl) {
  try {
    connect(
      connectionUrl,
      databaseName
    ).then(async () => {
      
      let data = {
        username: "Rex",
        password: "1234567890",
        email: "Rex@live.com"
      }
      
      await ProfileAccountInfoModelForAdmin.updateOne(
        { _id: ObjectId("5ee7c5fca946a0028fbb39ce") },
        data,
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
    console.log("profileAccountInfoUpdate Error -> ");
    console.log(e);
  }
};

//update_field
function update_field(databaseName, port, connectionUrl) {
  try {
    connect(
      connectionUrl,
      databaseName
    ).then(async () => {
      
      let data = {
        loginMethod: ""
      }
      
      await ProfileAccountInfoModelForAdmin.updateMany(
        {},
        data,
        { multi:true },
        function(err, result) {
          if(err) throw err
        }
      );

    }).finally(() => {
      console.log("MongoDB has closed.");
      mongoose.connection.close();
    });
    
  } catch (e) {
    console.log("profileAccountInfoUpdate Error -> ");
    console.log(e);
  }
};


module.exports = { 
  add_account,
  update_account,
  update_field
};