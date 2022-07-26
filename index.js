'use strict'
const app = require('./configs/app');
const mongo = require('./configs/mongoConfig');
const port = process.env.PORT || 3200;

const { findUser, encrypt, findCategory, findDepartment } = require('./src/utils/validate');
const User = require('./src/models/user.model');
const Category = require('./src/models/category.model')
const Department = require('./src/models/department.model')

mongo.init();
app.listen(port, async () => {
    console.log(`Conectado al puerto ${port}`)

    let dataUser = {
        name: 'ADMIN',
        surname: 'ADMIN',
        username: 'ADMIN',
        email: 'ADMIN',
        phone: 'ADMIN',
        password: await encrypt('admin123'),
        role: 'ADMIN'
    };
    let checkUser = await findUser(dataUser.username);
    if (!checkUser) {
        let user = new User(dataUser);
        await user.save();
        console.log('Usuario ADMIN registrado')
    }

    let dataCategory = {
        name: 'DEFAULT',
        description: 'DEFAULT'
    };
    let checkCategory = await findCategory(dataCategory.name);
    if (!checkCategory) {
        let category = new Category(dataCategory);
        await category.save();
        console.log('Categoría DEFAULT creada')
    }

    let dataDepartment = {
        name: 'DEFAULT',
        description: 'DEFAULT'
    };
    let checkDepartment = await findDepartment(dataDepartment.name);
    if (!checkDepartment) {
        let department = new Department(dataDepartment);
        await department.save();
        console.log('Departamento DEFAULT creado')
    }
});