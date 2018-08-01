"use strict";
exports.__esModule = true;
var chatServer_1 = require("./chatServer");
var app = new chatServer_1.ChatServer().getApp();
exports.app = app;
