const Shop = require('../models/shop');
const Product = require('../models/product');
const Employee = require('../models/employee');
const ShopEmployee = require('../models/shop_employee');
const ShopProduct = require('../models/shop_product');

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

exports.create = async (req, res) => {
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
    await Shop.findOrCreate({ where: shop })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to create shop!'
            });
        });
    const thisShop = await Shop.findOne({
        where: {
            name: req.body.name,
            address: req.body.address,
        },
        attributes: ['id', 'name']
    });

    if(thisShop != null && req.body.employeeIds && req.body.productIds) {
        if(req.body.employeeIds) {
            const reqEmployee = req.body.employeeIds;
            if(!Array.isArray(reqEmployee)) {
                let employee = await Employee.findOne({
                    where: { id: reqEmployee },
                    attributes: ['id']
                });
                if(employee != null) {
                    await ShopEmployee.findOrCreate({ 
                        where: { shopId: thisShop.id, employeeId: employee.id }
                    }).catch(err => {
                        res.status(500).send({
                            message: err.message || 'Unable to add shop employee!'
                        });
                    });
                }
            } else {
                for (let i = 0; i < reqEmployee.length; i++) {
                    let employee = await Employee.findOne({
                        where: { id: reqEmployee[i] },
                        attributes: ['id']
                    });
                    if(employee != null) {
                        await ShopEmployee.findOrCreate({ 
                            where: { shopId: thisShop.id, employeeId: employee.id }
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: err.message || 'Unable to add shop employees!'
                            });
                        });
                    }
                }
            }
        }

        if(!req.body.productIds) { return; }
        const reqProduct = req.body.productIds;
        if(!Array.isArray(reqProduct)) {
            let product = await Product.findOne({
                where: { id: reqProduct },
                attributes: ['id']
            });
            if(product != null) {
                await ShopProduct.findOrCreate({ 
                    where: { shopId: thisShop.id, productId: product.id }
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || 'Unable to add shop product!'
                    });
                });
            }
        } else {
            for (let i = 0; i < reqProduct.length; i++) {
                let product = await Product.findOne({
                    where: { id: reqProduct[i] },
                    attributes: ['id']
                });
                if(product != null) {
                    await ShopProduct.findOrCreate({ 
                        where: { shopId: thisShop.id, productId: product.id }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || 'Unable to add shop products!'
                        });
                    });
                }
            }
        }
        res.send({ message: `Shop '${thisShop.name}' was successfully added!` });
    }
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
    .then(() => {
        res.send({ message: `Shop (id: ${req.params.id}) was successfully deleted!` });
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Unable to delete shop!'
        });
    });
}

exports.update = (req, res) => {
    if(!req.body.id || !req.body.name || !req.body.address) {
        res.status(404).send({
            message: 'You must provide the shop data!'
        });
        return;
    }
    Shop.upsert({ 
        id: req.body.id,
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