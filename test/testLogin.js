var request = require('supertest');
var expect = require('expect.js');
var should = require('should');
var send = require('send');

describe('Test Login a User', function() {
    var login_url = "http://localhost:3000/login";
    it('login a user', function (done) {
        request(login_url, function (error, response, body) {
            send({
                "username": "FakeUser",
                "password": "1234567890"
            });
            expect('Content-Type', /json/);
            expect(response.statusCode).to.equal(200);
            end(function (err, res) {
                res.body.username.should.equal('FakeUser');
                res.body.password.should.equal('1234567890');
            });
        });
        done();
    });
});

describe('Test Login a User with missing username', function() {
    var login_url = "http://localhost:3000/login";
    it('login a user with missing username', function (done) {
        request(login_url, function (error, response, body) {
            send({
                "username": "",
                "password": "1234567890"
            });
            expect('Content-Type', /json/);
            expect(response.statusCode).to.equal(500);
        });
        done();
    });
});

describe('Test Login a User with missing password', function() {
    var login_url = "http://localhost:3000/login";
    it('login a user with massing password', function (done) {
        request(login_url, function (error, response, body) {
            send({
                "username": "Fake User",
                "password": ""
            });
            expect('Content-Type', /json/);
            expect(response.statusCode).to.equal(500);
        });
        done();
    });
});

describe('Test Login a User with no password and user name', function() {
    var login_url = "http://localhost:3000/login";
    it('login a user with no password and user name', function (done) {
        request(login_url, function (error, response, body) {
            send({
                "username": "",
                "password": ""
            });
            expect('Content-Type', /json/);
            expect(response.statusCode).to.equal(500);
        });
        done();
    });
});