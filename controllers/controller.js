const {
  getAllTopics,
  getAllEndpoints,
  getArticlesByID,
  getAllArticles,
  getCommentsByArticleID,
  postNewComment,
  patchArticleVotesByID,
  deleteComment,
  getAllUsers,
} = require("../models/models");
const endpoints = require("../endpoints.json");
const { get } = require("../app");
const { query } = require("../db/connection");

exports.getTopics = (req, res, next) => {
  getAllTopics()
    .then((rows) => {
      res.status(200).send({ topics: rows });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAPI = (req, res, next) => {
  res.status(200).send(endpoints);
};

exports.getArticleByID = (req, res, next) => {
  const { id } = req.params;
  getArticlesByID(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  getAllArticles(topic).then((articles) => {
    res.status(200).send({ articles });
  }).catch((err) => {
    next(err);
  });
}


exports.getCommentsByID = (req, res, next) => {
  const { id } = req.params;
  getCommentsByArticleID(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { id } = req.params;

  const { username, body } = req.body;

  postNewComment(id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleByID = (req, res, next) => {
  const { id } = req.params;
  const { inc_votes } = req.body;
  patchArticleVotesByID(id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentByID = (req, res, next) => {
  const { id } = req.params;
  deleteComment(id)
    .then((comment) => {
      res.status(204).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  getAllUsers().then((users) => {
    res.status(200).send({ users });
  });
};
