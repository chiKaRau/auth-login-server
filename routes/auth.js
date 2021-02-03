//DATABASE MODEL
const profileDB = require("../models/profile"),
  ObjectId = require("mongoose").Types.ObjectId;
const bcrypt = require("bcrypt");  

//JWT
const jwt = require('jsonwebtoken');
const passport = require('passport');
const {
  generateJWT,
  verifyJWT,
  decodeJWT
} = require("../services/jwt")
const moment = require('moment');

const refresh_token_time = 60 * 2
const access_token_time = 60 * 1

//COOKIE
//Note: Not sure how to set cookie in express.js 
//Now only storing on client cookie
// Set the options for the cookie
let cookieOptions = {
    // Delete the cookie after 1 days
    expires: new Date(new Date().getTime() + 1 * 60 * 1000),
    // Set the cookie's HttpOnly flag to ensure the cookie is 
    // not accessible through JS, making it immune to XSS attacks  
    httpOnly: true,
};

//DATABASE SERVICES
const { 
  setUser_AccountInfo, 
  getUser_AccountInfo_ByUsername,
  updateUser_AccountInfo_ByID,
  check_AccountInfo_ByRefreshToken,
  getUser_UserInfo_ByID,
  setUser_UserInfo_ByID
} = require("../services/profileDB")

//CONFIG
const config = require("../config/config");

/***************
 *  FUNCTIONS  *
 ***************/
let generateResponseData = async (_id) => {
  let refresh_token = await generateJWT({}, refresh_token_time)
  let access_token = await generateJWT({_id: _id}, access_token_time)

  //Store the refresh token into DB
  updateUser_AccountInfo_ByID(_id, {refresh_token: refresh_token})

  return {
    success: true, 
    token_type:"bearer",
    access_token: access_token,
    access_expires_in: new Date(new Date().getTime() + access_token_time * 1000),
    refresh_token: refresh_token, 
    refresh_expires_in: new Date(new Date().getTime() + refresh_token_time * 1000)
  }

}

/***********
 *  WRITE  *
 ***********/
let register = async (req, res, next) => {
  try {

    //Find user for preventing duplicate
    let isDuplicate = await getUser_AccountInfo_ByUsername(req.body.username)
    if(isDuplicate) {
      return res.status(409).send({ error: 'duplicate username' });
    }

    //Save user 
    let user = await setUser_AccountInfo({...req.body, loginMethod: "local"})

    //Setup user info
    setUser_UserInfo_ByID(user._id, req.body)

    let data = await generateResponseData(user._id)
    res.send(data)
  } catch(e) {
    console.log("REGISTER ERROR -> ");
    console.log(e)
    return res.status(500).send({ error: 'Something has gone wrong, please try again' });
  }
}


/************
 *   READ   *
 ************/

let localLogin = async (req, res, next) => {
  try {
    console.log("Local logging in...")
    return passport.authenticate('local', {session: false}, async (err, user, info) => {
      let data = await generateResponseData(user._id)
      res.send(data)
    })(req, res);
  } catch (e) {
    console.log("LOCAL LOGIN ERROR");
    console.log(e)
    return res.status(500).send({ error: 'Something has gone wrong, please try again' });
  
  }
};

//->CHANGE<-
//DOMAIN
//const client_domain = "http://localhost:3000/"
const client_domain = "https://2puw7.csb.app/"

let twitterRedirect = async (req, res, next) => {
  try {
    console.log("Twitter Logging in...")
    await passport.authenticate('twitter', async function(err, user, info){

      if(err) {
        return res.redirect(client_domain)
      }

      let refresh_token = await generateJWT({}, refresh_token_time)
      let access_token = await generateJWT({_id: user._id}, access_token_time)
      let access_expires_in = new Date(new Date().getTime() + access_token_time * 1000)
      let refresh_expires_in = new Date(new Date().getTime() + refresh_token_time * 1000)

      //Store the refresh token into DB
      updateUser_AccountInfo_ByID(user._id, {refresh_token: refresh_token})

      res.redirect(`${client_domain}?refresh_token=${refresh_token}&access_token=${access_token}&access_expires_in=${access_expires_in}&refresh_expires_in=${refresh_expires_in}`);
    })(req, res, next);
  } catch (e) {
    console.log("Twitter REDIRECT ERROR");
    console.log(e)
    return res.status(500).send({ error: 'Something has gone wrong, please try again' });
  }
};

let refresh = async (req, res, next) => {
  try {
    console.log("Refreshing tokens...")
    const current_refresh_token = req.headers.authorization.split(" ")[1]

    //Verify JWT, if fail, throw error
    await verifyJWT(current_refresh_token)
    
    let user = await check_AccountInfo_ByRefreshToken(current_refresh_token)

    if(!user) {
      return res.status(404).send({ error: 'No user are found' });
    }

    if(user.refresh_token !== current_refresh_token) {
      return res.status(404).send({ error: 'User token are not match' });
    }

    let data = await generateResponseData(user._id)
    res.send(data)

  } catch (e) {
    console.log("REFRESH ERROR");
    if(e.name === "TokenExpiredError") {
      console.log("Refresh Token is expired.")
      return res.status(401).send({ error: 'Token is expired.' });
    }
    return res.status(500).send({ error: 'Something has gone wrong, please try again.' });
  
  }
};

let logout = async (req, res, next) => {
  try {

    const current_refresh_token = req.headers.authorization.split(" ")[1]

    //Remove the refresh token in database
    let user = await check_AccountInfo_ByRefreshToken(current_refresh_token)

    if(!user) {
      return res.status(404).send({ error: 'No user are found' });
    }

    if(user.refresh_token !== current_refresh_token) {
      return res.status(404).send({ error: 'User token are not match' });
    }

    updateUser_AccountInfo_ByID(user._id, {refresh_token: ""});

    req.logout();
    res.redirect('/');
  } catch (e) {
    console.log("LOGOUT ERROR")
    console.log(e)
    return res.status(500).send({ error: 'Something has gone wrong, please try again' });
  
  }
};

module.exports = { register, localLogin, twitterRedirect, refresh, logout }