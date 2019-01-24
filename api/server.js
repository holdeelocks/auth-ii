require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const path = require('path');
// const passport = require('passport');
// const local = require('passport-local');
const { protected, checkRole } = require('./middleWare');
const {
	addUser,
	login,
	getUsers,
	generateToken,
	getUserById,
	findByUsername
} = require('./helpers');

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(express.static(path.join(__dirname, 'client/build')));

server.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});
// server.use(passport.initialize());
// server.use(passport.session());
// server.use(require('body-parser').urlencoded({ extended: true }));
// server.use(
// 	require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false })
// );

// var LocalStrategy = local.Strategy;

// passport.serializeUser(function(user, cb) {
// 	cb(null, user);
// });

// passport.deserializeUser(function(id, cb) {
// 	db.users.findById(id, function(err, user) {
// 		if (err) {
// 			return cb(err);
// 		}
// 		cb(null, user);
// 	});
// });

// passport.use(
// 	new LocalStrategy(function(username, password, cb) {
// 		findByUsername(username, async function(err, user) {
// 			if (err) {
// 				return cb(err);
// 			}
// 			if (!user) {
// 				return cb(null, false);
// 			}
// 			if (!bcrypt.compareSync(password, user.password)) {
// 				return cb(null, false);
// 			}
// 			return cb(null, user);
// 		});
// 	})
// );

// server.get('/', (req, res) => {
// 	res.json({ success: false });
// });

server.post('/api/register', async (req, res) => {
	const userInfo = req.body;
	userInfo.password = bcrypt.hashSync(userInfo.password, 14);
	try {
		const ids = await addUser(userInfo);
		const user = await getUserById(ids[0]);
		const token = generateToken(user);
		res.status(201).json({ token, id: user.id });
	} catch (err) {
		if (err.errno === 19) return res.status(400).json({ error: 'That username already exists' });
		res.status(500).json(err);
	}
});

server.post(
	'/api/login',
	// passport.authenticate('local', { failureRedirect: '/' }),
	async (req, res) => {
		const creds = req.body;
		// console.log(creds);
		try {
			const user = await login(creds);
			if (user && bcrypt.compareSync(creds.password, user.password)) {
				res.status(200).json({ token: generateToken(creds) });
			} else {
				res.status(401).json({ error: 'you shall not pass!' });
			}
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	}
);

server.get('/api/users', protected, checkRole('janitor'), async (req, res) => {
	try {
		const users = await getUsers();
		res.status(200).json({ users, token: req.decodedToken });
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = server;
