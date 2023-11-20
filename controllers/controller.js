const { getAllTopics: getTopics } = require("../models/models");

exports.getTopics = (req, res, next) => {
  getTopics().then((rows) => {
    console.log(rows);
    res.status(200).send({ topics: rows });
  }).catch((err) => {
    res.status(err.status).send({ msg: err.message });
  })
};