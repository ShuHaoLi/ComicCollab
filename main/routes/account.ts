/**
 * Created by wendywang on 2016-02-01.
 */
///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/>
class Account {
    username : string;
    password : string;
    constructor(username, password){
        this.username = username;
        this.password = password;
    }
    getUsername() {return this.username;}
    getPassword() {return this.password;}
}
