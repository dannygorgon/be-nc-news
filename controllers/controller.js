const {
  getAllTopics,
  getAllEndpoints,
  getArticlesByID,
} = require("../models/models");
const endpoints = require("../endpoints.json");

exports.getTopics = (req, res, next) => {
  getAllTopics()
    .then((rows) => {
      res.status(200).send({ topics: rows });
    })
    .catch((err) => {
      res.status(err.status).send({ msg: err.message });
    });
};

exports.getAPI = (req, res, next) => {
  res.status(200).send(endpoints);
};

exports.getArticleByID = (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  getArticlesByID(id)
    .then((article) => {
      console.log(article);
      if (!article || article.length === 0) {
        res.status(404).send({ error: `Article id ${id} not found` });
      } else {
        res.status(200).send({ article });
      }
      // !data
      //   ?res.status(404).send({error: `Article id ${id} not found`})
      //   : data.length === 0  ? res.status(200).send({article: []})
      //    :res.status(200).send({article: data})
    })
    .catch((err) => {
      if (!id || isNaN(+id)) {
        res
          .status(400)
          .send({ error: `Bad request, ${id} is not a valid request` });
      } else {
        res.status(500).send({ error: "Internal server error" });
      }
    });
};
