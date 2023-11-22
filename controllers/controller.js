const {
  getAllTopics,
  getAllEndpoints,
  getArticlesByID,
  getAllArticles,
} = require("../models/models");
const endpoints = require("../endpoints.json");
const { get } = require("../app");

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
      next(err)
    });
};

exports.getArticles = (req, res, next) => {
  getAllArticles().then((articles) => {
    res.status(200).send({ articles });
  })
}