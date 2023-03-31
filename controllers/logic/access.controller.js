const { authJwt } = require('../../middleware');

exports.checkAccess = (req, res) => {
    let roles = '';
    for (let i = 0; i < req.roles.length; i++) {
        roles += ' ' + req.roles[i].name + ' ';
    }
    res.status(200).send({ message: `[${roles}] Content!` });
};
exports.allAccess = (req, res) => {
    res.send({ message: 'Public Content!' });
};
exports.userBoard = (req, res) => {
    res.status(200).send({ message: 'User Content!' });
};
exports.adminBoard = (req, res) => {
    res.send({ message: 'Admin Content!' });
};
exports.moderatorBoard = (req, res) => {
    res.send({ message: 'Moderator Content!' });
};