"use strict";
exports.__esModule = true;
var UserMap = /** @class */ (function () {
    function UserMap() {
        this.obj = {};
    }
    UserMap.prototype.add = function (user, socket) {
        if (this.hasUser(user)) {
            return;
        }
        this.obj[user] = socket;
        this.obj[socket] = user;
    };
    UserMap.prototype["delete"] = function (user) {
        var socketToDelete = this.getSocket(user);
        delete this.obj[user];
        delete this.obj[socketToDelete];
    };
    UserMap.prototype.hasUser = function (user) {
        return this.obj[user];
    };
    UserMap.prototype.getSocket = function (key) {
        return this.obj[key];
    };
    UserMap.prototype.getUser = function (socket) {
        return this.obj[socket];
    };
    UserMap.prototype.clear = function () {
        this.obj = {};
    };
    return UserMap;
}());
exports.UserMap = UserMap;
