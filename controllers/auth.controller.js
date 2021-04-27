const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        firstName: req.body.firstName,
        surname: req.body.surname
    });

    user.save((error, user) => {
        if (error) return res.status(500).send({ message: error });
        Role.findOne({ name: 'user' }, (error, role) => {
            if (error) return res.status(500).send({ message: error });
            user.roles = [role._id];
            user.save(error => {
                if (error) return res.status(500).send({ message: error });
                res.send({ message: 'User was registered successfully. You can log in.' })
            })
        })
    })
};

exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username
    })
        .populate('roles', '-__v')
        .exec((error, user) => {
            if (error) return res.status(500).send({ message: error });
            if (!user) return res.status(404).send({ message: 'User Not Found.' });

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: 'Invalid Password'
                });
            };

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            var authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push(`ROLE_${user.roles[i].name.toUpperCase()}`);
            }
            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                surname: user.surname,
                roles: authorities,
                accessToken: token
            });
        });
};