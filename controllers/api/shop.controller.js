const Shop = require('../../models/shop');
const Type = require('../../models/type');
const Product = require('../../models/product');
const Position = require('../../models/position');
const Employee = require('../../models/employee');
const Classification = require('../../models/classification');
const ClassificationType = require('../../models/classification_type');
const ShopEmployee = require('../../models/shop_employee');
const ShopProduct = require('../../models/shop_product');

exports.findAll = async function(req, res) {
    let shops = [];
    let completed = 0;
    const data = await Shop.findAll()
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to get all shops!'
            });
        });
        for (let i = 0; i < data.length; i++) {
            new Promise(async (resolve, reject) => {
                let employeesList = [];
                let productsList = [];
                const shop_employees = await ShopEmployee.findAll({ where: { shopId: data[i].id } });
                for (let i = 0; i < shop_employees.length; i++) {
                    const shop_employee = await Employee.findOne({ where: { id: shop_employees[i].employeeId } });
                    const position = await Position.findOne({
                        where: {
                            id: shop_employee.position
                        }
                    });
                    let employee = {
                        fullName: shop_employee.fullName,
                        position: position.name
                    };
                    employeesList.push(employee);
                }
                const shop_products = await ShopProduct.findAll({ where: { shopId: data[i].id } })
                    for (let j = 0; j < shop_products.length; j++) {
                        const shop_product = await Product.findOne({ where: { id: shop_products[j].productId } });
                        const classificationType = await ClassificationType.findOne({
                            where: {
                                id: shop_product.classificationType
                            }
                        });
                        const classification = await Classification.findOne({
                            where: {
                                id: classificationType.classificationId
                            }
                        });
                        const type = await Type.findOne({
                            where: {
                                id: classificationType.typeId
                            }
                        });
                        let product = {
                            name: shop_product.name,
                            classification: {
                                name: classification.name,
                                type: type.name
                            },
                            price: shop_product.price
                        }
                        productsList.push(product);
                    }
                    let shop = {
                        name: data[i].name,
                        address: data[i].address,
                        employees: employeesList,
                        products: productsList
                    };
                    shops.push(shop);
                    completed++;
                    resolve(shops);
            }).then(shopsList => {
                if(completed == data.length) {
                    res.send(shopsList);
                }
            })
        }
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

        if(!req.body.productIds) return;
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

exports.delete = async (req, res) => {
    console.log(req.params.id);
    if(!req.params.id) {
        res.status(404).send({
            message: 'You must provide a shop id!'
        });
        return;
    }
    await Shop.destroy({
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
    if(!req.params.id || !req.body.name || !req.body.address) {
        res.status(404).send({
            message: 'You must provide the shop data!'
        });
        return;
    }
    Shop.update({
            name: req.body.name,
            address: req.body.address,
        },
        {
            where: {
                id: req.params.id,
            },
        }
    )
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Unable to update shop!'
        });
    }); 
}