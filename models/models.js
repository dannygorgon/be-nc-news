const db = require("../db/connection");

const getAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((data) => {
    return data.rows;
  });
};

const getAllEndpoints = () => {
  return db.query(`SELECT * FROM api;`).then((data) => {
    return data.rows;
  });
};
const getArticlesByID = (id) => {
  console.log("Received ID:", id);
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url FROM articles
  WHERE article_id = $1;`,
      [id]
    )
    .then((data) => {
      return data.rows;
    });
};

module.exports = {
  getAllTopics,
  getAllEndpoints,
  getArticlesByID,
};
