///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/>
interface UserInterface {
    getUsername() : String;
    getPassword() : String;
}

class User implements UserInterface {
    private username: String;
    private password: String;
    constructor(username: String, password: String) {
        this.username = username;
        this.password = password;
    }
    getUsername(){
        return this.username;
    }
    getPassword(){
        return this.password;
    }
}

class Router{
    constructor(){
        var express = require('express');
        var router = express.Router();

        /* GET home page. */
        router.get('/home', function(req, res) {
            res.render('home');
        });

        /* GET login page. */
        router.get('/login', function(req, res) {
            res.render('login', { loginError: ''});
        });

        /* POST for login page */
        router.post('/login', function(req, res) {

            // Set our internal DB variable
            var db = req.db;

            // Get our form values. These rely on the "name" attributes
            var username = req.body.username;
            var password = req.body.password;

            // Set our collection
            var collection = db.get('usercollection');

            collection.findOne({
                "username": username.toLowerCase(),
                "password": password
            }, function(err, docs) {
                if (docs != null) {
                    var currentUser = req.currentUser;
        			currentUser.setUsername(username);
        			currentUser.setIsLoggedIn(true);
                    res.redirect('home');
                } else {
                    res.render('login', { loginError: 'Login failed, invalid credentials'});
                }
            });
        });

        router.get('/comic/*', function(req, res) {
            var comicNumber = req.params['0'];

            res.render('comic', { comicNumber: comicNumber.toString()});
        });

        /* GET Create Profile page. */
        router.get('/createprofile', function(req, res) {
            res.render('createprofile');
        });

        /* POST to UserList Page */
        router.post('/createprofile', function(req, res) {

            // Set our internal DB variable
            var db = req.db;

            // Get our form values. These rely on the "name" attributes
            var userName = req.body.username;
            var password = req.body.password;
            var confirmPassword = req.body.confirmPassword;

            if (!password == confirmPassword){
                res.send("Passwords do not match");
            }
            else {
                var user : User = new User(req.body.username, req.body.password);

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
