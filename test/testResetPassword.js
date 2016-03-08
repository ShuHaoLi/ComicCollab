var request = require('supertest');
var expect = require('expect.js');
var should = require('should');
var send = require('send');

describe("Check Reset Password step 1", function() {
    var reset_url = "http://localhost:3000/resetpassword/1/";
    it("resetpassword returns status 200", function () {
        request(reset_url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
        });
    });
});

describe("Check Reset Password step 2", function() {
    var username = "testuser";
    var reset2_url = " http://localhost:3000/resetpassword/2/" + username;
    it("resetpassword page 2 returns status 200", function () {
        request(reset2_url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
        });
    });
});

describe("Check Reset Password step 3", function() {
    var username = "testuser";
    var reset3_url = "http://localhost:3000/resetpassword/3/" + username;
    it("resetpassword page 3 returns status 200", function () {
        request(reset3_url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
        });
    });
});

describe('Test Reset Password step 1', function() {
    var reset_url = "http://localhost:3000/resetpassword/1/";
    it('enter in username for reset password step 1', function (done) {
        request(reset_url, function (error, response, body) {
            send({
                "username": "lyazdan23"
            });
            expect('Content-Type', /json/);
            expect(response.statusCode).to.equal(500);
            end(function (err, res) {
                res.body.username.should.equal('lyazdan23');
            });
        });
        done();
    });
});

describe('Test Reset Password step 2', function() {
    var reset2_url = "http://localhost:3000/resetpassword/2";
    it('enter in username for reset password step 2', function (done) {
        request(reset2_url, function (error, response, body) {
            send({
                "securityAnswer": "Mooshy"
            });
            expect('Content-Type', /json/);
            expect(response.statusCode).to.equal(500);
            end(function (err, res) {
                res.body.securityAnswer.should.equal('Mooshy');
            });
        });
        done();
    });
});

describe('Test Reset Password step 3', function() {
    var reset3_url = "http://localhost:3000/resetpassword/3";
    it('enter in username for reset password step 3', function (done) {
        request(reset3_url, function (error, response, body) {
            send({
                "password": "testing",
                "confirmPassword": "testing"
            });
            expect('Content-Type', /json/);
            expect(response.statusCode).to.equal(500);
            end(function (err, res) {
                res.body.password.should.equal('testing');
                res.body.confirmPassword.should.equal('testing');
            });
        });
        done();
    });
});