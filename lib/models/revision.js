'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./connection');
const Issue = require('./issue');

const Revision = sequelize.define('revision', {
  myId: {
    type: Sequelize.INTEGER,
    field: 'id'
  },
  changes: {
    type: Sequelize.JSON,
    field: 'changes'
  },
  revisionNo: {
    type: Sequelize.INTEGER,
    field: 'revisionNo'
  }
}, {
  timestamps: true,
  createdAt: false,
  updatedAt: 'updated_at',
  tableName: 'revisions'
});

Issue.hasMany(Revision, { foreignKey: 'id', as: 'revision' });

module.exports = Revision;