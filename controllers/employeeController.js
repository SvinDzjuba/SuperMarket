const Employee = require('../models/employee');
const Position = require('../models/position');

exports.findAll = (req, res) => {
    Employee.findAll()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to get all employees!'
            });
        });
}

exports.create = async (req, res) => {
    if(!req.body.fullName || !req.body.age || !req.body.position) {
        res.status(404).send({
            message: 'You must provide all employee data!'
        });
        return;
    }
    const position = await Position.findOne({
        where: { name: req.body.position },
        attributes: ['id']
    });
    if(position != null) {
        const employee = {
            fullName: req.body.fullName,
            age: req.body.age,
            position: position.id
        }
        Employee.create(employee)
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'Unable to create employee!'
                });
            });
    }
}

exports.delete = (req, res) => {
    if(!req.params.id) {
        res.status(404).send({
            message: 'You must provide a employee id!'
        });
        return;
    }
    Employee.delete(req.params.id)
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to delete employee!'
            });
        });
}

exports.update = async (req, req) => {
    if(!req.body.fullName && !req.body.age && !req.body.position) {
        res.status(404).send({
            message: 'You must provide employee data!'
        });
        return;
    }
    const position = await Position.findOne({
        where: { name: req.body.position },
        attributes: ['id']
    });
    const employee = {
        fullName: req.body.fullName,
        age: req.body.age,
        position: position.id
    }
    Employee.update(employee)
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to update employee!'
            });
        });
}