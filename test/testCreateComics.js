var request = require('supertest');
var expect = require('expect.js');
var should = require('should');
var send = require('send');

describe("Check Create Comic page 200 response", function() {
    var reset_url = "http://localhost:3000/uploadcomics/";
    request(reset_url, function () {
        expect(response.statusCode).to.equal(200);
    });
});

describe("Check Create Comic successfully", function() {
    var reset_url = "http://localhost:3000/uploadcomics/";
    request(reset_url, function () {

    });
});