const jsonData = require('./shops_data.json');
// Models
const Classification = require('../models/classification');
const Employee = require('../models/employee');
const Position = require('../models/position');
const Product = require('../models/product');
const Shop = require('../models/shop');

module.exports = async () => {
    const jsonStr = JSON.stringify(jsonData);
    const data = await JSON.parse(jsonStr);
    for (let i = 0; i < data.length; i++) {
        let employees = data[i].employees;
        for (let j = 0; j < employees.length; j++) {
            // let position = await Position.findOne({
            //     where: { name: employees[j].position }
            // })
            let position = await Position.findOrCreate({
                where: { name: employees[j].position },
            });
            console.log(position);
            // console.log(employees[j].fullName);
        }
    }
}