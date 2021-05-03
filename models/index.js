const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.user = require('./user.model');
db.role = require('./role.model');
db.article = require('./article.model');
db.roles = ['user', 'admin', 'blocked'];
db.categories = ['technology', 'life style', 'games', 'health', 'politics', 'tragedies', 'fun'];

module.exports = db;