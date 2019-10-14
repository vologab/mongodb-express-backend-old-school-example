'use strict';

var Company = require('./models/company.model');

function createCompany(req, res, next) {
  var company = new Company({ displayName: req.body.displayName });
  company.save(function (err, doc) {
    if (err) next(err);
    res.status(201).json(doc);
  });
}

function getCompanyById(req, res, next, id) {
  Company.findById(id, function (err, doc) {
    if (err) next(err);
    if (!doc) return next({ message: 'Company not found', status: 404 });
    req.company = doc;
    next();
  });
}

function updateCompany(req, res, next) {
  var company = req.company;
  company.displayName = req.body.displayName;
  company.save(function (err, updatedDoc) {
    if (err) next(err);
    res.status(200).json(updatedDoc);
  });
}

function createWorkspace(req, res, next) {
  var company = req.company;
  company.createWorkspace(req.body.displayName);
  company.save(function (err, updatedDoc) {
    if (err) next(err);
    res.status(200).json(updatedDoc);
  });
}

function updateWorkspace(req, res, next) {
  var company = req.company;
  company.updateWorkspace(req.params.workspaceId, req.body.displayName);
  company.save(function (err, updatedDoc) {
    if (err) next(err);
    res.status(200).json(updatedDoc);
  });
}

function associateUserToWorkspace(req, res, next) {
  var company = req.company;
  company.associateUserToWorkspace(req.params.workspaceId, req.body.email, req.body.role);
  company.save(function (err, updatedDoc) {
    if (err) next(err);
    res.status(200).json(updatedDoc);
  });
}

function removeUserFromWorkspace(req, res, next) {
  var company = req.company;
  company.removeUserFromWorkspace(req.params.workspaceId, req.params.email);
  company.save(function (err, updatedDoc) {
    if (err) next(err);
    res.status(200).json(updatedDoc);
  });
}

module.exports = {
  getCompanyById: getCompanyById,
  createCompany: createCompany,
  updateCompany: updateCompany,
  createWorkspace: createWorkspace,
  updateWorkspace: updateWorkspace,
  associateUserToWorkspace: associateUserToWorkspace,
  removeUserFromWorkspace: removeUserFromWorkspace,
};