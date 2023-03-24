const { createDb } = require('./config/database');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.set('views', 'views');
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
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
        let User = require('./models/user');
        let Role = require('./models/role');
        let UserRoles = require('./models/user_roles');
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
        User.belongsToMany(Role, { through: UserRoles });
        Role.belongsToMany(User, { through: UserRoles });
        // ---------------------------------------------------
        Classification.belongsToMany(Type, { through: ClassificationType });

        await db.sync({ alter: true });

        // Api routes
        require('./routes/api/classification.route')(app);
        require('./routes/api/type.route')(app);
        require('./routes/api/employee.route')(app);
        require('./routes/api/position.route')(app);
        require('./routes/api/product.route')(app);
        require('./routes/api/shop.route')(app);
        require('./routes/api/role.route')(app);

        // Pages routes
        require('./routes/pages/home.route')(app);
        require('./routes/pages/auth.route')(app);

        const { insertData } = require('./data/data.insert');
        insertData();

        // Swagger configuration
        const initSwagger = require('./docs/swagger');
        initSwagger(app);


    }, 700);
}
configureDb();