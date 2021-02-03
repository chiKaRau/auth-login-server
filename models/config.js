/**
 * Note: config.js supposes serves inside Admin microservices
 * This node.js app is just a sample of modern server (We are using Profile as example)
 */

const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId,
  config = require("../config/config");

const AdminConfigScheme = new Schema(
  {
    _id: { type: Number },
    databaseName: { type: Array, default: [] },
    port: { type: Array, default: [] },
    connectionUrl: { type: Array, default: [] }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

let AdminConfigModel = mongoose.model(
  config.env.collectionName,
  AdminConfigScheme,
  config.env.collectionName
);

module.exports = AdminConfigModel;