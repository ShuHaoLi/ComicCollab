var request = require('supertest');
var expect = require('expect.js');
var should = require('should');
var send = require('send');
describe('Test Register a User (with security questions)', function() {
    var createprofile_url = "http://localhost:3000/createprofile";
    it('create a user with security questions', function (done) {
        request(createprofile_url, function (error, response, body) {
            send({
                "username": "FakeUser",
                "password": "testing",
                "confirmPassword": "testing",
                "securityQuestion": "What's 2+2?",
                "securityAnswer": "4"
            });
            expect('Content-Type', /json/);
            expect(response.statusCode).to.equal(200);
            end(function (err, res) {
                res.body.username.should.equal('FakeUser');
                res.body.password.should.equal('testing');
                res.body.confirmPassword.should.equal('testing');
                res.body.securityQuestion.should.equal("What's 2+2?");
                res.body.securityAnswer.should.equal('2');
            });
        });
        done();
    });
});