'use strict';

const respond = require('./responses');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../../config');
const Users = require('../models/user');

const Login = {};

Login.login = async (context) => {
    const { username, password } = context.request.body;
    if(!username || !password) {
        respond.badRequest(context, { message: 'No username or password sent!' });
        return;
    }
    try {
    const user = await Users.findAll({ where: { username: username } });
    if(!user.length) {
        respond.badRequest(context, { message: 'Username not found!' });
        return;
    }
    if(await bcrypt.compare(password, user[0].dataValues.password)) {
        respond.success(context, {
            token: jsonwebtoken.sign({
                data: username,
                exp: Math.floor(Date.now()/1000) + 60*60
            }, secret)
        });
    } else {
        respond.badRequest(context, { message: 'Wrong password!' });
    }
    } catch(e) {
        respond.badRequest(context, { message: 'Unknown username!' });
    }
}

Login.register = async (context) => {
    const { username, password } = context.request.body;
    if(!username || !password) {
        respond.badRequest(context, { message: 'No username or password sent!' });
        return;
    }
    let user;
    try {
        user = await Users.findAll({ where: { username: username }});
        if(user.length) {
            respond.badRequest(context, { message: 'Username already exists!' });
            return;
        }
    } catch(e) {}
    context.request.body.password = await bcrypt.hash(password, 5);
    await Users.create(context.request.body);
    respond.success(context, { message: 'Registration successful!'});
};

module.exports = Login;