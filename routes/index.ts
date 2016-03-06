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
    getSecurityQuestion() : String;
    getSecurityAnswer() : String;
}
class User implements UserInterface {
    private username:String;
    private password:String;
    private fullname:String;
    private gender:String;
    private age:String;
    private aboutme:String;
    private location:String;
    private securityQuestion:String;
    private securityAnswer:String;

    constructor(username:String, password:String, fullname:String,
                gender:String, age:String, aboutme:String, location:String,
                securityQuestion:String, securityAnswer:String) {
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.gender = gender;
        this.age = age;
        this.aboutme = aboutme;
        this.location = location;
        this.securityQuestion = securityQuestion;
        this.securityAnswer = securityAnswer;
    }

    getUsername() {
        return this.username;
    }

    getPassword() {
        return this.password;
    }

    getFullName() {
        return this.fullname;
    }

    getGender() {
        return this.gender;
    }

    getAboutMe() {
        return this.aboutme;
    }

    getLocation() {
        return this.location;
    }

    getAge() {
        return this.age;
    }

    getSecurityQuestion() {
        return this.securityQuestion;
    }

    getSecurityAnswer() {
        return this.securityAnswer;
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
            var collection = db.get('comics');
            var comicIds = [];
            var urls = [];
            collection.find({}, function (err, docs) {
                if (err) {
                    res.send(err);
                } else if (docs != null) {
                    var imagesCollection = db.get('comicimages');
                    imagesCollection.find({
                        "sequence": 1
                    }, function (imagesErr, imagesDocs) {
                        if (imagesErr) {
                            res.send(imagesErr);
                        } else if (imagesDocs != null) {
                            for (var i = 0; i < docs.length; i++) {
                                var curComicId = docs[i]['comicId'];
                                comicIds.push("../comic/" + curComicId);
                                for (var j = 0; j < imagesDocs.length; j++) {
                                    if (imagesDocs[j]['comicId'] == curComicId) {
                                        urls.push(imagesDocs[j]['url']);
                                    }
                                }
                            }
                            res.render('home',
                                {cur: req.currentUser, urls: urls, comicIds: comicIds}
                            );
                        }
                    });
                }
            });
        });

        /* GET home page. */
        router.get('/', function (req, res) {
            var db = req.db;
            var collection = db.get('comics');
            var comicIds = [];
            var urls = [];
            collection.find({}, function (err, docs) {
                if (err) {
                    res.send(err);
                } else if (docs != null) {
                    var imagesCollection = db.get('comicimages');
                    imagesCollection.find({
                        "sequence": 1
                    }, function (imagesErr, imagesDocs) {
                        if (imagesErr) {
                            res.send(imagesErr);
                        } else if (imagesDocs != null) {
                            for (var i = 0; i < docs.length; i++) {
                                var curComicId = docs[i]['comicId'];
                                comicIds.push("../comic/" + curComicId);
                                for (var j = 0; j < imagesDocs.length; j++) {
                                    if (imagesDocs[j]['comicId'] == curComicId) {
                                        urls.push(imagesDocs[j]['url']);
                                    }
                                }
                            }
                            res.render('home',
                                {cur: req.currentUser, urls: urls, comicIds: comicIds}
                            );
                        }
                    });
                }
            });
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
                    if (err) {
                        res.send(err);
                    } else if (docs != null) {
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

        //Get Comic Page
        router.get('/comic/*', function (req, res) {
            var comicId:number = parseInt(req.params['0']);
            var db = req.db;
            var collection = db.get('comics');
            // likes/dislikes counting
            var userlist = db.get('usercollection');
            var liketotal:number;
            userlist.count(
                {"likes": comicId},
                function(err, docs) {
                    if (err) {
                        res.send(err);
                    } else {
                        liketotal = Number(docs);
                    }
                }
            );
            var disliketotal:number;
            userlist.count(
                {"dislikes": comicId},
                function(err, docs) {
                    if (err) {
                        res.send(err);
                    } else {
                        disliketotal = Number(docs);
                    }
                }
            );
            //
            collection.findOne({
                "comicId": comicId,
            }, function (err, docs) {
                if (err) {
                    res.send(err);
                } else if (docs != null) {
                    var creator = docs['creator'];
                    var imagesCollection = db.get('comicimages');
                    imagesCollection.find({
                        "comicId": comicId
                    }, function (imagesErr, imagesDocs) {
                        if (imagesErr) {
                            res.send(imagesErr);
                        } else if (imagesDocs != null) {
                            var urls = [];
                            for (var i = 0; i < imagesDocs.length; i++) {
                                urls.push(imagesDocs[i]['url']);
                            }
                            var tags:string = docs['tags'];
                            res.render('comic', {
                                comicId: comicId.toString(),
                                urls: urls,
                                tags: tags,
                                liketotal: liketotal,
                                disliketotal: disliketotal
                            });
                        }
                    })
                }
            });
        });
                
        //Post To Comic Page - like/dislike
        router.post('/comic/*', function (req, res) {
            var currentUser = req.currentUser;
            if (currentUser.getIsLoggedIn() != true) {
                res.send("You must be logged in")
            }else {
                //db variable
                var db = req.db;
                //set our collection
                var collection = db.get('usercollection');
                //comic to be liked
                var like:number = parseInt(req.params['0']);
                //current user username to update user's like list
                var liker = currentUser.getUsername();
                //like or dislike input value
                var inputValue = req.body.vote;
                if (inputValue == "like"){
                    console.log("hi");
                    collection.findOne({
                        "username": liker
                    }, function (err, docs) {
                        if (err) {
                            res.send(err);
                        } else {
                            collection.update(
                                {username: liker},
                                { $addToSet: {"likes": like },
                                $unset: {"dislikes": like } }
                            );
                        }
                    })    
                } else {
                    console.log("hey");
                    collection.findOne({
                        "username": liker
                    }, function (err, docs) {
                        if (err) {
                            res.send(err);
                        } else {
                            collection.update(
                                {username: liker},
                                { $addToSet: {"dislikes": like },
                                $unset: {"likes": like } }
                            );
                        }
                    });
                }
                res.redirect(req.get('referer'));
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
            var username = req.body.username;
            var password = req.body.password;
            var securityQuestion = req.body.securityQuestion;
            var securityAnswer = req.body.securityAnswer;
            var confirmPassword = req.body.confirmPassword;
            var securityQuestion = req.body.securityQuestion;
            var securityAnswer = req.body.securityAnswer;
            if (password.length < 4 || password.length > 20) {
                res.send("Password needs to be between 6 - 20 characters. Please try again!");
            }
            else if (password != confirmPassword) {
                res.send("passwords do not match");
            }
            else {
                var user:User = new User(username, password, req.body.fullname, req.body.age, req.body.aboutme,
                    req.body.gender, req.body.location, securityQuestion, securityAnswer);

                // Set our collection
                var collection = db.get('usercollection');
                // Submit to the DB
                collection.findOne({
                    "username": username.toLowerCase()
                }, function (err, docs) {
                    if (err) {
                        res.send(err);
                    } else if (docs != null) {
                        res.send("Username already exists. Please enter a new username");
                    } else {
                        // Submit to the DB
                        collection.insert({
                            "username": user.getUsername(),
                            "password": user.getPassword(),
                            "fullname": "This user has not filled out a bio",
                            "age": "This user has not filled out a bio",
                            "gender": "This user has not filled out a bio",
                            "location": "This user has not filled out a bio",
                            "aboutme": "This user has not filled out a bio",
                            "securityquestion": user.getSecurityQuestion(),
                            "securityanswer": user.getSecurityAnswer()
                        }, function (err) {
                            if (err) {
                                // If it failed, return error
                                res.send("There was a problem adding the information to the database.");
                            }
                            else {
                                // Forward to home page
                                res.redirect("home");
                            }
                        });
                    }
                });
            }
        });
        
        /* GET Userlist page. */
        router.get('/userlist', function(req, res) {
            var db = req.db;
            var collection = db.get('usercollection');
            collection.find({}, {}, function(e, docs) {
                res.render('userlist', {
                    "userlist": docs
                });
            });
        });

        /* GET UPLOAD COMICS PAGE */
        router.get('/uploadcomics/*', function (req, res) {
            var comicId:number = parseInt(req.params[0]) || 0;
            if (comicId == 0) {
                var newComic:number = 1;
            } else {
                var newComic:number = 0;
            }
            res.render('uploadcomics', {
                cur: req.currentUser,
                newComic: newComic
            });
        });

        /* POST TO UPLOAD COMICS PAGE */
        router.post('/uploadcomics/*', function (req, res) {
            var comicId:number = parseInt(req.params[0]) || 0;

            var db = req.db;

            if (comicId == 0) {
                var tagString:string = req.body['tags'];
                var tags = tagString.split(',').map(Function.prototype.call, String.prototype.trim);
                var collection = db.get('comics');
                collection.findOne({}, {sort: {"comicId": -1}}, function (err, docs) {
                    if (err) {
                        res.send(err);
                    } else {
                        var largestId:number;
                        if (docs != null) {
                            largestId = docs['comicId'];
                        } else {
                            largestId = 0;
                        }
                        var imagesCollection = db.get('comicimages');
                        for (var i = 0; i < req.files.length; i++) {
                            largestId++;
                            collection.insert({
                                "comicId": largestId,
                                "creator": req.currentUser.getUsername(),
                                "tags": tags
                            });
                            imagesCollection.insert({
                                "comicId": largestId,
                                "uploader": req.currentUser.getUsername(),
                                "url": "/images/" + req.files[i].filename,
                                "sequence": 1
                            });
                        }
                        res.redirect("../../comic/" + largestId.toString());
                    }

                })
            } else {
                var imagesCollection = db.get('comicimages');
                imagesCollection.findOne({
                    "comicId": comicId
                }, {sort: {"sequence": -1}}, function (err, docs) {
                    if (err) {
                        res.send(err);
                    } else {
                        var largestSequence:number = docs['sequence'];
                        for (var i = 0; i < req.files.length; i++) {
                            imagesCollection.insert({
                                "comicId": comicId,
                                "uploader": req.currentUser.getUsername(),
                                "url": "/images/" + req.files[i].filename,
                                "sequence": largestSequence + 1
                            });
                        }
                    }
                });
                res.redirect("../../comic/" + comicId.toString());
            }
        });

        /* GET EDIT COMICS PAGE */
        router.get('/editcomic/*', function (req, res) {
            var comicId:number = parseInt(req.params[0]) || 0;

            if (comicId == 0) {
                res.render('editcomic', {
                    cur: req.currentUser,
                    comicId: comicId,
                    tagsValue: ""
                });
            } else {
                var db = req.db;
                var collection = db.get('comics');
                collection.findOne({
                    'comicId': comicId
                }, function (err, docs) {
                    if (err) {
                        res.send(err);
                    } else if (docs != null) {
                        var tags:string = docs['tags'];
                        res.render('editcomic', {
                            cur: req.currentUser,
                            comicId: comicId,
                            tagsValue: tags
                        })
                    }
                });
            }
        });

        /* POST TO EDIT COMICS PAGE */
        router.post('/editcomic/*', function (req, res) {
            var comicId:number = parseInt(req.params[0]) || 0;
            var tagString:string = req.body['tags'];
            var tags = tagString.split(',').map(Function.prototype.call, String.prototype.trim);
            var db = req.db;

            if (comicId == 0) {
                res.send('Image does not exist')
            } else {
                var collection = db.get('comics');
                collection.findOne({
                    "comicId": comicId
                }, function (err, docs) {
                    if (err) {
                        res.send(err);
                    } else {
                        collection.update(
                            {"comicId": comicId},
                            { $set: {
                                "tags": tags
                            }
                        });
                        res.redirect("../../comic/" + comicId.toString());
                    }
                });
            }
        });

        /*GET resetpassword page */
        router.get('/resetpassword/:step/*', function (req, res) {
            var step = req.params['step'];
            var username = req.params[0];
            if (step == 1 || step == 4) {
                res.render('resetpassword', {
                    step: step
                });
            } else if (step == 2) {
                var db = req.db;
                var collection = db.get('usercollection');
                collection.findOne({
                    "username": username.toLowerCase()
                }, function (err, docs) {
                    if (err) {
                        res.send(err);
                    }
                    else if (docs == null) {
                        res.send("Unfortunately this username does not exist. <a href='#' onClick='history.go(-1)'>Go Back</a>");
                    }
                    else {
                        res.render('resetpassword', {
                            step: step,
                            username: username,
                            securityQuestion: docs['securityquestion']
                        });
                    }
                })
            } else if (step == 3) {
                var security = req.currentSecurityResponse;
                var isConfirmed = security.getIsConfirmed();
                security.clear();
                res.render('resetpassword', {
                    step: step,
                    username: username,
                    isConfirmed: isConfirmed
                });
            } else {
                res.send('Invalid link');
            }
        });

        /*POST resetpassword page */
        router.post('/resetpassword/:step/*', function (req, res) {
            var step = req.params['step'];
            var username = req.body.username;
            var securityAnswer = req.body.securityAnswer;
            var password = req.body.password;
            var confirmPassword = req.body.confirmPassword;

            if (step == 1) {
                res.redirect("../2/" + username);
            } else if (step == 2) {
                var db = req.db;
                var username = req.params[0];
                var collection = db.get('usercollection');
                collection.findOne({
                    "username": username.toLowerCase()
                }, function (err, docs) {
                    if (err) {
                        res.send(err);
                    }
                    else if (docs == null) {
                        res.send("Unfortunately this username does not exist. <a href='#' onClick='history.go(-1)'>Go Back</a>");
                    }
                    else {
                        if (docs['securityanswer'] == securityAnswer) {
                            var security = req.currentSecurityResponse;
                            security.setSecurityAnswer(securityAnswer);
                            security.setIsConfirmed(true);
                            res.redirect("../3/" + username);
                        } else {
                            req.currentSecurityResponse.clear();
                            res.send("Security answer was incorrect. <a href='#' onClick='history.go(-1)'>Go Back</a>")
                        }
                    }
                })
            } else if (step == 3) {
                if (password != confirmPassword) {
                    res.send("Passwords did not match.")
                } else {
                    var db = req.db;
                    var username = req.params[0];
                    var collection = db.get('usercollection');
                    collection.update(
                        {username: username},
                        { $set: {
                            "password": password
                        }
                        }, function (err) {
                            if (err) {
                                // If it failed, return error
                                res.send("There was a problem updating your password.");
                            }
                            else {
                                // Forward back to my profile page
                                res.redirect("../4/");
                            }
                        }
                    );
                }
            }
        });

        /* GET myprofile page. */
        router.get('/myprofile', function (req, res) {
            var db = req.db;
            var currentUser = req.currentUser;
            var current = currentUser.getUsername();
            var collection = db.get('usercollection');
            collection.findOne({
                "username": current
            }, function (err, docs) {
                if (err) {
                    res.send(err);
                } else if (docs != null) {
                    var fanCollection = db.get('fans');
                    fanCollection.find({
                        "fan": current
                    }, function (err, fanDocs) {
                        if (err) {
                            res.send(err);
                        } else {
                            fanCollection.find({
                                "following": current
                            }, function (err, followingDocs) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    var fans = [];
                                    var following = [];
                                    for (var i=0; i<fanDocs.length; i++) {
                                        following.push(fanDocs[i]['following']);
                                    }
                                    for (var i=0; i<followingDocs.length; i++) {
                                        fans.push(followingDocs[i]['fan']);
                                    }
                                    res.render('myprofile', {
                                        cur: currentUser,
                                        fullname: docs['fullname'],
                                        location: docs['location'],
                                        age: docs['age'],
                                        gender: docs['gender'],
                                        aboutme: docs['aboutme'],
                                        username: current,
                                        fans: fans,
                                        following: following
                                    });
                                }
                            })
                        }
                    })
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


        /*Get profile pages*/
        router.get('/users/*', function (req, res) {
            var db = req.db;
            var collection = db.get('usercollection');
            var username = req.params['0'];
            if (username == req.currentUser.getUsername()) {
                res.redirect('../myprofile');
            } else {
                collection.findOne({
                    "username": username
                }, function (err, docs) {
                    if (err) {
                        res.send(err);
                    } else if (docs != null) {
                        var fanCollection = db.get('fans');
                        fanCollection.find({
                            "fan": username
                        }, function (err, fanDocs) {
                            if (err) {
                                res.send(err);
                            } else {
                                fanCollection.find({
                                    "following": username
                                }, function (err, followingDocs) {
                                    if (err) {
                                        res.send(err);
                                    } else {
                                        var fans = [];
                                        var following = [];
                                        for (var i=0; i<fanDocs.length; i++) {
                                            following.push(fanDocs[i]['following']);
                                        }
                                        for (var i=0; i<followingDocs.length; i++) {
                                            fans.push(followingDocs[i]['fan']);
                                        }
                                        var notFan = (fans.indexOf(req.currentUser.getUsername()) == -1);
                                        res.render('users', {
                                            userName: username,
                                            fullname: docs['fullname'],
                                            location: docs['location'],
                                            age: docs['age'],
                                            gender: docs['gender'],
                                            aboutme: docs['aboutme'],
                                            notFan: notFan,
                                            fans: fans,
                                            following: following
                                        });
                                    }
                                })
                            }
                        });
                    } else {
                        res.send("This user does not exist!");
                    }
                });
            }
        });
        
        /*POST to profile pages - become a fan*/
        router.post('/users/*', function (req, res) {
            var currentUser = req.currentUser;
            if (currentUser.getIsLoggedIn() != true) {
                res.send("You must be logged in")
            }else {
                //db variable
                var db = req.db;
                //set our collection
                var fanCollection = db.get('fans');
                //user to be followed
                var following = req.params['0'];
                //current user username to update followed person's fan list
                var fan = currentUser.getUsername();

                fanCollection.insert({
                    "fan": fan,
                    "following": following
                });

                res.redirect(req.get('referer'));
            }
        });

        //get Search User page
        router.get('/searchuser', function (req,res) {
            var db = req.db;
            var collection = db.get('usercollection');
            var username = req.body.username;
            collection.findOne({
                "username": username
            }, function (err, docs){
                if (err) {
                    res.send(err);
                }
                else if (docs != null) {
                    res.render('/users/username');
                }
                else {
                    res.send("This user does not exist!");
                }
            })


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
                var securityQuestion = req.body.securityQuestion;
                var securityAnswer = req.body.securityAnswer;

                // Set our collection
                var collection = db.get('usercollection');

                collection.findOne({
                    "username": currentUser.getUsername()
                }, function (err, docs) {
                    if (err) {
                        res.send(err);
                    } else {
                        var password:string = docs['password'];
                        var securityQuestion:string = docs['securityquestion'];
                        var securityAnswer:string = docs['securityanswer'];
                        var user:User = new User(currentUser.getUsername(), password, fullname,
                            gender, age, aboutme, location, securityQuestion, securityAnswer);

                        collection.update(
                            {username: currentUser.getUsername()},
                            { $set: {
                                "fullname": user.getFullName(),
                                "gender": user.getGender(),
                                "age": user.getAge(),
                                "aboutme": user.getAboutMe(),
                                "location": user.getLocation(),
                            }
                            }, function (err) {
                                if (err) {
                                    // If it failed, return error
                                    res.send("There was a problem adding the information to the database.");
                                }
                                else {
                                    // Forward back to my profile page
                                    res.redirect("myprofile");
                                }
                            }
                        );
                    }
                });
            }
        });
        //Get Search Users Page
        router.get('/searchusers/*', function(req, res) {
            var db = req.db;
            var collection = db.get('usercollection');
            var comiccollection = db.get('comics');
            var search = req.params['0'];

            collection.findOne({
                "username": search
            }, function(err, docs) {
                if (err) {
                    res.send(err);
                } else if (docs != null) {
                    res.render('searchusers', {
                        username: search,
                        userExists: 1
                    });
                } else {
                    res.render('searchusers', {
                        username: "No user matches the criteria",
                        userExists: -1
                    })
                }
            })
        });
        
        //Get Search Tags Page
        router.get('/searchtags/*', function(req, res) {
            var db = req.db;
            var collection = db.get('usercollection');
            var comiccollection = db.get('comics');
            var search = req.params['0'];
            
            comiccollection.find({
                "tags": search
            }, function(err, docs) {
                if (err) {
                    res.send(err);
                } else if (docs != null) {
                    var comicIds = [];
                    for (var i = 0; i < docs.length; i++) {
                        comicIds.push(docs[i]['comicId']);
                    }
                    
                    res.render('searchtags', {
                        tags: search,
                        tagExists: 1,
                        comicIds: comicIds
                    });
                } else {
                    res.render('searchtags', {
                        tags: "No comic contains any of the tag criteria",
                        tagExists: -1
                    })
                }
            })
        });
        //Get Search Page
        router.get('/search/*', function(req, res) {
            var db = req.db;
            var collection = db.get('usercollection');
            var comiccollection = db.get('comics');
            var search = req.params['0'];

            var username;
            var userExists;

            collection.findOne({
                "username": search
            }, function(err, docs) {
                if (err) {
                    res.send(err);
                } else if (docs != null) {
                    username = search;
                    userExists = 1;
                } else {
                    username = "No user matches the criteria";
                    userExists = -1
                }
            });

            comiccollection.find({
                "tags": search
            }, function(err, docs) {
                if (err) {
                    res.send(err);
                } else if (docs != null) {
                    var comicIds = [];
                    for (var i = 0; i < docs.length; i++) {
                        comicIds.push(docs[i]['comicId']);
                    }
                    res.render('search', {
                        tags: search,
                        tagExists: 1,
                        comicIds: comicIds,
                        username: username,
                        userExists: userExists
                    });

                } else {
                    res.render('search', {
                        tags: search,
                        tagExists: -1,
                        comicIds: comicIds,
                        username: username,
                        userExists: userExists
                    })
                }
            })
        });

        
        router.post('/home', function (req, res) {
            var search = req.body.search;
            res.redirect('/search/' + search);
        });


        //
        module.exports = router;
    }
}

var router = new Router();