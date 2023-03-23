const { authJwt } = require('../../middleware');

exports.checkAccess = (req, res) => {
    res.send({ message: req.uid });
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