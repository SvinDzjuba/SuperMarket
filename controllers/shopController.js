const Shop = require('../models/shop');

exports.findAll = (req, res) => {
    Shop.findAll()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to get all shops!'
            });
        });
}

exports.create = (req, res) => {
    if(!req.body.name || !req.body.address) {
        res.status(404).send({
            message: 'You must provide all shop data!'
        });
        return;
    }
    const shop = {
        name: req.body.name,
        address: req.body.address,
    }
    Shop.create(shop)
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to create shop!'
            });
        });
}

exports.delete = (req, res) => {
    if(!req.params.id) {
        res.status(404).send({
            message: 'You must provide a shop id!'
        });
        return;
    }
    Shop.destroy({
        where: { id: req.params.id }
    })
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Unable to delete shop!'
        });
    });
}

exports.update = (req, req) => {
    if(!req.body.name && !req.body.address) {
        res.status(404).send({
            message: 'You must provide the shop data!'
        });
        return;
    }
    Shop.upsert({ 
        name: req.body.name,
        address: req.body.address,
    })
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Unable to update shop!'
        });
    });
}