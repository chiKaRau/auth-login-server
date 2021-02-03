//DATABASE MODEL
const profileDB = require("../models/profile"),
  ObjectId = require("mongoose").Types.ObjectId;
const bcrypt = require("bcrypt");  

//Now please consider Account_info is on the Auth Api for verifly user
//and User_Info is on the Main Application Api for retrieving user Info

/*************
 * Functions *
 *************/
//Hash Password
let saltRounds = 10;
function hashpassword(myPlaintextPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
      err ? reject(err) : resolve(hash);
    });
  });
}

/****************
 * Account_Info *
 ****************/
function setUser_AccountInfo(accountInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      accountInfo.password = await hashpassword(accountInfo.password)
      let user = new profileDB.ProfileAccountInfoModel(accountInfo);
      await user.save();
      return resolve(user)
    } catch(err) {
      return reject(err)
    }
  });
}

function getUser_AccountInfo_ByUsername(username) {
  return new Promise((resolve, reject) => {
      profileDB.ProfileAccountInfoModel.findOne(
        { username: username.toLowerCase() },
        (err, result) => {
          if (err) reject(err);
          else if (!result) resolve(false);
          else resolve(result);
        }
      );
    })
}

function updateUser_AccountInfo_ByID(_id, accountInfo) {
  return new Promise(async (resolve, reject) => {
    profileDB.ProfileAccountInfoModel.updateOne(
      { _id: ObjectId(_id) },
      accountInfo,
      (err, result) => {
        if (err) reject(err);
        else if (!result) resolve(false);
        else resolve(result);
      }
    );
  })
}

function check_AccountInfo_ByRefreshToken(refresh_token) {
  return new Promise((resolve, reject) => {
      profileDB.ProfileAccountInfoModel.findOne(
        { refresh_token: refresh_token },
        (err, result) => {
          if (err) reject(err);
          else if (!result) resolve(false);
          else resolve(result);
        }
      );
    })
}

/***************
 *  User_Info  *
 ***************/
function getUser_UserInfo_ByID(id) {
  return new Promise((resolve, reject) => {
      profileDB.ProfileUserInfoModel.findOne(
        { _id: ObjectId(id) },
        (err, result) => {
          if (err) reject(err);
          else if (!result) resolve(false);
          else resolve(result);
        }
      );
    });
}

function setUser_UserInfo_ByID(_id, userinfo) {
  return new Promise(async (resolve, reject) => {
    profileDB.ProfileUserInfoModel.updateOne(
      { _id: ObjectId(_id) },
      userinfo,
      { upsert: true },
      (err, result) => {
        if (err) reject(err);
        else if (!result) resolve(false);
        else resolve(result);
      }
    );
  })
}

module.exports = { 
  setUser_AccountInfo, 
  getUser_AccountInfo_ByUsername,
  updateUser_AccountInfo_ByID,
  check_AccountInfo_ByRefreshToken,
  setUser_UserInfo_ByID,
  getUser_UserInfo_ByID
};