const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';
const PGDATABASE = process.env.PGDATABASE

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}
console.log(`the node environment is...${ENV}`);
console.log(`the path is ${__dirname}/../.env.${ENV}`);
console.log(`the database is ${PGDATABASE}`);
module.exports = new Pool();
