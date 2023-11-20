const express = require('express');
const app = express();
const { getTopics, getAPI } = require("./controllers/controller");
app.use(express.json())
app.get("/api/topics", getTopics)
app.get("/api", getAPI)

module.exports = app; 