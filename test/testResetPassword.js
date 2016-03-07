var request = require('supertest');
var expect = require('expect.js');
var should = require('should');
var send = require('send');

describe("Check Reset Password step 1", function() {
    var reset_url = "http://localhost:3000/resetpassword/1/";
    request(reset_url, function () {
        expect(response.statusCode).to.equal(200);
    });
});

describe("Check Reset Password step 2", function() {
    var username = "testuser";
    var reset2_url = " http://localhost:3000/resetpassword/2/" + username;
    request(reset2_url, function () {
        expect(response.statusCode).to.equal(200);
    });
});

describe("Check Reset Password step 3", function() {
    var username = "testuser";
    var reset3_url = "http://localhost:3000/resetpassword/3/" + username;
    request(reset3_url, function () {
        expect(response.statusCode).to.equal(200);
    });
});



