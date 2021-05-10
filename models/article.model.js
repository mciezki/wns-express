const moongose = require('mongoose');

const articleSchema = new moongose.Schema({
    title: { type: String, required: [true, 'Title is required'] },
    text: { type: String, required: [true, 'Text is required'] },
    category: { type: String, required: [true, 'Category is required'] },
    user: { type: String, required: [true, 'User is required'] },
    picture: { type: String },
    created: { type: Date, default: Date.now },
})

module.exports = moongose.model('Article', articleSchema);