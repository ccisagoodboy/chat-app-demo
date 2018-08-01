"use strict";
exports.__esModule = true;
var http_1 = require("http");
var SocketIO = require("socket.io");
var express = require("express");
var map_1 = require("./utils/map");
var messageType_1 = require("./model/messageType");
var ChatServer = /** @class */ (function () {
    function ChatServer() {
        this.port = 8080;
        this.currentUser = new map_1.UserMap();
        this.allMessages = [];
        this.app = express();
        this.server = http_1.createServer(this.app);
        this.io = SocketIO(this.server);
        this.listen();
    }
    ChatServer.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log('Server is runing on port %s', _this.port);
        });
        this.io.on('connect', function (socket) {
            socket.on('login', function (username) {
                console.log('recived a login request from ' + username);
                if (_this.currentUser.hasUser(username)) {
                    socket.emit('loginResponse', 'rejected');
                    console.log('login request rejected from ' + username);
                }
                else {
                    _this.sendHistoryMessages(socket);
                    socket.emit('loginResponse', 'accepted');
                    socket.broadcast.emit('message', {
                        from: username,
                        messageType: messageType_1.MessageType.JOINED
                    });
                    _this.currentUser.add(username, socket.id);
                    console.log('login request accepted ' + username);
                }
            });
            socket.on('disconnect', function () {
                var user = _this.findDisconnectedUser(socket);
                console.log("deleting disconnected user " + user);
                _this.currentUser["delete"](user);
                socket.broadcast.emit('message', {
                    from: user,
                    messageType: messageType_1.MessageType.LEFT
                });
            });
            socket.on('message', function (m) {
                console.log('received a normal chat message. adding to cache.');
                _this.allMessages.push(m);
                _this.io.emit('message', m);
            });
        });
    };
    ChatServer.prototype.sendHistoryMessages = function (socket) {
        for (var _i = 0, _a = this.allMessages; _i < _a.length; _i++) {
            var message = _a[_i];
            socket.emit('message', message);
        }
    };
    ChatServer.prototype.findDisconnectedUser = function (socket) {
        return this.currentUser.getUser(socket.id);
    };
    ChatServer.prototype.getApp = function () {
        return this.app;
    };
    return ChatServer;
}());
exports.ChatServer = ChatServer;
