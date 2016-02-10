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
        var multer = require('multer');
        var path = require('path');
        var fs = require('fs');

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

        /* GET UPLOAD COMICS PAGE */
        router.get('/uploadcomics/*', function(req, res) {
            res.render('uploadcomics', {cur: req.currentUser});
        });

        var comicnum = 1;
        /* POST TO UPLOAD COMICS PAGE */
        router.post('/uploadcomics/*', function(req, res) {

            var comicId : String = req.params[0];
            var db = req.db;
            var collection = db.get('comicimages');

            /* look for comic in the database */
            collection.find({"comicId": comicId}, function(err, docs) {
                var sequence : number;
                /* if the comic already exists in the database, we want to add the new image to the end */
                if (docs.length != 0) {
                    var curMost : number = 0;
                    /* for each image associated with that comic, find the last image (aka image with
                       the highest sequence number) */
                    for (var i = 0; i < docs.length; i++) {
                        var seq = parseInt(docs[i]['sequence']);
                        if (seq > curMost) {
                            curMost = seq;
                        }
                    }
                    sequence = curMost;
                /* if the comic doesn't exist in the database, set its seq to 0 */
                } else {
                    sequence = 0;
                }
                /* insert the comic image (with its associated details) in the last
                   sequence (or initial sequence) */
                for (var i = 0; i < req.files.length; i++ ) {
                    var nextSequence : number = sequence + 1;
                    collection.insert({
                        "comicId": comicId,
                        "creator": req.currentUser.getUsername(),
                        "url": "/images/" + req.files[i].filename,
                        "sequence": nextSequence.toString()
                    });
                    sequence = nextSequence;
                }
            });
            /* redirect to new page */
            res.redirect("../../comic/" + comicId);
        });

        router.get('/', function(req, res){
            res.render('index');
        });

        module.exports = router;
    }
}

var router = new Router();
