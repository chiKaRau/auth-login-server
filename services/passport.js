//PASSPORT
const passport    = require('passport');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const JWTStrategy   = passportJWT.Strategy;

const config = require("../config/config");
const bcrypt = require("bcrypt"); 

//DATABASE SERVICES
const { 
  setUser_AccountInfo, 
  getUser_AccountInfo_ByUsername,
  updateUser_AccountInfo_ByID,
  check_AccountInfo_ByRefreshToken,
  getUser_UserInfo_ByID,
  setUser_UserInfo_ByID
} = require("./profileDB")

//JWT
const jwt = require('jsonwebtoken');
const {
  generateJWT,
  verifyJWT,
  decodeJWT
} = require("../services/jwt")
const moment = require('moment');

passport.serializeUser(function(user, done){
    return done(null, user.id);
});

passport.deserializeUser((id, done) => {
    return done(null, id);
});

/*****************
 * Auth Passport *
 *****************/ 
passport.use('local', new LocalStrategy({
      usernameField: 'username',
  },
  async function (username, password, done) {
   try {
     
    //Username or Password are empty
    if(!username || !password) return done(null, false, { error: 'Username and password are missing.' });

    //Find user account info
    let user = await getUser_AccountInfo_ByUsername(username)

    //User is not existed
    if (!user)
      return done(null, false, { error: 'Your login details could not be verified. Please try again.' });


    //Compare user password and database password
    bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) { return done(err); }

        //Password not match
        if (!isMatch) { return done(null, false, { error: "Your login details could not be verified. Please try again." }); }

        return done(null, user);
    });
    

   } catch(e) {
     return done(e);
   }  
          
  }
  
));

//->CHANGE<-
//const server_domain = "http://localhost:4000"
const server_domain = "https://auth-pratice.chikarau.repl.co"

passport.use("twitter", new TwitterStrategy({
      // options for the twitter start
      consumerKey: config.twitter.apiKey,
      consumerSecret: config.twitter.apiSecretKey,
      callbackURL: server_domain + "/api/auth/twitterLogin/redirect",
      includeEmail: true
    },
    async (token, tokenSecret, profile, done) => {
      const { emails, username, id, displayName } = profile
      
      //find current user in UserModel
      let currentUser = await getUser_AccountInfo_ByUsername(username.toLowerCase())

      let data = {
        username: username.toLowerCase(),
        password: id,
        email: emails[0].value,
        loginMethod: "twitter"
      }
      
      if (!currentUser) {
        //Save user 
        let newUser = await setUser_AccountInfo(data)

        let userInfo = {
          firstname: displayName,
          lastname:"" ,
          birthdate:"",
          gender: "",
          country: "",
          city:"",
          zipcode: "",
        }

        //Setup user info
        await setUser_UserInfo_ByID(newUser._id, userInfo)

        if (newUser) {
          done(null, newUser);
        }
      }
      return done(null, currentUser);
    }
  )
);

/********************
 * Profile Passport *
 ********************/  
//Note: JWTStrategy will automatically verify the expire date
passport.use('jwt_verify_access_token', new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey   : config.passport.secret
  },
  async function (jwtPayload, done) {
    try {
      //Find user account info
      let user = await getUser_UserInfo_ByID(jwtPayload._id)
      
      //User is not existed
      if (!user)
        return done(null, false, { error: 'Your login details could not be verified. Please try again.' });

      return done(null, user);

    } catch(e) {
      return done(e)
    }
  }
));

module.exports = { passport };