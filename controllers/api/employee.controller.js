const Employee = require('../../models/employee');
const Position = require('../../models/position');

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
    if(!req.body.fullName || !req.body.birthDate || !req.body.position) {
        res.status(404).send({
            message: 'You must provide all employee data!'
        });
        return;
    }
    let position = await Position.findOne({
        where: { name: req.body.position },
        attributes: ['id']
    });
    if(position == null) {
        res.send({ message: 'This position does not exist!' })
        return;
    }
    const employee = {
        fullName: req.body.fullName,
        birthDate: req.body.birthDate,
        positionId: position.id
    }
    Employee.findOrCreate({ where: employee })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to create employee!'
            });
        });
}

exports.delete = (req, res) => {
    if(!req.params.id) {
        res.status(404).send({
            message: 'You must provide a employee id!'
        });
        return;
    }
    Employee.destroy({
        where: { id: req.params.id }
    })
    .then(() => {
        res.send({ message: `Employee (id: ${req.params.id}) was successfully deleted!` });
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Unable to delete employee!'
        });
    });
}

exports.update = async (req, res) => {
    if(!req.body.id || !req.body.fullName || !req.body.birthDate || !req.body.position) {
        res.status(404).send({
            message: 'You must provide the employee data!'
        });
        return;
    }
    const position = await Position.findOne({
        where: { name: req.body.position },
        attributes: ['id']
    });
    let employee = null;
    if(position == null) { 
        employee = {
            id: req.body.id,
            fullName: req.body.fullName,
            birthDate: req.body.birthDate
        }
    } else {
        employee = {
            id: req.body.id,
            fullName: req.body.fullName,
            birthDate: req.body.birthDate,
            positionId: position.id
        }
    }
    Employee.upsert(employee)
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to update employee!'
            });
        });
}