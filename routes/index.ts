///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/>
///<reference path='../db_objects/account.ts'/>
interface UserInterface {
    getUsername(): String;
    getPassword(): String;
    getFullName(): String;
    getGender(): String;
    getAge(): String;
    getLocation(): String;
    getAboutMe(): String;
    getSecurityQuestion(): String;
    getSecurityAnswer(): String;
    getDeviantArtUsername();
}
class User implements UserInterface {
    private username: String;
    private password: String;
    private fullname: String;
    private gender: String;
    private age: String;
    private aboutme: String;
    private location: String;
    private securityQuestion: String;
    private securityAnswer: String;
    private deviantartusername: String;

    constructor(username: String, password: String, fullname: String,
        gender: String, age: String, aboutme: String, location: String,
        securityQuestion: String, securityAnswer: String, deviantartusername: String) {
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.gender = gender;
        this.age = age;
        this.aboutme = aboutme;
        this.location = location;
        this.securityQuestion = securityQuestion;
        this.securityAnswer = securityAnswer;
        this.deviantartusername = deviantartusername;
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

    getDeviantArtUsername() {
        return this.deviantartusername;
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
        router.get('/home', function(req, res) {
            var db = req.db;
            var collection = db.get('comics');
            var comicIds = [];
            var urls = [];
            collection.find({}, function(err, docs) {
                if (err) {
                    res.send(err);
                } else if (docs != null) {
                    var imagesCollection = db.get('comicimages');
                    imagesCollection.find({
                        "sequence": 1
                    }, function(imagesErr, imagesDocs) {
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
                                { cur: req.currentUser, urls: urls, comicIds: comicIds }
                            );
                        }
                    });
                }
            });
        });

        /* GET home page. */
        router.get('/', function(req, res) {
            var db = req.db;
            var collection = db.get('comics');
            var comicIds = [];
            var urls = [];
            collection.find({}, function(err, docs) {
                if (err) {
                    res.send(err);
                } else if (docs != null) {
                    var imagesCollection = db.get('comicimages');
                    imagesCollection.find({
                        "sequence": 1
                    }, function(imagesErr, imagesDocs) {
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
                                { cur: req.currentUser, urls: urls, comicIds: comicIds }
                            );
                        }
                    });
                }
            });
        });

        /* GET login page. */
        router.get('/login', function(req, res) {
            res.render('login', { loginError: '' });
        });

        /* POST for login page */
        router.post('/login', function(req, res) {
            // Set our internal DB variable
            var db = req.db;
            // Get our form values. These rely on the "name" attributes
            var username = req.body.username;
            var password = req.body.password;

            // Set our collection
            if (password.length < 4 || password.length > 20) {
                res.render('login', { loginError: 'Password needs to be between 4 - 20 characters. Please try again!' });
            } else {
                var collection = db.get('usercollection');
                collection.findOne({
                    "username": username.toLowerCase(),
                    "password": password
                }, function(err, docs) {
                    if (err) {
                        res.send(err);
                    } else if (docs != null) {
                        var currentUser = req.currentUser;
                        currentUser.setUsername(username);
                        currentUser.setIsLoggedIn(true);
                        res.redirect('../home');
                    } else {
                        res.render('login', { loginError: 'Login failed, invalid credentials' });
                    }
                });
            }
        });

        router.get('/comic/:comicId/images/*', function(req, res) {
            var comicId: number = parseInt(req.params['comicId']);
            var imageUrl: string = req.params['0'];
            var db = req.db;
            var imagesCollection = db.get('comicimages');
            var comicCollection = db.get('comics');
            comicCollection.findOne({
                "comicId": comicId,
            }, function(comicErr, comicDocs) {
                if (comicErr) {
                    res.send(comicErr);
                } else if (comicDocs != null) {
                    var creator = comicDocs['creator'];
                    imagesCollection.findOne({
                        "comicId": comicId,
                        "url": "/images/" + imageUrl
                    }, function(err, docs) {
                        if (err) {
                            res.send(err);
                        } else if (docs != null) {
                            imagesCollection.find({
                                "comicId": comicId
                            }, { sort: { "sequence": 1 } }, function(imagesErr, imagesDocs) {
                                if (imagesErr) {
                                    res.send(imagesErr);
                                } else if (imagesDocs != null) {
                                    var uploader = docs['uploader'];
                                    var urls = [];
                                    for (var i = 0; i < imagesDocs.length; i++) {
                                        urls.push(imagesDocs[i]['url']);
                                    }
                                    res.render('comicimage', {
                                        comicId: comicId.toString(),
                                        url: "/images/" + imageUrl,
                                        urls: urls,
                                        isCreator: (req.currentUser.getUsername() == uploader || req.currentUser.getUsername() == creator),
                                        currentUser: req.currentUser
                                    });
                                }
                            });
                        } else {
                            res.render('error', {
                                error: "There is no image associated with this comic."
                            });
                        }
                    });
                }
            });
        });

        router.post('/comic/:comicId/images/*', function(req, res) {
            var comicId: number = parseInt(req.params['comicId']);
            var imageUrl: string = req.params['0'];
            var db = req.db;
            var imagesCollection = db.get('comicimages');
            var newSequence = parseInt(req.body.sequence);

            if (newSequence <= 0) {
                res.send("Invalid sequence");
            } else {
                imagesCollection.find({
                    "comicId": comicId
                }, function(err, docs) {
                    if (err) {
                        res.send(err);
                    } else if (docs != null) {
                        var sequence: number = 0;
                        var i: number = 0;
                        while (sequence == 0) {
                            if (docs[i]['url'] == "/images/" + imageUrl) {
                                sequence = docs[i]['sequence'];
                            }
                            i++;
                        }
                        var urls = [];
                        var sequences = [];
                        urls.push("/images/" + imageUrl);
                        sequences.push(newSequence);
                        if (newSequence > sequence) {
                            for (var j = 0; j < docs.length; j++) {
                                if (docs[j]['sequence'] > sequence && docs[j]['sequence'] <= newSequence) {
                                    urls.push(docs[j]['url']);
                                    sequences.push(docs[j]['sequence'] - 1)
                                }
                            }
                        } else if (newSequence < sequence) {
                            for (var k = 0; k < docs.length; k++) {
                                if (docs[k]['sequence'] < sequence && docs[k]['sequence'] >= newSequence) {
                                    urls.push(docs[k]['url']);
                                    sequences.push(docs[k]['sequence'] + 1)
                                }
                            }
                        }
                        for (var m = 0; m < urls.length; m++) {
                            imagesCollection.update(
                                { url: urls[m] },
                                {
                                    $set: {
                                        "sequence": sequences[m]
                                    }
                                }, function(err) {
                                    if (err) {
                                        // If it failed, return error
                                        res.send("There was a problem adding the information to the database.");
                                    }
                                    else {
                                    }
                                }
                            );
                        }
                        // Forward back to my profile page
                        res.redirect("../../../comic/" + comicId.toString());
                    }
                });
            }
        });

        /* DELETE COMIC CELL */
        router.delete('/comic/:comicId/images/*', function(req, res) {
            var comicId: number = parseInt(req.params['comicId']);
            var imageUrl: string = req.params['0'];
            var db = req.db;
            var imagesCollection = db.get('comicimages');
            var comicCollection = db.get('comics');
            imagesCollection.find({
                "comicId": comicId
            }, function(err, docs) {
                if (err) {
                    res.send(err);
                } else if (docs != null) {
                    var sequence: number = 0;
                    var i: number = 0;
                    var urls = [];
                    var sequences = [];
                    var reorder = false;
                    if (docs.length == 1) {
                        imagesCollection.remove({ "comicId": comicId });
                        comicCollection.remove({ "comicId": comicId });
                    } else {
                        while (sequence == 0 && i < docs.length) {
                            if (docs[i]['url'] == "/images/" + imageUrl) {
                                sequence = docs[i]['sequence'];
                                var id = docs[i]['_id'];
                                if (sequence != docs.length - 1) {
                                    var newSequence = sequence + 1;
                                    reorder = true;
                                }
                                imagesCollection.remove({ "_id": id });
                            }
                            i++;
                        }
                        if (reorder) {
                            for (var j = 0; j < docs.length; j++) {
                                if (docs[j]['sequence'] >= newSequence) {
                                    urls.push(docs[j]['url']);
                                    sequences.push(docs[j]['sequence'] - 1)
                                }
                            }
                            for (var m = 0; m < urls.length; m++) {
                                imagesCollection.update(
                                    { url: urls[m] },
                                    {
                                        $set: {
                                            "sequence": sequences[m]
                                        }
                                    }, function(err) {
                                        if (err) {
                                            // If it failed, return error
                                            res.send("There was a problem adding the information to the database.");
                                        }
                                        else {
                                        }
                                    }
                                );
                            }
                        }
                    }
                }
            });
        });

        //Get Comic Page
        router.get('/comic/:comicId', function(req, res) {
            var comicId: number = parseInt(req.params['comicId']);
            var db = req.db;
            var collection = db.get('comics');
            // likes/dislikes counting
            var userlist = db.get('usercollection');
            var liketotal: number;
            userlist.count(
                { "likes": comicId },
                function(err, docs) {
                    if (err) {
                        res.send(err);
                    } else {
                        liketotal = Number(docs);
                    }
                }
            );
            var disliketotal: number;
            userlist.count(
                { "dislikes": comicId },
                function(err, docs) {
                    if (err) {
                        res.send(err);
                    } else {
                        disliketotal = Number(docs);
                    }
                }
            );
            //nodejs runs things asynchronously, so delaying a call by 500 ms should help so liketotal is calculated first
            setTimeout(function(){  
            collection.findOne({
                "comicId": comicId,
            }, function(err, docs) {
                if (err) {
                    res.send(err);
                } else if (docs != null) {
                    //set like total and increment view count in database
                    collection.update(
                        { "comicId": comicId },
                        {
                            $set: {
                                "liketotal": liketotal
                            },
                            $inc: {
                                "viewcount": 1
                            }
                        });
                    var creator = docs['creator'];
                    var imagesCollection = db.get('comicimages');
                    imagesCollection.find({
                        "comicId": comicId
                    }, { sort: { "sequence": 1 } }, function(imagesErr, imagesDocs) {
                        if (imagesErr) {
                            res.send(imagesErr);
                        } else if (imagesDocs != null) {
                            var urls = [];
                            for (var i = 0; i < imagesDocs.length; i++) {
                                urls.push(imagesDocs[i]['url']);
                            }
                            var title: string = docs['title'];
                            var tags: string = docs['tags'];
                            var commentCollection = db.get('comments');
                            commentCollection.find({
                                "comicId": comicId
                            }, function(commentsErr, commentsDocs) {
                                if (commentsErr) {
                                    res.send(commentsErr);
                                } else {
                                    var usernames = [];
                                    var comments = [];
                                    if (commentsDocs != null) {
                                        for (var j = commentsDocs.length - 1; j >= 0; j--) {
                                            usernames.push(commentsDocs[j]['username']);
                                            comments.push(commentsDocs[j]['comment']);
                                        }
                                    }
                                    res.render('comic', {
                                        comicId: comicId.toString(),
                                        urls: urls,
                                        title: title,
                                        tags: tags,
                                        liketotal: liketotal,
                                        disliketotal: disliketotal,
                                        isCreator: (req.currentUser.getUsername() == creator),
                                        currentUser: req.currentUser,
                                        viewcount: docs['viewcount'],
                                        usernames: usernames,
                                        comments: comments
                                    });
                                }
                            });
                        }
                    })
                } else {
                    res.render('error', {
                        error: "The specified comic does not exist."
                    });
                }
            });
        },500); 
        });

        //Post To Comic Page - like/dislike/favourites
        router.post('/comic/*', function(req, res) {
            var currentUser = req.currentUser;
            if (currentUser.getIsLoggedIn() != true) {
                res.render('error', {
                    error: "You must be logged in to like or dislike."
                });
            } else {
                //db variable
                var db = req.db;
                //set our collection
                var collection = db.get('usercollection');
                //comic to be liked
                var comicId: number = parseInt(req.params['0']);
                //current user username to update user's like list
                var username = currentUser.getUsername();
                //like or dislike input value
                var inputValue = req.body.submit;
                if (inputValue == "like") {
                    collection.findOne({
                        "username": username
                    }, function(err, docs) {
                        if (err) {
                            res.send(err);
                        } else {
                            collection.update(
                                { username: username },
                                {
                                    $addToSet: { "likes": comicId },
                                    $pull: { "dislikes": comicId }
                                }
                            );
                            res.redirect(req.get('referer'));
                        }
                    })
                } else if (inputValue == "dislike") {
                    collection.findOne({
                        "username": username
                    }, function(err, docs) {
                        if (err) {
                            res.send(err);
                        } else {
                            collection.update(
                                { username: username },
                                {
                                    $addToSet: { "dislikes": comicId },
                                    $pull: { "likes": comicId }
                                }
                            );
                            res.redirect(req.get('referer'));
                        }
                    });
                } else if (inputValue == "favourite") {
                    collection.findOne({
                        "username": username
                    }, function(err, docs) {
                        if (err) {
                            res.send(err);
                        } else {
                            collection.update(
                                { username: username },
                                {
                                    $addToSet: { "favourites": comicId }
                                }
                            );
                            res.redirect(req.get('referer'));
                        }
                    });
                } else if (inputValue == "comment") {
                    var comment = req.body.comment;
                    var commentCollection = db.get('comments');
                    commentCollection.insert({
                        "comicId": comicId,
                        "username": username,
                        "comment": comment
                    }, function(err) {
                        if (err) {
                            res.send("There was a problem adding the information to the database.");
                        } else {
                            res.redirect(req.get('referer'));
                        }
                    })
                }
            }
        });

        /* DELETE COMIC */
        router.delete('/comic/*', function(req, res) {
            var comicId: number = parseInt(req.params[0]) || 0;
            var db = req.db;
            var collection = db.get('comics');
            var comicimages = db.get('comicimages');
            collection.findOne({
                'comicId': comicId
            }, function(err, docs) {
                if (err) {
                    res.send(err);
                } else if (docs != null) {
                    var currentUser = req.currentUser.getUsername();
                    var creator = docs['creator'];
                    if (currentUser == creator) {
                        collection.remove({ "comicId": comicId });
                        comicimages.remove({ "comicId": comicId });
                    }
                }
            });
            //remove likes and dislikes and favourites when a comic is deleted
            var _comicId: number = parseInt(req.params['0']);
            var usercollection = db.get('usercollection');
            usercollection.find({
                "likes": _comicId
            }, function(err, docs) {
                if (err) {
                    res.send(err);
                } else {
                    usercollection.update(
                        { "likes": _comicId },
                        {
                            $pull: { "likes": _comicId }
                        }
                    );
                }
            });
            usercollection.find({
                "dislikes": _comicId
            }, function(err, docs) {
                if (err) {
                    res.send(err);
                } else {
                    usercollection.update(
                        { "dislikes": _comicId },
                        {
                            $pull: { "dislikes": _comicId }
                        }
                    );
                }
            });
            usercollection.find({
                "favourites": _comicId
            }, function(err, docs) {
                if (err) {
                    res.send(err);
                } else {
                    usercollection.update(
                        { "favourites": _comicId },
                        {
                            $pull: { "favourites": _comicId }
                        }
                    );
                }
            });
        });

        /* GET Create Profile page. */
        router.get('/register', function(req, res) {
            res.render('register');
        });

        /* GET logout */
        router.get('/logout', function(req, res) {
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
        router.post('/register', function(req, res) {

            // Set our internal DB variable
            var db = req.db;

            // Get our form values. These rely on the "name" attributes
            var username = req.body.username;
            var password = req.body.password;
            var confirmPassword = req.body.confirmPassword;
            var securityQuestion = req.body.securityQuestion;
            var securityAnswer = req.body.securityAnswer;
            var deviantartusername = req.body.deviantartusername;
            if (deviantartusername == "") {
                deviantartusername = "N/A";
            }
            if (password.length < 4 || password.length > 20) {
                res.send("Password needs to be between 4 - 20 characters. Please try again!");
            }
            else if (password != confirmPassword) {
                res.send("passwords do not match");
            }
            else {
                var user: User = new User(username, password, req.body.fullname, req.body.age, req.body.aboutme,
                    req.body.gender, req.body.location, securityQuestion, securityAnswer, deviantartusername);

                // Set our collection
                var collection = db.get('usercollection');
                // Submit to the DB
                collection.findOne({
                    "username": username.toLowerCase()
                }, function(err, docs) {
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
                            "securityanswer": user.getSecurityAnswer(),
                            "deviantartusername": user.getDeviantArtUsername(),
                            "likes": [],
                            "dislikes": [],
                            "favourites": []
                        }, function(err) {
                            if (err) {
                                // If it failed, return error
                                res.send("There was a problem adding the information to the database.");
                            }
                            else {
                                // Forward to home page
                                res.redirect('/home');
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
        router.get('/uploadcomics/*', function(req, res) {
            var comicId: number = parseInt(req.params[0]) || 0;
            if (comicId == 0) {
                var newComic: number = 1;
            } else {
                var newComic: number = 0;
            }
            res.render('uploadcomics', {
                cur: req.currentUser,
                newComic: newComic
            });
        });

        /* POST TO UPLOAD COMICS PAGE */
        router.post('/uploadcomics/*', function(req, res) {
            var comicId: number = parseInt(req.params[0]) || 0;
            var db = req.db;

            if (comicId == 0) {
                var title: string = req.body['title'];
                var tagString: string = req.body['tags'];
                var tags = tagString.split(',').map(Function.prototype.call, String.prototype.trim);
                var collection = db.get('comics');
                collection.findOne({}, { sort: { "comicId": -1 } }, function(err, docs) {
                    if (err) {
                        res.send(err);
                    } else {
                        var largestId: number;
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
                                "title": title,
                                "creator": req.currentUser.getUsername(),
                                "tags": tags,
                                "comments": []
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
                }, { sort: { "sequence": -1 } }, function(err, docs) {
                    if (err) {
                        res.send(err);
                    } else {
                        var largestSequence: number = docs['sequence'];
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
        router.get('/editcomic/*', function(req, res) {
            var comicId: number = parseInt(req.params[0]) || 0;

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
                }, function(err, docs) {
                    if (err) {
                        res.send(err);
                    } else if (docs != null) {
                        var title: string = docs['title'];
                        var tags: string = docs['tags'];
                        res.render('editcomic', {
                            cur: req.currentUser,
                            comicId: comicId,
                            title: title,
                            tagsValue: tags
                        })
                    }
                });
            }
        });

        /* POST TO EDIT COMICS PAGE */
        router.post('/editcomic/*', function(req, res) {
            var comicId: number = parseInt(req.params[0]) || 0;
            var title: string = req.body['title'];
            var tagString: string = req.body['tags'];
            var tags = tagString.split(',').map(Function.prototype.call, String.prototype.trim);
            var db = req.db;

            if (comicId == 0) {
                res.send('Image does not exist')
            } else {
                var collection = db.get('comics');
                collection.findOne({
                    "comicId": comicId
                }, function(err, docs) {
                    if (err) {
                        res.send(err);
                    } else {
                        collection.update(
                            { "comicId": comicId },
                            {
                                $set: {
                                    "title": title,
                                    "tags": tags
                                }
                            });
                        res.redirect("../../comic/" + comicId.toString());
                    }
                });
            }
        });

        /*GET resetpassword page */
        router.get('/resetpassword/:step/*', function(req, res) {
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
                }, function(err, docs) {
                    if (err) {
                        res.send(err);
                    }
                    else if (docs == null) {
                        res.render('error', {
                            error: "Unfortunately this username does not exist."
                        });
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
                res.render('error', {
                    error: "This page does not exist."
                });
            }
        });

        /*POST resetpassword page */
        router.post('/resetpassword/:step/*', function(req, res) {
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
                }, function(err, docs) {
                    if (err) {
                        res.send(err);
                    }
                    else if (docs == null) {
                        res.render('error', {
                            error: "Unfortunately this username does not exist."
                        });
                    }
                    else {
                        if (docs['securityanswer'] == securityAnswer) {
                            var security = req.currentSecurityResponse;
                            security.setSecurityAnswer(securityAnswer);
                            security.setIsConfirmed(true);
                            res.redirect("../3/" + username);
                        } else {
                            req.currentSecurityResponse.clear();
                            res.render('error', {
                                error: "Security answer was incorrect."
                            });
                        }
                    }
                })
            } else if (step == 3) {
                if (password.length < 4 || password.length > 20) {
                    res.render('error', {
                        error: "Password needs to be between 4 - 20 characters."
                    });
                } else if (password != confirmPassword) {
                    res.render('error', {
                        error: "Passwords did not match."
                    });
                } else {
                    var db = req.db;
                    var username = req.params[0];
                    var collection = db.get('usercollection');
                    collection.update(
                        { username: username },
                        {
                            $set: {
                                "password": password
                            }
                        }, function(err) {
                            if (err) {
                                // If it failed, return error
                                res.render('error', {
                                    error: "There was a problem updating your password."
                                });
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
        router.get('/myprofile', function(req, res) {
            var db = req.db;
            var currentUser = req.currentUser;
            var current = currentUser.getUsername();
            var collection = db.get('usercollection');
            collection.findOne({
                "username": current
            }, function(err, docs) {
                if (err) {
                    res.send(err);
                } else if (docs != null) {
                    //
                    var comicCollection = db.get('comics');
                    var favourites = docs['favourites'];
                    var favouriteTitles = [];
                    for (var i = 0; i < favourites.length; i++) {
                        comicCollection.findOne(
                            { "comicId": favourites[i] }, function(err, docs) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    favouriteTitles.push(docs['title']);
                                }
                            }
                        );
                    };
                    //
                    var fanCollection = db.get('fans');
                    fanCollection.find({
                        "fan": current
                    }, function(err, fanDocs) {
                        if (err) {
                            res.send(err);
                        } else {
                            fanCollection.find({
                                "following": current
                            }, function(err, followingDocs) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    var fans = [];
                                    var following = [];
                                    for (var i = 0; i < fanDocs.length; i++) {
                                        following.push(fanDocs[i]['following']);
                                    }
                                    for (var i = 0; i < followingDocs.length; i++) {
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
                                        deviantartusername: docs['deviantartusername'],
                                        fans: fans,
                                        following: following,
                                        favourites: docs['favourites'],
                                        favouriteTitles: favouriteTitles
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
                        aboutme: '',
                        deviantartusername: ''
                    });
                }
            });
        });


        /*Get profile pages*/
        router.get('/users/*', function(req, res) {
            var db = req.db;
            var collection = db.get('usercollection');
            var username = req.params['0'];
            if (username == req.currentUser.getUsername()) {
                res.redirect('../myprofile');
            } else {
                collection.findOne({
                    "username": username
                }, function(err, docs) {
                    if (err) {
                        res.send(err);
                    } else if (docs != null) {
                        //
                        var comicCollection = db.get('comics');
                        var favourites = docs['favourites'];
                        var favouriteTitles = [];
                        for (var i = 0; i < favourites.length; i++) {
                            comicCollection.findOne(
                                { "comicId": favourites[i] }, function(err, docs) {
                                    if (err) {
                                        res.send(err);
                                    } else {
                                        favouriteTitles.push(docs['title']);
                                    }
                                }
                            );
                        };
                        //
                        var fanCollection = db.get('fans');
                        fanCollection.find({
                            "fan": username
                        }, function(err, fanDocs) {
                            if (err) {
                                res.send(err);
                            } else {
                                fanCollection.find({
                                    "following": username
                                }, function(err, followingDocs) {
                                    if (err) {
                                        res.send(err);
                                    } else {
                                        var fans = [];
                                        var following = [];
                                        for (var i = 0; i < fanDocs.length; i++) {
                                            following.push(fanDocs[i]['following']);
                                        }
                                        for (var i = 0; i < followingDocs.length; i++) {
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
                                            deviantartusername: docs['deviantartusername'],
                                            following: following,
                                            favourites: docs['favourites'],
                                            favouriteTitles: favouriteTitles
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
        router.post('/users/*', function(req, res) {
            var currentUser = req.currentUser;
            if (currentUser.getIsLoggedIn() != true) {
                res.send("You must be logged in")
            } else {
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

        /* GET editprofile page. */
        router.get('/edit', function(req, res) {
            res.render('edit', { title: 'Edit Profile' });
        });

        /* POST for editprofile page */
        router.post('/edit', function(req, res) {

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
                var deviantartusername = req.body.deviantartusername;

                // Set our collection
                var collection = db.get('usercollection');

                collection.findOne({
                    "username": currentUser.getUsername()
                }, function(err, docs) {
                    if (err) {
                        res.send(err);
                    } else {
                        var password: string = docs['password'];
                        var securityQuestion: string = docs['securityquestion'];
                        var securityAnswer: string = docs['securityanswer'];
                        var user: User = new User(currentUser.getUsername(), password, fullname,
                            gender, age, aboutme, location, securityQuestion, securityAnswer, deviantartusername);
                        collection.update(
                            { username: currentUser.getUsername() },
                            {
                                $set: {
                                    "fullname": user.getFullName(),
                                    "gender": user.getGender(),
                                    "age": user.getAge(),
                                    "aboutme": user.getAboutMe(),
                                    "location": user.getLocation(),
                                    "deviantartusername": user.getDeviantArtUsername()
                                }
                            }, function(err) {
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

        //Get Search Page
        router.get('/search/*', function(req, res) {
            var db = req.db;
            var collection = db.get('usercollection');
            var comicCollection = db.get('comics');
            var search = req.params['0'];

            var username;
            var userExists;
            var comicIds = [];
            var titles = [];
            var tagExists;

            collection.findOne({
                "username": search
            }, function(err, docs) {
                if (err) {
                    res.send(err);
                } else if (docs != null) {
                    username = search;
                    userExists = 1;
                } else {
                    username = "No user exists with this name";
                    userExists = -1
                }
                comicCollection.find({
                    "tags": search
                }, function(comicErr, comicDocs) {
                    if (comicErr) {
                        res.send(comicErr);
                    } else if (comicDocs.length != 0) {
                        tagExists = 1;
                        comicIds = [];
                        titles = [];
                        for (var i = 0; i < comicDocs.length; i++) {
                            comicIds.push(comicDocs[i]['comicId']);
                            titles.push(comicDocs[i]['title']);
                        }
                        res.render('search', {
                            tags: search,
                            tagExists: tagExists,
                            comicIds: comicIds,
                            titles: titles,
                            username: username,
                            userExists: userExists
                        });

                    } else {
                        tagExists = -1;
                        res.render('search', {
                            tags: search,
                            tagExists: tagExists,
                            comicIds: comicIds,
                            titles: titles,
                            username: username,
                            userExists: userExists
                        })
                    }
                })
            });
        });
        
        /*POST search page*/
        router.post('/search/*', function(req, res) {
            var search = req.body.search;
            res.redirect('/search/' + search);
        });

        /*POST search for home page*/
        router.post('/home', function(req, res) {
            var search = req.body.search;
            res.redirect('/search/' + search);
        });
        
        /*POST search for home page*/
        router.post('/', function(req, res) {
            var search = req.body.search;
            res.redirect('/search/' + search);
        });
        
        //Get Sort By Likes Page
        router.get('/sortbylikes', function(req, res) {
            var db = req.db;
            var comicCollection = db.get('comics');

            comicCollection.find({}, { sort: { "liketotal": -1 } }, function(err, docs) {
                if (err) {
                    res.send(err);
                } else if (docs != null) {
                    res.render('sortbylikes', {
                        "comics": docs
                    });
                }
            });
        });

        //Get Sort By Views Page
        router.get('/sortbyviews', function(req, res) {
            var db = req.db;
            var comicCollection = db.get('comics');
            var comicIds = [];
            comicCollection.find({}, { sort: { "viewcount": -1 } }, function(err, docs) {
                if (err) {
                    res.send(err);
                }
                else if (docs != null) {
                    res.render('sortbyviews', {
                        "comics": docs
                    });
                }
            });
        });

        module.exports = router;
    }
}

var router = new Router();