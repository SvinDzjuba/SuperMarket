const { createDb } = require('./config/database');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

async function configureDb() {
    await createDb();
    setTimeout(async () => {
        // Getting the sequelize instance
        const { db } = require('./config/database');
    
        // Configure database
        let Shop = require('./models/shop');
        let Type = require('./models/type');
        let Classification = require('./models/classification');
        let Position = require('./models/position');
        let Product = require('./models/product');
        let Employee = require('./models/employee');
        let ClassificationType = require('./models/classification_type');
        let ShopEmployee = require('./models/shop_employee');
        let ShopProduct = require('./models/shop_product');

        Shop.belongsToMany(Product, { through: ShopProduct });
        Product.belongsToMany(Shop, { through: ShopProduct });
        // ---------------------------------------------------
        Shop.belongsToMany(Employee, { through: ShopEmployee });
        Employee.belongsToMany(Shop, { through: ShopEmployee });
        // ---------------------------------------------------
        Classification.belongsToMany(Type, { through: ClassificationType });

        await db.sync({ alter: true });
        
        // Import routes
        require('./routes/classificationRoute')(app);
        require('./routes/employeeRoute')(app);
        require('./routes/positionRoute')(app);
        require('./routes/productRoute')(app);
        require('./routes/shopRoute')(app);
        
        const { insertData } = require('./data/insert_data');
        insertData();
    }, 100);
}
configureDb();