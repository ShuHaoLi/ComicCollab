var request = require('supertest');
var expect = require('expect.js');
var should = require('should');
var send = require('send');

describe("Check Reset Password step 1", function() {
    var login_url = "http://localhost:3000/resetpassword/1/";
    request(login_url, function (error, response, body) {
        expect(response.statusCode).to.equal(200);
    });

});