const knex = require('knex');
const knexfile = require('../../knexfile');

const database = knex(knexfile);
database.inventory = require('./inventory')(database);

database.trade = require('./trade')(database);

module.exports = { database };