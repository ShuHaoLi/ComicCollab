var request = require('supertest');
var expect = require('expect.js');
var should = require('should');
var send = require('send');
describe('Test Register a User (minimum information)', function() {
    var createprofile_url = "http://localhost:3000/createprofile";
    it('create a user with minimum info', function (done) {
        request(createprofile_url, function (error, response, body) {
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

describe('Test Register a User (max information)', function() {
    var createprofile_url = "http://localhost:3000/createprofile";
    it('create a user with max info', function (done) {
        request(createprofile_url, function (error, response, body) {
            send({
                "username": "FakeUser",
                "password": "1234567890",
                "fullname": "Fake User",
                "age": "100",
                "gender": "female",
                "location": "canada",
                "aboutme": "Im fake"

            });
            expect('Content-Type', /json/);
            expect(response.statusCode).to.equal(200);
            end(function (err, res) {
                res.body.username.should.equal('FakeUser');
                res.body.password.should.equal('1234567890');
                res.body.fullname.should.equal('Fake User');
                res.body.age.should.equal('100');
                res.body.gender.should.equal('female');
                res.body.location.should.equal('canada');
                res.body.aboutme.should.equal('Im fake');
            });
        });
        done();
    });
});

describe('Test NULL Register', function() {
    var createprofile_url = "http://localhost:3000/createprofile";
    it('create a user with null register', function (done) {
        request(createprofile_url, function (error, response, body) {
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


describe('Test Register a User with missing password', function() {
    var createprofile_url = "http://localhost:3000/createprofile";
    it('create a user with missing password', function (done) {
        request(createprofile_url, function (error, response, body) {
            send({
                "username": "FakeUser",
                "password": ""
            });
            expect('Content-Type', /json/);
            expect(response.statusCode).to.equal(500);
        });
        done();
    });
});
