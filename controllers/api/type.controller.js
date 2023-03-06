const Type = require('../../models/type');

exports.findAll = (req, res) => {
    Type.findAll()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to get all types!'
            });
        });
}

exports.create = (req, res) => {
    if(!req.body.name) {
        res.status(404).send({
            message: 'You must provide a Type name!'
        });
        return;
    }
    Type.create({ name: req.body.name })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to create Type!'
            });
        });
}

exports.delete = (req, res) => {
    if(!req.params.id) {
        res.status(404).send({
            message: 'You must provide a Type id!'
        });
        return;
    }
    Type.destroy({
        where: { id: req.params.id }
    })
    .then(() => {
        res.send({ message: `Type (id: ${req.params.id}) was successfully deleted!` });
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Unable to delete Type!'
        });
    });
}

exports.update = (req, res) => {
    if(!req.body.id || !req.body.name) {
        res.status(404).send({
            message: 'You must provide the Type name!'
        });
        return;
    }
    Type.upsert({ id: req.body.id, name: req.body.name })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to update Type!'
            });
        });
}