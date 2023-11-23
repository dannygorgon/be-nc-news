const {
  getAllTopics,
  getAllEndpoints,
  getArticlesByID,
  getAllArticles,
  getCommentsByArticleID,
  postNewComment

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


exports.getCommentsByID = (req, res, next) => {
const { id } = req.params;
getCommentsByArticleID(id).then((comments) => {
res.status(200).send({ comments });
}).catch((err) => {
next(err)
})
}

exports.postComment = (req, res, next) => {
  console.log(req.params);
  const { id } = req.params;

  const{ username, body } = req.body;
  postNewComment(id, username, body )
    .then((comment) => {
      console.log(comment);
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
}