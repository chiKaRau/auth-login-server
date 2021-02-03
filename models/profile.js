const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId,
  config = require("../config/config");

/**********
 * SCHEMA *
 **********/
//Profile Account Info Scheme
const ProfileAccountInfoScheme = new Schema(
  {
    username: { type: String, default: ""},
    password: { type: String, default: "" },
    email: { type: String, default: "" },
    refresh_token: {type: String, default: ""},
    loginMethod: {type: String, default: ""}
  },
  {
    versionKey: false,
    timestamps: true
  }
);

//Profile User Info Scheme
const ProfileUserInfoScheme = new Schema(
  {
    _id: { type: ObjectId },
    firstname: { type: String, default: "" },
    lastname: { type: String, default: "" },
    birthdate: { type: String, default: "" },
    gender: { type: String, default: "" },
    country: { type: String, default: "" },
    city: { type: String, default: "" },
    zipcode: { type: String, default: "" },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

/***********
 *  MODEL  *
 ***********/
let ProfileAccountInfoModel, ProfileUserInfoModel;
function connectProfileDB(connectionUrl) {
  /**
   * Reason of using createConnection is createConnection allows to swtiching with 
   * different database by apply different connectionUrl
   * Note : the profile's connectionUrl has the "profile" to identify the database to 
   * connect with 
   */

  mongoose.createConnection(connectionUrl, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(dbConn => {
      console.log("Connected Profile database")
      module.exports.ProfileAccountInfoModel = dbConn.model(
        "account_info",
        ProfileAccountInfoScheme,
        "account_info"
      );
      module.exports.ProfileUserInfoModel = dbConn.model(
        "user_info",
        ProfileUserInfoScheme,
        "user_info"
      );
    }).catch(err => {
      console.log(err)
      console.log("Failed to connect Profile database.")
    })
}

module.exports.connectProfileDB = connectProfileDB;

module.exports.ProfileAccountInfoModelForAdmin = mongoose.model(
        "account_info",
        ProfileAccountInfoScheme,
        "account_info"
      );

module.exports.ProfileUserInfoModelForAdmin = mongoose.model(
        "user_info",
        ProfileUserInfoScheme,
        "user_info"
      );