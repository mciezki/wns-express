const db = require('../models');
const Article = db.article;
const User = db.user;
const categories = db.categories;

exports.postArticle = (req, res) => {
    if (!categories.includes(req.body.category)) return res.status(500).send({ message: 'Category not found' });

    const article = new Article({
        title: req.body.title,
        text: req.body.text,
        category: req.body.category,
        user: req.body.user
    });

    article.save((error, article) => {
        if (error) return res.status(500).send({ message: error });
        User.findOne({ username: req.body.user }, (error) => {
            if (error) return res.status(500).send({ message: error });
            article.save(error => {
                if (error) return res.status(500).send({ message: error });
                res.send({ message: 'Article posted.' })
            });
        });
    });
};


exports.deleteArticle = (req, res) => {
    Article.findByIdAndDelete(req.params.id, (error, article) => {
        if (error) return res.status(500).send({ message: error });
        // if (article.user !== req.body.username) return res.status(404).send({message: 'You have no access to do that.'});
        return res.status(200).send({ message: 'Article has been deleted' })
    });
};


exports.getArticles = (req, res) => {
    const skipping = parseInt(req.query.skip) || 0;
    const limiting = parseInt(req.query.limit) || 0;

    Article.find().skip(skipping).limit(limiting).exec((error, articles) => {
        if (error) return res.status(500).send({ message: error });
        res.status(200).send({ data: articles })
    });
};


exports.getArticle = (req, res) => {
    Article.findById(req.params.id, (error, article) => {
        if (error) return res.status(500).send({ message: error });
        res.status(200).send({
            data: article
        });
    });
};