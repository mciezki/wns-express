const moongose = require('mongoose');

const userSchema = new moongose.Schema({
    username: String,
    email: String,
    password: String,
    firstName: String,
    surname: String,
    roles: [
        {
            type: moongose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ]
});

module.exports = moongose.model('User', userSchema);