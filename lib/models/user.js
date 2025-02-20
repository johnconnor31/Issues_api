'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./connection');

const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    field: 'username'
  },
  password: {
    type: Sequelize.STRING,
    field: 'password'
  }
}, {
  tableName: 'users',
  createdAt: false,
  updatedAt: false
});

User.removeAttribute('id');

module.exports = User;
