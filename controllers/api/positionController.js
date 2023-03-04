const Position = require('../../models/position');

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
    if(!req.body.name) {
        res.status(404).send({
            message: 'You must provide a position name!'
        });
        return;
    }
    Position.create({ name: req.body.name })
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
    .then(() => {
        res.send({ message: `Position (id: ${req.params.id}) was successfully deleted!` });
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Unable to delete position!'
        });
    });
}

exports.update = (req, res) => {
    if(!req.body.id || !req.body.name) {
        res.status(404).send({
            message: 'You must provide the position name!'
        });
        return;
    }
    Position.upsert({ id: req.body.id, name: req.body.name })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to update position!'
            });
        });
}