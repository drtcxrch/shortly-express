const dotenv = require('dotenv');
const mysql = require('mysql');
const createTables = require('./config');
const Promise = require('bluebird');
const database = 'shortly';

// Load env vars
dotenv.config({ path: './config/config.env' });

const connection = mysql.createConnection({
  user: process.env.DB_USER, //'root',
  password: process.env.DB_PASSWORD //'sdAvuQ0t2S!G%J',
});

const db = Promise.promisifyAll(connection, { multiArgs: true });

db.connectAsync()
  .then(() => console.log(`Connected to ${database} database as ID ${db.threadId}`))
  .then(() => db.queryAsync(`CREATE DATABASE IF NOT EXISTS ${database}`))
  .then(() => db.queryAsync(`USE ${database}`))
  .then(() => createTables(db));

module.exports = db;


// mysql.server start
// mysql.server stop
// mysql -u root -p