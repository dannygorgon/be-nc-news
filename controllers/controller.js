const { getAllTopics: getTopics, getAllEndpoints: getAPI, getAllEndpoints, } = require("../models/models");
const  endpoints  = require('../endpoints.json');

exports.getTopics = (req, res, next) => {
  getTopics().then((rows) => {
    res.status(200).send({ topics: rows });
  }).catch((err) => {
    res.status(err.status).send({ msg: err.message });
  })
}

exports.getAPI = (req, res, next) => {
    res.status(200).send(endpoints)
}
