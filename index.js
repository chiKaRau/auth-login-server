/*
INTRODUCTION
Client: https://2puw7.csb.app/
Client Source Code : https://codesandbox.io/s/auth-pratice-2puw7?file=/src/index.js
Server: https://repl.it/@chiKaRau/auth-pratice#index.js

This is a sample OAuth which allow the users to login locally and third parties such as Twitter by using passport.js and jwt for verification.
*/

//EXPRESS
const express = require('express');
const app = express();

//QUICK EDIT
//ADMIN
const { 
  add_adminConfig,
  update_adminConfig,
} = require("./database/admin_QuickEdit");
//PROFILE
const { 
  add_account,
  update_account,
  update_field
} = require("./database/profile_QuickEdit");


//CONFIG
const config = require("./config/config")

//COOKIE SESSION
const cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: ["thisappisawesome"],
    maxAge: 24 * 60 * 60 * 100
  })
);

//COOKIE
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//PASSPORT
const { passport } = require('./services/passport');
app.use(passport.initialize());
app.use(passport.session());

//->CHANGE<-
//DOMAIN
//const client_domain = "http://localhost:3000"
const client_domain = "https://2puw7.csb.app"

//CORS
const cors = require("cors");
app.use(
  cors({
    origin: client_domain, // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

//DATABASE CONNECTION
const { callConfig } = require("./database/callConfig");
const { connectProfileDB } = require("./models/profile");

//BODYPARSER
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//setting up basic middleware for all Express requests
const logger = require('morgan');
app.use(logger('dev')); // Log requests to API using morgan

app.get('/', (req, res) => {
  var responseText = 'Hello World!<br>'
  responseText += '<small>Requested at: ' + req.requestTime + '</small>'
  res.send(responseText)
});

//Call AdminConfig to get Profile config data
/** Flow
 *  Call AdminConfig to get profile ConnectionUrl
 *  createConnection for profile Connection to connect to DB 
 */
async function start() {
  console.log("Profile Server is Calling Config...");
  try {
    //Setup Global variables for config data
    let { databaseName, port, connectionUrl } = await callConfig()
    global.databaseName = databaseName[0].profileService;
    global.port = port[0].profileService;
    global.connectionUrl = connectionUrl[0].profileService;

    app.listen(global.port, () => console.log('Server is running on port ' + global.port));
    connectProfileDB(global.connectionUrl)

    //Quick Edit Section
    /**
     * Please uncomment adminConfigSetup() after finish editing.
     * This has conflict with start() 
     */
    //update_field(databaseName[0].profileService,port[0].profileService,connectionUrl[0].profileService)

  } catch (e) {
    console.log(e)
    console.log("Fail to retrieve config data.")
  }
}


const router = require("./routes/router");
router(app);

start()

//Quick Edit Section
/**
 * Please uncomment adminConfigSetup() after finish editing.
 * This has conflict with start() 
 */
//adminConfigUpdate()
//adminConfigInsert()