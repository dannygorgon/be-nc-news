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
  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url FROM articles
  WHERE article_id = $1;`,
      [id]
    )
    .then((data) => {
      if (!data.rows.length || data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return data.rows[0];
    });
};

const getAllArticles = () => {
  return db
    .query(
      `
  SELECT 
  articles.author, 
  articles.title, 
  articles.article_id, 
  articles.topic, 
  articles.created_at, 
  articles.votes, 
  articles.article_img_url, 
  COUNT(comments.comment_id) AS comment_count 
  FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id 
  GROUP BY 
  articles.author, 
  articles.title, 
  articles.article_id, 
  articles.topic, 
  articles.created_at, 
  articles.votes, 
  articles.article_img_url 
  ORDER BY created_at DESC;`
    )
    .then((data) => {
      return data.rows;
    });
};

const getCommentsByArticleID = (id) => {

  return db
  .query(
  `SELECT *  FROM comments
  WHERE article_id = $1 ORDER BY created_at DESC;`,
  [id]
  )
  .then((data) => {
  return data.rows;
  });
  }

module.exports = {
  getAllTopics,
  getAllEndpoints,
  getArticlesByID,
  getAllArticles,
  getCommentsByArticleID
};
