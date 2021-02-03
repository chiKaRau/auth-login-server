const express = require("express");
const {
  register,
  localLogin,
  twitterRedirect,
  refresh,
  logout
} = require("./auth");

const { setUserInfo, getUserInfo } = require("./profile")

//PASSPORT
const { passport } = require('../services/passport');

//Now please consider Account_info is on the Auth Api for verifly user
//and User_Info is on the Main Application Api for retrieving user Info

module.exports = function(app) {
  // Initializing route groups
  const apiRoutes = express.Router();

  // Set url for API group routes
  app.use("/api", apiRoutes);

  /**********************
   * Auth Server Routes *
   **********************/
  const authRoutes = express.Router(); 

  // Set Auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/auth", authRoutes);

  //Auth Register : Profile Account Info Route
  //API Route : /api/auth/register
  authRoutes.post("/register", register);

  //Auth Login : Profile Account Info Route
  //API Route : /api/auth/login
  authRoutes.post("/localLogin", passport.authenticate('local'), localLogin);

  //Auth Twitter : Profile Account Info Route
  //API Route : /api/auth/twitterLogin
  authRoutes.get("/twitterLogin", passport.authenticate("twitter"));  

  //Auth Twitter : Profile Account Info Route
  //API Route : /api/auth/twitterLogin/callback
  authRoutes.get("/twitterLogin/redirect", twitterRedirect);

  //Auth Refresh : Profile Account Info Route
  //API Route : /api/auth/refresh
  authRoutes.post("/refresh", refresh); 
  
  //Auth Refresh : Profile Account Info Route
  //API Route : /api/auth/logout
  authRoutes.post("/logout", logout);  

  /*************************
   * Profile Server Routes *
   *************************/  
  const profileRoutes = express.Router(); 

  // Set Profile routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/profile", profileRoutes);

  //Profile SET : Profile User Info Route
  //API Route : /api/profile/setUserInfo
  profileRoutes.post("/setUserInfo", passport.authenticate('jwt_verify_access_token'),setUserInfo);

  //Profile Get : Profile User Info Route
  //API Route : /api/profile/getUserInfo
  profileRoutes.post("/getUserInfo", passport.authenticate('jwt_verify_access_token'), getUserInfo);


};
