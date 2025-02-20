'use strict';

const respond = require('./responses');
const Issue = require('../models/issue');
const Revision = require('../models/revision');

const baseUrl = 'http://localhost:8080';

const Issues = {};

Issues.get = async (context) => {
  const issue = await Issue.findByPk(context.params.id);
  respond.success(context, { issue });
};

Issues.update = async (context) => {
  const newBody = context.request.body;
  const issue = await Issue.findByPk(context.params.id);
  if(!issue) {
    respond.notFound(context);
    return;
  }
  const newIssue = await issue.update({ ...issue.dataValues, ...newBody, updated_at: new Date() });
  const lastRevision = await Issue.findAll({
    attributes: [ 'id', 'revision.changes', 'revision.updated_at', 'revision.revisionNo' ], 
    where: {id: context.params.id }, 
    raw: true, include: [{
    model: Revision, as: 'revision', attributes: [],
    order: [['revisionNo',  'DESC']]
  }]});
  await Revision.create({ id: context.params.id, changes: context.request.body, updated_at: new Date(), revisionNo: (lastRevision[lastRevision.length-1]?.revisionNo || 0)+1 });
  respond.success(context, newIssue);
};

Issues.post = async (context) => {
  const body = context.request.body;
  const issue = await Issue.create({...body, created_at: body.created_at || new Date(), updated_at: body.updated_at || new Date()});
  await Revision.create({ id: issue.dataValues.id, changes: context.request.body, updated_at: new Date(), revisionNo: 1 });
  respond.success(context, { issue });
}

Issues.getAll = async (context) => {
  const issues = await Issue.findAll();
  context.body = issues;
  respond.success(context, { issues });
}

module.exports = Issues;
