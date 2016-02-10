///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/>
///<reference path='../db_objects/account.ts'/>
interface UserInterface {
    getUsername() : String;
    getPassword() : String;
    getFullName() : String;
    getGender() : String;
    getAge() : String;
    getLocation() : String;
    getAboutMe() : String;
}
class User implements UserInterface {
    private username: String;
    private password: String;
    private fullname: String;
    private gender: String;
    private age: String;
    private aboutme: String;
    private location: String;
    constructor(username: String, password: String, fullname: String,
                gender: String, age: String, aboutme: String, location: String) {
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.gender = gender;
        this.age = age;
        this.aboutme = aboutme;
        this.location = location;
    }
    getUsername(){
        return this.username;
    }
    getPassword(){
        return this.password;
    }
    getFullName(){
        return this.fullname;
    }
    getGender(){
        return this.gender;
    }
    getAboutMe(){
        return this.aboutme;
    }
    getLocation(){
        return this.location;
    }
    getAge(){
        return this.age;
    }
}

class Router {
    constructor() {
        var express = require('express');
        var router = express.Router();
        var multer = require('multer');
        var path = require('path');
        var fs = require('fs');

        /* GET home page. */
        router.get('/home', function (req, res) {
            var db = req.db;
            var collection = db.get('comicimages');
            var urls = [];
            var comicIds = [];
            collection.find({"sequence": "1"}, function (err, docs) {
                if (docs.length > 0) {
                    //console.log(docs);
                    for (var i = 0; i < docs.length; i++) {
                        //console.log(docs[i]);
                        urls.push(docs[i]['url']);
                        comicIds.push("../comic/" + docs[i]['comicId']);
                    }
                }
                console.log(urls);
                console.log(comicIds);
                res.render('home',
                    {cur: req.currentUser, urls: urls, comicIds: comicIds}
                );
            });
        });
        
        /* GET home page. */
        router.get('/', function (req, res) {
            res.render('home',
                {cur: req.currentUser});
        });

        /* GET login page. */
        router.get('/login', function (req, res) {
            res.render('login', {loginError: ''});
        });

        /* POST for login page */
        router.post('/login', function (req, res) {
            // Set our internal DB variable
            var db = req.db;
            // Get our form values. These rely on the "name" attributes
            var username = req.body.username;
            var password = req.body.password;

            // Set our collection
            if (password.length < 4 || password.length > 20) {
                res.render('login', {loginError: 'Password needs to be between 4 - 20 characters. Please try again!'});
            } else {
                var collection = db.get('usercollection');
                collection.findOne({
                    "username": username.toLowerCase(),
                    "password": password
                }, function (err, docs) {
                    if (docs != null) {
                        var currentUser = req.currentUser;
                        currentUser.setUsername(username);
                        currentUser.setIsLoggedIn(true);
                        res.redirect('../home');
                    } else {
                        res.render('login', {loginError: 'Login failed, invalid credentials'});
                    }
                });
            }
        });

        router.get('/comic/*', function(req, res) {
            var comicId : String = req.params['0'];
            var db = req.db;
            var collection = db.get('comicimages');
            collection.find({
                "comicId": comicId
            }, function(err, docs) {
                var images = [];
                if (docs.length != 0) {
                    for (var i=0; i<docs.length; i++) {
                        images.push(docs[i]['url']);
                    }
                }
                res.render('comic', {
                    comicNumber: comicId.toString(),
                    images: images});
            });
        });

        /* GET Create Profile page. */
        router.get('/createprofile', function (req, res) {
            res.render('createprofile');
        });

        /* GET logout */
        router.get('/logout', function (req, res) {
            var currentUser = req.currentUser;
            if (!currentUser.isLoggedIn) {
                res.redirect('/home');
            }
            else {
                currentUser.setIsLoggedIn(false);
                currentUser.setUsername("");
                res.redirect('/home');
            }
        });

        /* POST to UserList Page */
        router.post('/createprofile', function (req, res) {

            // Set our internal DB variable
            var db = req.db;

            // Get our form values. These rely on the "name" attributes
            var userName = req.body.username;
            var password = req.body.password;
            var confirmPassword = req.body.confirmPassword;
            if (password.length < 4 || password.length > 20) {
                res.send("Password needs to be between 6 - 20 characters. Please try again!");
            }
            else if (password != confirmPassword) {
                res.send("passwords do not match");
            }
            else {
                var user:User = new User(req.body.username, req.body.password, req.body.fullname,
                    req.body.age, req.body.aboutme, req.body.gender, req.body.location);

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
                    collection.findOne({
                        "username": userName.toLowerCase()
                    }, function (err, docs) {
                        if (docs != null) {
                            res.send("Username has already exist. Please enter a new username");

                        } else {
                            // Submit to the DB
                            collection.insert({
                                "username": user.getUsername(),
                                "password": user.getPassword(),
                                "fullname": "",
                                "age": "",
                                "gender": "",
                                "location": "",
                                "aboutme": ""
                            }, function (err, doc) {
                                if (err) {
                                    // If it failed, return error
                                    res.send("There was a problem adding the information to the database.");
                                }
                                else {
                                    // And forward to home page
                                    res.redirect("home");
                                }

                            });
                        }
                    });
                })
            }
        });

        /* GET UPLOAD COMICS PAGE */
        router.get('/uploadcomics/*', function (req, res) {
            res.render('uploadcomics', {cur: req.currentUser});
        });

        /* POST TO UPLOAD COMICS PAGE */
        router.post('/uploadcomics/*', function (req, res) {

            var comicId:String = req.params[0];

            var db = req.db;
            var collection = db.get('comicimages');

            if (comicId == "") {
                collection.find({"sequence": "1"}, function (err, docs) {
                    var largestId:number = 0;
                    for (var i = 0; i < docs.length; i++) {
                        var curId = parseInt(docs[i]['comicId']);
                        if (curId > largestId) {
                            largestId = curId;
                        }
                    }
                    largestId++;
                    for (var i = 0; i < req.files.length; i++) {
                        collection.insert({
                            "comicId": largestId.toString(),
                            "creator": req.currentUser.getUsername(),
                            "url": "/images/" + req.files[i].filename,
                            "sequence": "1"
                        });
                        largestId++;
                    }
                    /* redirect to new page */
                    res.redirect("../../comic/" + (largestId-1).toString());

                })
            } else {
                /* look for comic in the database */
                collection.find({"comicId": comicId}, function (err, docs) {
                    var sequence:number;
                    /* if the comic already exists in the database, we want to add the new image to the end */
                    if (docs.length != 0) {
                        var curMost:number = 0;
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
                    for (var i = 0; i < req.files.length; i++) {
                        var nextSequence:number = sequence + 1;


                        collection.insert({
                            "comicId": comicId,
                            "creator": req.currentUser.getUsername(),
                            "url": "/images/" + req.files[i].filename,
                            "sequence": nextSequence.toString()
                        });
                        sequence = nextSequence;
                    }
                    /* redirect to new page */
                    res.redirect("../../comic/" + comicId);
                });
            }
        });

        router.get('/', function (req, res) {
            res.render('index');
        });

        /* GET myprofile page. */
        router.get('/myprofile', function (req, res) {
            var db = req.db;
            var currentUser = req.currentUser;
            var current = currentUser.getUsername();
            var collection = db.get('usercollection');
            collection.findOne({
                "username": current
            }, function (e, docs) {
                if (docs != null) {
                    res.render('myprofile', {
                        cur: currentUser,
                        fullname: docs['fullname'],
                        location: docs['location'],
                        age: docs['age'],
                        gender: docs['gender'],
                        aboutme: docs['aboutme']
                    });
                } else {
                    res.render('myprofile', {
                        cur: currentUser,
                        fullname: '',
                        location: '',
                        age: '',
                        gender: '',
                        aboutme: ''
                    });
                }
            });
        });


        //Get profile pages
        router.get('/users/*', function (req, res) {
            var db = req.db;
            var collection = db.get('usercollection');
            var userName = req.params['0'];
            collection.findOne({
                "username" : userName
            },function(e, docs) {
                if (docs != null) {
                    res.render('users', {
                        userName: userName,
                        fullname: docs['fullname'],
                        location: docs['location'],
                        age: docs['age'],
                        gender: docs['gender'],
                        aboutme: docs['aboutme']
                    });
                } else {
                    res.render('users', {
                        userName: userName,
                        fullname: 'This user has not specified yet',
                        location: 'This user has not specified yet',
                        age: 'This user has not specified yet',
                        gender: 'This user has not specified yet',
                        aboutme: 'This user has not specified yet'
                    });
                }
            });
        });

        /* GET editprofile page. */
        router.get('/editprofile', function (req, res) {
            res.render('editprofile', {title: 'Edit Profile'});
        });

        /* POST for editprofile page */
        router.post('/editprofile', function (req, res) {

            var currentUser = req.currentUser;

            if (currentUser.getIsLoggedIn() != true) {
                res.send("You must be logged in")
            } else {
                // Set our internal DB variable
                var db = req.db;

                //get form values
                var fullname = req.body.fullname;
                var age = req.body.age;
                var location = req.body.location;
                var gender = req.body.gender;
                var aboutme = req.body.aboutme;

                // Set our collection
                var collection = db.get('usercollection');

                collection.findOne({
                    "username": currentUser.getUsername()
                }, function (e, docs) {
                    var password:String = docs['password'];

                    var user:User = new User(currentUser.getUsername(), password, fullname,
                        gender, age, aboutme, location);

                    collection.update(
                        {username: currentUser.getUsername()},
                        {
                            "username": user.getUsername(),
                            "password": user.getPassword(),
                            "fullname": user.getFullName(),
                            "gender": user.getGender(),
                            "age": user.getAge(),
                            "aboutme": user.getAboutMe(),
                            "location": user.getLocation()
                        }, function (err, doc) {
                            if (err) {
                                // If it failed, return error
                                res.send("There was a problem adding the information to the database.");
                            }
                            else {
                                // And forward back to my profile page
                                res.redirect("myprofile");
                            }
                        }
                    );
                });
            }
        });
        router.get('/', function (req, res) {
            res.render('index');
        });

        module.exports = router;
    }
}

var router = new Router();
