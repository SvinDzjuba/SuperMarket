const Product = require('../models/product');
const ClassificationType = require('../models/classification_type');
const Classification = require('../models/classification');
const Type = require('../models/type');

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
    if(!req.body.name || !req.body.price || !req.body.type) {
        res.status(404).send({
            message: 'You must provide all product data!'
        });
        return;
    }
    const type = await Type.findOne({
        where: { name: req.body.type },
        attributes: ['id']
    });
    if(type == null) {
        res.send({ message: 'This position does not exist!' })
        return;
    }
    const classificationType = await ClassificationType.findOne({
        where: { typeId: type.id }
    });
    const classification = await Classification.findOne({
        where: { id: classificationType.classificationId }
    });
    await ClassificationType.create({
        where: {
            classificationId: classification.id,
            typeId: type.id
        }
    });
    const this_ct = ClassificationType.findOne({
        where: {
            classificationId: classification.id,
            typeId: type.id
        },
        attributes: ['id']
    });
    const product = {
        name: req.body.name,
        price: req.body.price,
        classificationType: this_ct.id,
        description: req.body.description === undefined ? req.body.description : ''
    }
    Product.findOrCreate({ where: product })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to create product!'
            });
        });
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
    .then(() => {
        res.send({ message: `Product (id: ${req.params.id}) was successfully deleted!` });
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Unable to delete product!'
        });
    });
}

exports.update = async (req, res) => {
    if(!req.body.id || !req.body.name || !req.body.price || !req.body.classification) {
        res.status(404).send({
            message: 'You must provide the product data!'
        });
        return;
    }
    const classification = await Classification.findOne({
        where: { name: req.body.classification },
        attributes: ['id']
    });
    let product = null;
    if(classification == null) {
        product = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
        }
    } else {
        product = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            classification: classification.id
        }
    }
    Product.upsert(product)
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to update product!'
            });
        });
}