const jwt = require("jsonwebtoken");
const config = require("../config/config")
const moment = require('moment');

//Generate a JWT
function generateJWT(payload, expiresIn) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, config.passport.secret, {
            expiresIn: expiresIn
        }, (error, jwt) => {
            error ? reject(error) : resolve(jwt);
        })
    });
}

//Verify and Decode a JWT
function verifyJWT(token, key = config.passport.secret) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, key, (err, decodedJWT) => {
            err ? reject(err) : resolve(decodedJWT);
        });
    })
}

//Decode a JWT without Verify
function decodeJWT(token) {
    return jwt.decode(token, { complete: true });
}

module.exports = {
  generateJWT,
  verifyJWT,
  decodeJWT
}