const db = require("../db/connection")


const getAllTopics = () => {
    return db.query(`SELECT * FROM topics;`).then((data) => {
        return data.rows;
      });
  };

  module.exports = {
    getAllTopics,
  };