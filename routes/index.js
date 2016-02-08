///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/>
var User = (function () {
    function User(username, password) {
        this.username = username;
        this.password = password;
    }
    User.prototype.getUsername = function () {
        return this.username;
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    return User;
})();
var base64 = (function () {
    function base64() {
    }
    base64.prototype.getBase64Image = function (img) {
        // Create an empty canvas element
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to
        // guess the original format, but be aware the using "image/jpg"
        // will re-encode the image.
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    };
    ;
    return base64;
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
            // Set our collection
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
        });
        /* GET Create Profile page. */
        router.get('/createprofile', function (req, res) {
            res.render('createprofile');
        });
        /* POST to UserList Page */
        router.post('/createprofile', function (req, res) {
            // Set our internal DB variable
            var db = req.db;
            // Get our form values. These rely on the "name" attributes
            var userName = req.body.username;
            var password = req.body.password;
            var confirmPassword = req.body.confirmPassword;
            if (!password == confirmPassword) {
                res.send("Passwords do not match");
            }
            else {
                var user = new User(req.body.username, req.body.password);
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
                });
            }
        });
        /* GET UPLOAD COMICS PAGE */
        router.get('/uploadcomics', function (req, res) {
            res.render('uploadcomics');
        });
        router.post('/', multer({ dest: './uploads/' }).single('upl'), function (req, res) {
            // Set our internal DB variable
            var db = req.db;
            // Get our form values. These rely on the "name" attributes
            var image = req.body.imagefile;
            // Set our collection
            var collection = db.get('comicimages');
            var myImage = new base64();
            var img = myImage.getBase64Image(image);
            collection.findOne({
                "image": img
            }, function (err, docs) {
                if (docs != null) {
                    var currentComic = req.currentUser;
                    currentComic.setUsername(img);
                    res.redirect('home');
                }
                else {
                    res.render('Upload failed, invalid credentials');
                }
            });
            console.log(req.body); //form fields
            // Base64DataURL
            /* example output:
             { title: 'abc' }
             */
            console.log(req.file);
            {
                fieldname: 'comicimage';
                originalname: '';
                mimetype: 'image/png';
                destination: './uploads/';
                filename: 'comicimage';
                path: 'uploads/comicimage1';
            }
            //form files
            /* example output:
             { fieldname: 'upl',
             originalname: 'grumpy.png',i
             encoding: '7bit',
             mimetype: 'image/png',
             destination: './uploads/',
             filename: '436ec561793aa4dc475a88e84776b1b9',
             path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
             size: 277056 }
             */
        });
        router.get('/', function (req, res) {
            res.render('index');
        });
        module.exports = router;
    }
    return Router;
})();
var router = new Router();
//# sourceMappingURL=index.js.map