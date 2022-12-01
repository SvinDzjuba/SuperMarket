const Classification = require('../models/classification');

exports.findAll = (req, res) => {
    Classification.findAll()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to get all classifications!'
            });
        });
}

exports.create = (req, res) => {
    if(!req.body.name) {
        res.status(404).send({
            message: 'You must provide a classification name!'
        });
        return;
    }
    Classification.create({ name: req.body.name })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to create classification!'
            });
        });
}

exports.delete = (req, res) => {
    if(!req.params.id) {
        res.status(404).send({
            message: 'You must provide a classification id!'
        });
        return;
    }
    Classification.destroy({
        where: { id: req.params.id }
    })
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Unable to delete classification!'
        });
    });
}

exports.update = (req, res) => {
    if(!req.body.name) {
        res.status(404).send({
            message: 'You must provide the classification name!'
        });
        return;
    }
    Classification.upsert({ name: req.body.name })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to update classification!'
            });
        });
}