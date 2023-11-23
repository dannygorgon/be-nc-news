const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';
const PGDATABASE = process.env.PGDATABASE
require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});
const config = {}

console.log(ENV);
if (ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

module.exports = new Pool(config);
