var request = require('supertest');
var expect = require('expect.js');
var should = require('should');
var send = require('send');

describe("Check 200 response", function() {
    var home_url = "http://localhost:3000/home";
    var createprofile_url = "http://localhost:3000/createprofile";
    var login_url = "http://localhost:3000/login";

    it("home page returns status 200", function () {
        request(home_url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
        });
    });

    it("create profile page returns status 200", function () {
        request(createprofile_url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
        });
    });

    it("login page returns status 200", function () {
        request(login_url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
        });
    });
});


describe('Test Register a User', function() {
    var createprofile_url = "http://localhost:3000/createprofile";
    it('create a user', function(done){
        request(createprofile_url, function(error, response, body) {
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
})




