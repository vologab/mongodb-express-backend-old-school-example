'use strict';
var assert = require('chai').assert;
var request = require('supertest');
var uuidv1 = require('uuid/v1');



var isUUID = require('./utils/isUUID');
var isLowerCase = require('./utils/isLowerCase');

var app = require('../src/app');
var Company = require('../src/models/company.model');


describe('Companies controller', function () {
  var companyName1 = 'testCompany1';
  var companyName2 = 'testCompany2';
  var workspace1 = 'Workspace1';
  var workspace2 = 'Workspace2';
  var workspaceId = uuidv1();
  var testEmail = 'test@user.com';
  var testRole = 'admin';

  beforeEach(function (done) {
    Company.remove({}, function (err) {
      if (err) done(err);
      done();
    });
  });

  it('Check companies creation', function (done) {
    request(app)
      .post('/companies')
      .send({ displayName: companyName1 })
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        var body = res.body;
        assert.equal(body.displayName, companyName1);
        assert.ok(isUUID(body._id), ' ID should be UUID v1');
        assert.ok(isLowerCase(companyName1, body.name), 'Name should be display name in lower case');
        return done();
      });
  });

  it('Check update correct company', function (done) {
    var company = new Company({ displayName: companyName1 });
    company.save(function (err, company) {
      if (err) done(err);
      request(app)
        .patch('/companies/' + company._id)
        .send({ displayName: companyName2 })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          var body = res.body;
          assert.equal(body.displayName, companyName2, 'Display should be changed');
          assert.ok(isLowerCase(companyName2, body.name), 'Name also should be changed');
          return done();
        });
    });
  });

  it('Check update incorrect company', function (done) {
    var company = new Company({ displayName: companyName1 });
    company.save(function (err) {
      if (err) done(err);
      request(app)
        .patch('/companies/' + 'incorrect id')
        .send({ displayName: companyName2 })
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          var body = res.body;
          assert.isNotEmpty(body.message, 'Should return error message');
          return done();
        });
    });
  });

  it('Check workspace creation', function (done) {
    var company = new Company({ displayName: companyName1 });
    company.save(function (err, company) {
      if (err) done(err);
      request(app)
        .post('/companies/' + company._id + '/workspaces')
        .send({ displayName: workspace1 })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          var body = res.body;
          assert.equal(body.workspaces.length, 1, 'One workspace should be added');

          var workspace = body.workspaces[0];

          assert.ok(isUUID(workspace._id), 'Workspace ID should be UUID v1');
          assert.equal(workspace.displayName, workspace1, 'Workspace should be correct');
          assert.ok(
            isLowerCase(workspace.displayName, workspace.name),
            'Workspace name should be display name in lower case'
          );
          return done();
        });
    });
  });


  it('Check workspace update', function (done) {
    var company = new Company({ displayName: companyName1, workspaces: [{ displayName: workspace1 }] });
    company.save(function (err, company) {
      if (err) done(err);
      request(app)
        .patch('/companies/' + company._id + '/workspaces/' + workspaceId)
        .send({ displayName: workspace2 })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          var body = res.body;
          var workspace = body.workspaces[0];

          assert.equal(workspace.displayName, workspace2, 'Workspace display name should changed');
          assert.ok(isLowerCase(workspace.displayName, workspace.name), 'Workspace display name should be changed');
          return done();
        });
    });
  });

  it('Check user adding to workspace', function (done) {
    var company = new Company({ displayName: companyName1, workspaces: [{ displayName: workspace1 }] });
    company.save(function (err, company) {
      request(app)
        .post('/companies/' + company._id + '/workspaces/' + company.workspaces[0]._id + '/users')
        .send({ email: testEmail, role: testRole })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          var body = res.body;

          assert.equal(body.workspaces[0].users.length, 1, 'One user should be assigned');
          var user = body.workspaces[0].users[0];
          assert.equal(user.email, testEmail, 'User should have correct email');
          assert.equal(user.role, testRole, 'User should have correct role');
          return done();
        });
    });
  });

  it('Check user removal', function (done) {
    var company = new Company(
      {
        displayName: companyName1,
        workspaces: [
          {
            displayName: workspace1,
            users: [
              { email: testEmail, role: 'admin' },
              { email: 'some_other@mail.test', role: 'basic' }]
          }
        ]
      });
    company.save(function (err, company) {
      request(app)
        .delete('/companies/' + company._id + '/workspaces/' + company.workspaces[0]._id + '/users/' + testEmail)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          var body = res.body;

          assert.equal(body.workspaces[0].users.length, 1, 'Only one user should be removed');
          assert.notEqual(body.workspaces[0].users[0].email, testEmail, 'Correct user should be removed');
          return done();
        });
    });
  });


});
