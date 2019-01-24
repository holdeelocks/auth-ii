const server = require('./api/server');
const express = require('express');
const path = require('path');

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server listening on port ${port}`));

server.use(express.static(path.join(__dirname, 'client/build')));

server.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});
