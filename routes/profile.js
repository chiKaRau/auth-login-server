//DATABASE MODEL
const profileDB = require("../models/profile"),
  ObjectId = require("mongoose").Types.ObjectId;
const bcrypt = require("bcrypt");  

//PASSPORT
const passport = require('passport');

//CONFIG
const config = require("../config/config");

//DATABASE SERVICES
const { 
  getUser_UserInfo_ByID,
  setUser_UserInfo_ByID
} = require("../services/profileDB")

/*************
 * Functions *
 *************/

/***********
 *  WRITE  *
 ***********/
let setUserInfo = async (req, res, next) => {
  try {
    console.log("Setting user info...")
    passport.authenticate('jwt_verify_access_token', {session: false}, async (err, user, info) => {
      let updatedUser = await setUser_UserInfo_ByID(user._id, req.body)
      res.send({user: updatedUser})
    })(req, res);

  } catch(e) {
    console.log("SET USERINFO ERROR -> ");
    console.log(e)
    return res.status(500).send({ error: 'Something has gone wrong, please try again' });
  }
}


/************
 *   READ   *
 ************/
let getUserInfo = async (req, res, next) => {
  try {
    console.log("Getting user info...")
    passport.authenticate('jwt_verify_access_token', {session: false}, async (err, user, info) => {
      res.send({user: user})
    })(req, res);
  } catch (e) {
    console.log("GET USERINFO ERROR");
    return res.status(500).send({ error: 'Something has gone wrong, please try again' });
  }
};


module.exports = { setUserInfo, getUserInfo }