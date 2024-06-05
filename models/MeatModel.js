import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Meat = db.define('meat', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
}, {
    freezeTableName: true
})

export default Meat;

// (async()=>{
//     await db.sync()
// })()