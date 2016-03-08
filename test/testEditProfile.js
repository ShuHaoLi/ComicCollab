var request = require('supertest');
var expect = require('expect.js');
var should = require('should');
var send = require('send');

describe('Test Enter Information for User', function() {
    var editprofile_url = "http://localhost:3000/editProfile";
    it('enter information for user for edit profile', function (done) {
        request(editprofile_url, function (error, response, body) {
            send({
                "name": "Name",
                "Age": "20",
                "Gender": "F",
                "Location": "Canada",
                "About Me": "I like to code"
            });
            expect('Content-Type', /json/);
            expect(response.statusCode).to.equal(200);
            end(function (err, res) {
                res.body.username.should.equal('Name');
                res.body.password.should.equal('20');
                res.body.gender.should.equal('F');
                res.body.location.should.equal('Canada');
                res.body.aboutme.should.equal('I like to code')
            });
        });
        done();
    });
});
