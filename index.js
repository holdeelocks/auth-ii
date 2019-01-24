const server = require('./api/server');
// const express = require('express');

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server listening on port ${port}`));
