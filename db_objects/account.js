/**
 * Created by wendywang on 2016-02-01.
 */
///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/>
var Account = (function () {
    function Account(username, password) {
        this.username = username;
        this.password = password;
    }
    Account.prototype.getUsername = function () { return this.username; };
    Account.prototype.getPassword = function () { return this.password; };
    Account.prototype.setUsername = function (username) {
        this.username = username;
    };
    Account.prototype.setPassword = function (password) {
        this.password = password;
    };
    return Account;
}());
