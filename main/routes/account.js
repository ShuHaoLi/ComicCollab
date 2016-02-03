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
    return Account;
})();
//# sourceMappingURL=account.js.map