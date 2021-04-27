const db = require('../models');
const roles = db.roles;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    //username:
    User.findOne({ username: req.body.username })
        .exec((error, user) => {
            if (error) return res.status(500).send({ message: error });
            if (user) return res.status(400).send({ message: 'Username is already in use.' });
            //email:
            User.findOne({ email: req.body.email })
                .exec((error, email) => {
                    if (error) return res.status(500).send({ message: error });
                    if (email) return res.status(400).send({ message: 'Email is already in use.' });
                    next()
                });
        });
};


checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!roles.includes(req.body.roles[i])) return res.status(400).send({ message: `${req.body.roles[i]} does not exist!` });
        }
        if (req.body.roles[0] !== 'user') return res.status(400).send({ message: 'You have no persmission to this role.' });
    }
    next();
};


const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};

module.exports = verifySignUp;
