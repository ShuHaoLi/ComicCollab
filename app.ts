///<reference path='types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='types/DefinitelyTyped/express/express.d.ts'/>
'use strict';
interface Error {
    status?: number;
}

class LoggedInUser {
    private username: String;
    private isLoggedIn: boolean;
    constructor(username: String, isLoggedIn: boolean) {
        this.username = username;
        this.isLoggedIn = isLoggedIn;
    }
    getUsername(){
        return this.username;
    }
    setUsername(username: String){
        this.username = username;
    }
    getIsLoggedIn(){
        return this.isLoggedIn;
    }
    setIsLoggedIn(isLoggedIn: boolean){
        this.isLoggedIn = isLoggedIn;
    }
}

class Application {
    constructor() {
        var express = require('express');
        var path = require('path');
        var favicon = require('serve-favicon');
        var logger = require('morgan');
        var cookieParser = require('cookie-parser');
        var bodyParser = require('body-parser');
        var mongo = require('mongodb');
        var monk = require('monk');

        var db = monk('user:pass@ds060968.mongolab.com:60968/wecode_db');

        var routes = require('./routes/index');
        var users = require('./routes/users');

        var multer = require('multer');

        var app = express();

        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');

        // uncomment after placing your favicon in /public
        //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(multer({ dest: './public/images'}).array("file"));
        var upload = multer({ dest: './public/images', limits: { fileSize: 10 * 1024 * 1024}});
        // File Upload route
        //app.post('/uploadcomics', upload.array('file'));

        /*
        app.use(multer({
            dest: './uploads'.array("file")},
            rename: function (fieldname, filename) {
                return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
            },
            limits: {
                fieldNameSize: 50,
                files: 1,
                fields: 5,
                fileSize: 1024 * 1024

            }
        })); */

        // Make our db accessible to our router
        app.use(function(req, res, next) {
            req.currentUser = currentUser;
            req.db = db;
            next();
        });

        app.use('/', routes);
        app.use('/users', users);

        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        /*

        app.use(multer({
                dest: './uploads/',
                rename: function (fieldname, filename) {
                    return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
                },
                onFileUploadStart: function (file) {
                    console.log(file.name + ' is starting ...');
                },
                onFileUploadComplete: function (file, req, res) {
                    console.log(file.name + ' uploading is ended ...');
                    console.log("File name : " + file.name + "\n" + "FilePath: " + file.path)
                },
                onError: function (error, next) {
                    console.log("File uploading error: => " + error)
                    next(error)
                },
                onFileSizeLimit: function (file) {
                    console.log('Failed: ', file.originalname + " in path: " + file.path)
                },
                putSingleFilesInArray: true
            })
        );

        app.post('/profile', upload.single('avatar'), function (req, res, next) {
            // req.file is the `avatar` file
            // req.body will hold the text fields, if there were any
        })

        app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
            // req.files is array of `photos` files
            // req.body will contain the text fields, if there were any
        })

        var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
        app.post('/cool-profile', cpUpload, function (req, res, next) {
            // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
            //
            // e.g.
            //  req.files['avatar'][0] -> File
            //  req.files['gallery'] -> Array
            //
            // req.body will contain the text fields, if there were any
        });



        var upload = multer({
            dest: './uploads',
            limits: {
                fieldNameSize: 50,
                files: 1,
                fields: 5,
                fileSize: 1024 * 1024

            },
            rename: function(fieldname, filename) {
                return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
            },
            onFileUploadStart: function(file) {
                if(file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
                    return false;
                } else if (file.size > 1024 * 1024) {
                    return false;
                }
            },
            onFileUploadComplete: function (file, req, res) {
                console.log(file.name + ' uploading is ended ...');
                console.log("File name : " + file.name + "\n" + "FilePath: " + file.path)
            },
            onError: function (error, next) {
                console.log("File uploading error: => " + error)
                next(error)
            },
            onFileSizeLimit: function (file) {
                console.log('Failed: ', file.originalname + " in path: " + file.path)
            },
            putSingleFilesInArray: true,
            inMemory: true
        });
        */

        // viewed at http://localhost:3000
        app.get('/', function(req, res) {
            res.sendFile(path.join(__dirname + '/*.html'));
        });

        // error handlers

        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function (err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error.html', {
                message: err.message,
                error: {}
            });
        });
        app.listen(3030);
        module.exports = app;
    }
}

var currentUser = new LoggedInUser('', false);
var application = new Application();

//# sourceMappingURL=app.js.map
//# sourceMappingURL=app.js.map