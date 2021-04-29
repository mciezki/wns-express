const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');

const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) return res.status(403).send({ message: "No token provided." });

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) return res.status(401).send({ message: 'Unauthorized.' });
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((error, user) => {
        if (error) return res.status(500).send({ message: error });

        Role.find(
            {
                _id: { $in: user.roles }
            },
            (error, roles) => {
                if (error) return res.status(500).send({ message: error });

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'admin') {
                        next();
                        return;
                    }
                }
                res.status(403).send({ message: 'Admin role required.' });
                return;
            }
        )
    })
};


isBlocked = (req, res, next) => {
    User.findById(req.userId).exec((error, user) => {
        if (error) return res.status(500).send({ message: error });

        Role.find(
            {
                _id: { $in: user.roles }
            },
            (error, roles) => {
                if (error) return res.status(500).send({ message: error });

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'blocked') {
                        res.status(403).send({ message: 'User is blocked.' });
                        return;
                    }
                }
            }
        )
    })
};


const authJwt = {
    verifyToken,
    isAdmin,
    isBlocked
};

module.exports = authJwt;