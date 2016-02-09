///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/>
///<reference path='../db_objects/account.ts'/>
var User = (function () {
    function User(username, password, fullname, gender, age, aboutme, location) {
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.gender = gender;
        this.age = age;
        this.aboutme = aboutme;
        this.location = location;
    }
    User.prototype.getUsername = function () {
        return this.username;
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    User.prototype.getFullName = function () {
        return this.fullname;
    };
    User.prototype.getGender = function () {
        return this.gender;
    };
    User.prototype.getAboutMe = function () {
        return this.aboutme;
    };
    User.prototype.getLocation = function () {
        return this.location;
    };
    User.prototype.getAge = function () {
        return this.age;
    };
    return User;
})();
var Router = (function () {
    function Router() {
        var express = require('express');
        var router = express.Router();
        var multer = require('multer'), bodyParser = require('body-parser'), path = require('path');
        /* GET home page. */
        router.get('/home', function (req, res) {
            res.render('home');
        });
        /* GET login page. */
        router.get('/login', function (req, res) {
            res.render('login', { loginError: '' });
        });
        /* POST for login page */
        router.post('/login', function (req, res) {
            // Set our internal DB variable
            var db = req.db;
            // Get our form values. These rely on the "name" attributes
            var username = req.body.username;
            var password = req.body.password;
            if (password.length < 6 || password.length > 20) {
                res.render('login', { loginError: 'Password needs to be between 6 - 20 characters. Please try again!' });
            }
            else {
                var collection = db.get('usercollection');
                collection.findOne({
                    "username": username.toLowerCase(),
                    "password": password
                }, function (err, docs) {
                    if (docs != null) {
                        var currentUser = req.currentUser;
                        currentUser.setUsername(username);
                        currentUser.setIsLoggedIn(true);
                        res.redirect('home');
                    }
                    else {
                        res.render('login', { loginError: 'Login failed, invalid credentials' });
                    }
                });
            }
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
            if (password != confirmPassword) {
                res.send("Passwords do not match");
            }
            else if (password.length < 6 || password.length > 20) {
                res.render('createprofile', { loginError: 'Password needs to be between 6 - 20 characters. Please try again!' });
            }
            else {
                var user = new User(req.body.username, req.body.password, req.body.fullname, req.body.age, req.body.aboutme, req.body.gender, req.body.location);
                // Set our collection
                var collection = db.get('usercollection');
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
                }
                else {
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
        /* GET users. */
        router.get('/users/*', function (req, res) {
            var db = req.db;
            var collection = db.get('usercollection');
            var userName = req.params['0'];
            collection.findOne({
                "username": userName
            }, function (e, docs) {
                if (docs != null) {
                    res.render('users', {
                        userName: userName,
                        fullname: docs['fullname'],
                        location: docs['location'],
                        age: docs['age'],
                        gender: docs['gender'],
                        aboutme: docs['aboutme']
                    });
                }
                else {
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
        //comic number
        router.get('/comic/*', function (req, res) {
            var comicNumber = req.params['0'];
            res.render('comic', { comicNumber: comicNumber.toString() });
        });
        /* GET editprofile page. */
        router.get('/editprofile', function (req, res) {
            res.render('editprofile', { title: 'Edit Profile' });
        });
        /* POST for editprofile page */
        router.post('/editprofile', function (req, res) {
            var currentUser = req.currentUser;
            if (currentUser.getIsLoggedIn() != true) {
                res.send("You must be logged in");
            }
            else {
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
                    var password = docs['password'];
                    var user = new User(currentUser.getUsername(), password, fullname, gender, age, aboutme, location);
                    collection.update({ username: currentUser.getUsername() }, {
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
                    });
                });
            }
        });
        router.post('/fileupload2', multer({ dest: './uploads/' }).single('upl'), function (req, res) {
            console.log(req.body); //form fields
            /* example output:
             { title: 'abc' }
             */
            console.log(req.file); //form files
            /* example output:
             { fieldname: 'upl',
             originalname: 'grumpy.png',
             encoding: '7bit',
             mimetype: 'image/png',
             destination: './uploads/',
             filename: '436ec561793aa4dc475a88e84776b1b9',
             path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
             size: 277056 }
             */
            res.status(204).end();
        });
        module.exports = router;
    }
    return Router;
})();
var router = new Router();
