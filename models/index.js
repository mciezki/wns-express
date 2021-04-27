const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.user = require('./user.model');
db.role = require('./role.model');
db.roles = ['user', 'admin', 'moderator', 'redactor'];

module.exports = db;