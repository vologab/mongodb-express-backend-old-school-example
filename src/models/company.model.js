'use strict';
var mongoose = require('mongoose');
var uuidV1 = require('uuid/v1');
var isEmail = require('validator').isEmail;
var USER_ROLES = require('../constants').USER_ROLES;

var Schema = mongoose.Schema;

var displayNameSchema = { type: String, minlength: 1 };

var userSchema = new Schema({
  email: { type: String, validate: [isEmail, 'invalid email'] },
  role: { type: String, enum: [USER_ROLES.basic, USER_ROLES.admin] }
}, { _id: false });

var workspaceSchema = new Schema({
  _id: { type: String, default: function () { return uuidV1(); } },
  displayName: displayNameSchema,
  name: { type: String },
  users: [userSchema],
});



var companySchema = new Schema({
  _id: { type: String, default: function () { return uuidV1(); } },
  displayName: displayNameSchema,
  name: { type: String, unique: true },
  workspaces: [workspaceSchema]
});


companySchema.methods.createWorkspace = function (displayName) {
  this.workspaces.push({ displayName: displayName });
};

companySchema.methods.updateWorkspace = function (workspaceId, displayName) {
  var currWorkspaces = this.workspaces.filter(function (e) {
    return e._id = workspaceId;
  });
  currWorkspaces[0].displayName = displayName;
};

companySchema.methods.associateUserToWorkspace = function (workspaceId, email, role) {
  var currWorkspaces = this.workspaces.filter(function (e) {
    return e._id = workspaceId;
  });
  currWorkspaces[0].users.push({ email: email, role: role });
};

companySchema.methods.removeUserFromWorkspace = function (workspaceId, email) {
  var currWorkspaces = this.workspaces.filter(function (e) {
    return e._id = workspaceId;
  });
  currWorkspaces[0].users = currWorkspaces[0].users.filter(function (e) {
    return e.email !== email;
  });
};

function convertToLowerCase() {
  this.name = this.displayName.toLowerCase();
}

workspaceSchema.pre('save', convertToLowerCase);
companySchema.pre('save', convertToLowerCase);


companySchema.index({ _id: 1, 'workspaces.name': 1 }, { unique: true });
companySchema.index({ 'workspaces._id': 1, 'workspace.users.email': 1 }, { unique: true });

module.exports = mongoose.model('Company', companySchema, 'companies');

