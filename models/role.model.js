const moongose = require('mongoose');

const roleSchema = new moongose.Schema({
    name: String
});

module.exports = moongose.model('Role', roleSchema);