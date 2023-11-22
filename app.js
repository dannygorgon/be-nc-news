const express = require("express");
const app = express();
const {
  getTopics,
  getAPI,
  getArticleByID,
  getArticles,
} = require("./controllers/controller");

const {
    handleCustomErrors,
    handlePSQLErrors,
    handleServerErrors,
  } = require("./errors");

app.get("/api/topics", getTopics);
app.get("/api", getAPI);
app.get("/api/articles/:id", getArticleByID);
app.get("/api/articles", getArticles);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
