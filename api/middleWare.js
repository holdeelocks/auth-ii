const jwt = require('jsonwebtoken');

module.exports.protected = function protected(req, res, next) {
	const token = req.headers.authorization;
	const secret = process.env.JWT_SECRET || 'super secreto dont matter0';
	console.log(process.env.JWT_SECRET);
	if (token) {
		jwt.verify(token, secret, (err, decodedToken) => {
			if (err) {
				res.status(401).send({ error: 'You shall not pass! (invalid token)' });
			} else {
				req.decodedToken = decodedToken;
				next();
			}
		});
	} else {
		res.status(401).json({ message: 'No token provided' });
	}
};

module.exports.checkRole = function checkRole(department) {
	return function(req, res, next) {
		console.log(req.decodedToken);
		if (req.decodedToken.departments.includes(department)) {
			res
				.status(403)
				.json({ message: `your ${department} privileges do not allow access to this content` });
		} else {
			next();
		}
	};
};
