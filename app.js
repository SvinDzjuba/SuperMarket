const { createDb, db } = require('./config/database');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
require('./routes/classificationRoute')(app);
require('./routes/employeeRoute')(app);
require('./routes/positionRoute')(app);
require('./routes/productRoute')(app);
require('./routes/shopRoute')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Configure database
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

const { insertData } = require('./data/insert_data');
async function configureDb() {
    await createDb();
    await db.sync({ alter: true });
    insertData();
}
configureDb();