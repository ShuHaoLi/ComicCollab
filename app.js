///<reference path='types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='types/DefinitelyTyped/express/express.d.ts'/>
//import session = BrowserStorage.session;
//'use strict';
var LoggedInUser = (function () {
    function LoggedInUser(username, isLoggedIn, profilepicture) {
        this.username = username;
        this.isLoggedIn = isLoggedIn;
        this.profilepicture = profilepicture;
    }
    LoggedInUser.prototype.getUsername = function () {
        return this.username;
    };
    LoggedInUser.prototype.setUsername = function (username) {
        this.username = username;
    };
    LoggedInUser.prototype.getIsLoggedIn = function () {
        return this.isLoggedIn;
    };
    LoggedInUser.prototype.setIsLoggedIn = function (isLoggedIn) {
        this.isLoggedIn = isLoggedIn;
    };
    LoggedInUser.prototype.getProfilePicture = function () {
        return this.profilepicture;
    };
    LoggedInUser.prototype.setProfilePicture = function (profilepicture) {
        this.profilepicture = profilepicture;
    };
    return LoggedInUser;
})();
var SecurityResponse = (function () {
    function SecurityResponse(securityAnswer, isConfirmed) {
        this.securityAnswer = securityAnswer;
        this.isConfirmed = isConfirmed;
    }
    SecurityResponse.prototype.getSecurityAnswer = function () {
        return this.securityAnswer;
    };
    SecurityResponse.prototype.setSecurityAnswer = function (securityAnswer) {
        this.securityAnswer = securityAnswer;
    };
    SecurityResponse.prototype.getIsConfirmed = function () {
        return this.isConfirmed;
    };
    SecurityResponse.prototype.setIsConfirmed = function (isConfirmed) {
        this.isConfirmed = isConfirmed;
    };
    SecurityResponse.prototype.clear = function () {
        this.securityAnswer = '';
        this.isConfirmed = false;
    };
    return SecurityResponse;
})();
var Application = (function () {
    function Application() {
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
        var http = require('http');
        var deviantart = require('./public/node_modules/node-deviantart');
        var app = express();
        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');
        // uncomment after placing your favicon in /public
        //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));
        //app.use(multer({ dest: './public/images'}).array("file"));
        // THIS IS THE MULTER CODE (DO NOT TOUCH)
        app.use(multer({
            dest: './public/images',
            limits: { fileSize: 1024 * 1024 }
        }).array("file"));
        // Make our db accessible to our router
        app.use(function (req, res, next) {
            req.currentUser = currentUser;
            req.db = db;
            req.currentSecurityResponse = currentSecurityResponse;
            req.deviantart = deviantart;
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
        // viewed at http://localhost:3000
        app.get('/', function (req, res) {
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
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
        app.listen(3030);
        module.exports = app;
    }
    return Application;
})();
var currentUser = new LoggedInUser('', false, '');
var currentSecurityResponse = new SecurityResponse('', false);
var application = new Application();
//# sourceMappingURL=app.js.map
//# sourceMappingURL=app.js.map 
