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




