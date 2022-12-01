const Position = require('../models/position');

exports.findAll = (req, res) => {
    Position.findAll()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to get all positions!'
            });
        });
}

exports.create = (req, res) => {
    if(!req.params.name) {
        res.status(404).send({
            message: 'You must provide a position name!'
        });
        return;
    }
    Position.create({ name: req.params.name })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to create position!'
            });
        });
}

exports.delete = (req, res) => {
    if(!req.params.id) {
        res.status(404).send({
            message: 'You must provide a position id!'
        });
        return;
    }
    Position.destroy({
        where: { id: req.params.id }
    })
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Unable to delete position!'
        });
    });
}

exports.update = (req, req) => {
    if(!req.body.name) {
        res.status(404).send({
            message: 'You must provide the position name!'
        });
        return;
    }
    Position.upsert({ name: req.body.name })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to update position!'
            });
        });
}