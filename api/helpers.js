const knex = require('knex');
const knexConfig = require('../knexfile');
const jwt = require('jsonwebtoken');

const db = knex(knexConfig.development);
const secret = process.env.JWT_SECRET || 'super secreto dont matter0';

module.exports = {
	addUser: function(user) {
		return db('users').insert(user);
	},
	login: function(user) {
		return db('users')
			.where({ username: user.username })
			.first();
	},
	auth: function(username) {
		return db('users')
			.where({ username })
			.first();
	},
	getUsers: function() {
		return db('users');
	},
	getUserById: function(id) {
		return db('users')
			.where({ id })
			.first();
	},
	generateToken: function(user) {
		const payload = {
			username: user.username,
			departments: user.departments
		};
		const options = {
			expiresIn: '1h',
			jwtid: '12345'
		};
		return jwt.sign(payload, secret, options);
	},
	secret
};

// module.exports.findByUsername = function(username, cb) {
// 	process.nextTick(async function() {
// 		var record = await module.exports.auth(username);
// 		if (record) {
// 			return cb(null, record);
// 		}
// 		return cb(null, null);
// 	});
// };
