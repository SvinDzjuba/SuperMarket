const Product = require('../models/product');
const Classification = require('../models/classification');

exports.findAll = (req, res) => {
    Product.findAll()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to get all products!'
            });
        });
}

exports.create = async (req, res) => {
    if(!req.body.name || !req.body.price || !req.body.classification) {
        res.status(404).send({
            message: 'You must provide all product data!'
        });
        return;
    }
    const classification = await Classification.findOne({
        where: { name: req.body.classification },
        attributes: ['id']
    });
    if(classification != null) {
        const product = {
            name: req.body.name,
            price: req.body.price,
            classification: classification.id
        }
        Product.create(product)
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'Unable to create product!'
                });
            });
    }
}

exports.delete = (req, res) => {
    if(!req.params.id) {
        res.status(404).send({
            message: 'You must provide a product id!'
        });
        return;
    }
    Product.destroy({
        where: { id: req.params.id }
    })
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Unable to delete product!'
        });
    });
}

exports.update = async (req, req) => {
    if(!req.body.name && !req.body.price && !req.body.classification) {
        res.status(404).send({
            message: 'You must provide the product data!'
        });
        return;
    }
    const classification = await Classification.findOne({
        where: { name: req.body.classification },
        attributes: ['id']
    });
    Product.upsert({ 
        name: req.body.name,
        price: req.body.price,
        classification: classification.id
    })
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Unable to update product!'
        });
    });
}