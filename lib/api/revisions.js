'use strict';

const { Op } = require('sequelize');
const respond = require('./responses');
const Revision = require('../models/revision');
const Issues = require('../models/issue');

const Revisions = {};

Revisions.get = async (context) => {
  const revisions = await Issues.findAll({attributes: [ 'id', 'revision.changes', 'revision.updated_at', 'revision.revisionNo' ], where: {id: context.params.id}, order: [['updated_at',  'DESC']], raw: true,  include: [{
    model: Revision, as: 'revision', attributes: []
  }]});
  respond.success(context, { revisions });
};

Revisions.compare = async (context) => {
    const { revision1, revision2 } = context.request.body;
    let rev1, rev2;
    if(!revision1 || !revision2) {
        respond.badRequest(context, {
            message: 'Need revision1 and revision2  (>0) in request body.'
        });
        return;
    }
    if(revision1 < revision2) {
        rev1 = revision1;
        rev2 = revision2;
    } else {
        rev2 = revision1;
        rev1 = revision2;
    }

    const revisions = await Issues.findAll({
        attributes: [ 'id', 'revision.changes', 'revision.updated_at', 'revision.revisionNo' ], 
        where: {id: context.params.id,}, order: [['updated_at',  'ASC']], 
        raw: true,  
        include: [{
            model: Revision, as: 'revision', attributes: [],
            where: { 
                'revisionNo': {
                    [Op.between]: [1, rev2]
            }}
      }]});

      let before = revisions[0].changes;
      revisions.slice(1, rev1).forEach((r) => {
        before = { ...before, ...r.changes};
      });

      let after = { ...before };
      let changes = {};
      revisions.slice(rev1+1, rev2).forEach((r) => {
        after = { ...after, ...r.changes};
        changes = { ...changes, ...r.changes};
      });
      respond.success(context, { before, after, changes });
}

module.exports = Revisions;
