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

(async function configureDb() {
    await createDb();

    // Getting the sequelize instance
    let intervalCount = 0;
    let interval = setInterval(() => {
        const { db } = require('./config/database');
        if(db != undefined) {
            if(db == 'NO_XAMPP') {
                clearInterval(interval);
                return;
            }
            init(db);
            clearInterval(interval);
        } else {
            intervalCount++;
        }
        if(intervalCount == 50) {
            clearInterval(interval);
            console.log('The database connection timed out.');
        }
    }, 100);

    async function init(db) {

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

        Shop.belongsToMany(Product, { through: ShopProduct }, { onDelete: 'CASCADE' }, { onUpdate: 'CASCADE' });
        Product.belongsToMany(Shop, { through: ShopProduct }, { onDelete: 'CASCADE' }, { onUpdate: 'CASCADE' });
        // ---------------------------------------------------
        Shop.belongsToMany(Employee, { through: ShopEmployee }, { onDelete: 'CASCADE' }, { onUpdate: 'CASCADE' });
        Employee.belongsToMany(Shop, { through: ShopEmployee }, { onDelete: 'CASCADE' }, { onUpdate: 'CASCADE' });
        // ---------------------------------------------------
        User.belongsToMany(Role, { through: UserRoles });
        Role.belongsToMany(User, { through: UserRoles });
        // ---------------------------------------------------
        Classification.belongsToMany(Type, { through: ClassificationType }, { onDelete: 'CASCADE' }, { onUpdate: 'CASCADE' });
        ClassificationType.hasMany(Product, { onDelete: 'CASCADE' }, { onUpdate: 'CASCADE' });
        // ---------------------------------------------------
        Position.hasMany(Employee, { onDelete: 'CASCADE' }, { onUpdate: 'CASCADE' });

        // await db.sync({ alter: true });
        const { insertData } = require('./data/data.insert');
        // insertData();

        // Api routes
        require('./routes/api/classification.route')(app);
        require('./routes/api/type.route')(app);
        require('./routes/api/employee.route')(app);
        require('./routes/api/position.route')(app);
        require('./routes/api/product.route')(app);
        require('./routes/api/shop.route')(app);
        require('./routes/api/role.route')(app);
        
        // Search routes
        require('./routes/api/search.route')(app);
        
        // Auth user routes
        require('./routes/api/user.route')(app);

        // Pages routes
        require('./routes/pages/home.route')(app);
        require('./routes/pages/auth.route')(app);

        // Swagger configuration
        const initSwagger = require('./docs/swagger');
        initSwagger(app);

    }
})();