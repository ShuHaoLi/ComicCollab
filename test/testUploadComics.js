var request = require('supertest');
var expect = require('expect.js');
var should = require('should');
var send = require('send');

describe("Test Upload Comics 200", function() {
    var uploadcomics_url = "http://localhost:3000/uploadcomics";
    it("upload comics returns status 200", function () {
        request(uploadcomics_url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
        });
    });
});

describe('Upload Comics Testing', function() {
    var uploadcomics_url = "http://localhost:3000/uploadcomics";
    it('test upload comics tracks comic Id', function (done) {
        request(uploadcomics_url, function (error, response, body) {
            send({
                "comicId": 1
            });
            expect('Content-Type', /json/);
            expect(response.statusCode).to.equal(500);
            end(function (err, res) {
                res.body.comicId.should.equal(1);
            });
        });
        done();
    });
});