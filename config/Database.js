import { Sequelize } from "sequelize";

const db = new Sequelize('meatopia_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

export default db;