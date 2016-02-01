/**
 * Created by wendywang on 2016-02-01.
 */
///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/>
class User {
    username : string;
    password : string;
    constructor(username, password){
        this.username = username;
        this.password = password;
    }
    getUsername() {return this.username;}
    getPassword() {return this.password;}
}


class Router{
    constructor(){
        var express = require('express');
        var router = express.Router();

        /* GET home page. */
        router.get('/main', function(req, res) {
            res.render('main');
        });

        /* GET login page. */
        router.get('/login', function(req, res) {
            res.render('login');
            res.redirect('main');
        });

        /* GET Create Profile page. */
        router.get('/createprofile', function(req, res) {
            res.render('createprofile');
        });

///* GET Default Home page. */
//router.get('/home', function(req, res) {
//  res.render('home', { title: 'Comic Books Home Page' });
//});

        /* POST to UserList Page */
        router.post('/createprofile', function(req, res) {

            // Set our internal DB variable
            var db = req.db;

            // Get our form values. These rely on the "name" attributes
            var userName = req.body.username;
            var password = req.body.password;
            var confirmPassword;
            var user = new User(this.username, this.password);

            if (!password == confirmPassword){
                res.send("Passwords do not match");
            }
            else {
                // Set our collection
                var collection = db.get('usercollection');
                // Submit to the DB
                collection.insert({
                        "username": user.getUsername(),
                        "password": user.getPassword()
                    }, function (err, doc) {
                        if (err) {
                            // If it failed, return error
                            res.send("There was a problem adding the information to the database.");
                        }
                        else {
                            // And forward to home page
                            res.redirect("main");
                        }

                    }
                );
            }
        });

        module.exports = router;
    }
}

var router = new Router();

