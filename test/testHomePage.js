var request = require('supertest');
var expect = require('expect.js');
var should = require('should');
var send = require('send');

describe('Home Page Testing', function() {
    var home_url = "http://localhost:3000/home";
    it('home page testing for keeping track of comicIds and urls', function (done) {
        request(home_url, function (error, response, body) {
            send({
                "comicIds": [1, 2, 3],
                "urls": ['images/1', 'images/2', 'images/3']
            });
            expect('Content-Type', /json/);
            expect(response.statusCode).to.equal(500);
            end(function (err, res) {
                res.body.comicIds.should.equal([1, 2, 3]);
                res.body.urls.should.equal(['images/1', 'images/2', 'images/3']);
            });
        });
        done();
    });
});