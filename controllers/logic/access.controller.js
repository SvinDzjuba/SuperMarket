const { authJwt } = require('../../middleware');

exports.allAccess = (req, res) => {
    let token = req.headers['x-access-token'];
    if(!token) { 
        res.render('home', { message: 'All Access Content!' });
        return;
    } else {
        res.render('home', { message: req.roles })
    }
};
exports.userBoard = (req, res) => {
    // res.render('home', { message: 'User Content!' });
    res.render('home', { message: req.roles })
};
exports.adminBoard = (req, res) => {
    res.render('home', { message: 'Admin Content!' });
};
exports.moderatorBoard = (req, res) => {
    res.render('home', { message: 'Moderator Content!' });
};