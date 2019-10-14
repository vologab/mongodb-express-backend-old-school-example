'use strict';

var companiesCtrl = require('./companies.controller');

var baseRoute = '/companies';
var companyRoute = baseRoute + '/:companyId';

function setupCompaniesRoutes(app) {
  // define params
  app.param('companyId', companiesCtrl.getCompanyById);

  // define routes  
  app.route(baseRoute).post(companiesCtrl.createCompany);
  app.route(companyRoute).patch(companiesCtrl.updateCompany);
  app.route(companyRoute + '/workspaces').post(companiesCtrl.createWorkspace);
  app.route(companyRoute + '/workspaces/:workspaceId').patch(companiesCtrl.updateWorkspace);
  app.route(companyRoute + '/workspaces/:workspaceId/users').post(companiesCtrl.associateUserToWorkspace);
  app.route(companyRoute + '/workspaces/:workspaceId/users/:email').delete(companiesCtrl.removeUserFromWorkspace);
}

module.exports = setupCompaniesRoutes;