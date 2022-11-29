const { dbInit } = require('./config/database');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Configure database
dbInit();

// Models init/relations
let Shop = require('./models/shop');
let Classification = require('./models/classification');
let Position = require('./models/position');
let Product = require('./models/product');
let Employee = require('./models/employee');
let ShopEmployee = require('./models/shop_employee');
let ShopProduct = require('./models/shop_product');

Shop.belongsToMany(Product, { through: ShopProduct });
Product.belongsToMany(Shop, { through: ShopProduct });
// ---------------------------------------------------
Shop.belongsToMany(Employee, { through: ShopEmployee });
Employee.belongsToMany(Shop, { through: ShopEmployee });