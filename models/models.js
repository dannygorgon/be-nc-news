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
      `SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`, // only need to group by unique value
          [id]
    )
    .then((data) => {
      if (!data.rows.length || data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      const article = data.rows[0];
      console.log(article);
      return article;
    });
};

const getAllArticles = (topic) => {
  let dbQuery = `
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
    LEFT JOIN topics ON articles.topic = topics.slug`;

  let params = [];

  if (topic) {
    dbQuery += " WHERE articles.topic = $1";
    params.push(topic);
  }

  dbQuery += ` 
    GROUP BY 
    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url
    ORDER BY created_at DESC;`;

    return db.query(dbQuery, params).then((data) => {
      if (!data.rows.length && topic) {
        return db.query('SELECT * FROM topics WHERE slug = $1', [topic])
          .then((topicData) => {
            if (!topicData.rows.length) {
              return Promise.reject({ status: 404, msg: "Not found" });
            }
            return data.rows;
          });
      }
      return data.rows;
    });
};

const getCommentsByArticleID = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then((article) => {
      if (!article.rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return db
        .query(
          `SELECT *  FROM comments
          WHERE article_id = $1 ORDER BY created_at DESC;`,
          [id]
        )
        .then((data) => {
          return data.rows;
        });
    });
};

const postNewComment = (article_id, author, body) => {
  if (!author || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows: articles }) => {
      if (!articles.length)
        return Promise.reject({ status: 404, msg: "Not found" });
      return db.query("SELECT * FROM users WHERE username = $1", [author]);
    })
    .then(({ rows: users }) => {
      if (!users.length)
        return Promise.reject({ status: 404, msg: "User not found" });
      return db
        .query(
          `INSERT INTO comments (article_id, author, body)
          VALUES ($1, $2, $3) RETURNING *;`,
          [article_id, author, body]
        )
        .then(({ rows: [comment] }) => {
          return comment;
        });
    });
};

const patchArticleVotesByID = (id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then((article) => {
      if (!article.rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return db
        .query(
          `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;`,
          [id, inc_votes]
        )
        .then((data) => {
          if (!data.rows.length) {
            return Promise.reject({ status: 404, msg: "Not found" });
          }
          return data.rows[0];
        });
    });
};

const deleteComment = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [id])
    .then((comment) => {
      if (!comment.rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return db
        .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [id])
        .then((data) => {
          if (!data.rows.length) {
            return Promise.reject({ status: 404, msg: "Not found" });
          }
          return data.rows[0];
        });
    });
};

const getAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then((data) => {
    return data.rows;
  });
};

module.exports = {
  getAllTopics,
  getAllEndpoints,
  getArticlesByID,
  getAllArticles,
  getCommentsByArticleID,
  postNewComment,
  patchArticleVotesByID,
  deleteComment,
  getAllUsers,
};
