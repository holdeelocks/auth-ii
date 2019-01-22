const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");

const { addUser, login, getUsers, generateToken, getUserById } = require("./helpers");
const protected = require("./middleWare");

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());

server.post("/api/register", async (req, res) => {
  const userInfo = req.body;
  userInfo.password = bcrypt.hashSync(userInfo.password, 14);
  try {
    const ids = await addUser(userInfo);
    const user = await getUserById(ids[0]);
    const token = generateToken(user);

    res.status(201).json({ token, id: user.id });
  } catch (err) {
    if (err.errno === 19) return res.status(400).json({ error: "That username already exists" });
    res.status(500).json(err);
  }
});

server.post("/api/login", async (req, res) => {
  const creds = req.body;
  try {
    const user = await login(creds);
    if (user && bcrypt.hashSync(creds.password, user.password)) {
      const token = generateToken(creds);

      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "you shall not pass!" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

server.get("/api/users", protected, async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

server.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).send("you can never leave");
      } else {
        res.status(200).send("bye bye");
      }
    });
  } else {
    res.json({ message: "logged out already" });
  }
});

module.exports = server;
