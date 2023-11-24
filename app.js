const express = require("express");
const app = express();
const {
  getTopics,
  getAPI,
  getArticleByID,
  getArticles,
  getCommentsByID,
  postComment,
  patchArticleByID,
  deleteCommentByID
} = require("./controllers/controller");

const {
    handleCustomErrors,
    handlePSQLErrors,
    handleServerErrors,
  } = require("./errors");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getAPI);
app.get("/api/articles/:id", getArticleByID);
app.get("/api/articles", getArticles);
app.get("/api/articles/:id/comments", getCommentsByID);

app.post("/api/articles/:id/comments", postComment)

app.patch("/api/articles/:id", patchArticleByID);

app.delete("/api/comments/:id", deleteCommentByID)
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
