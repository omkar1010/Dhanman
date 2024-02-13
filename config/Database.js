import {Sequelize} from "sequelize";

const db = new Sequelize('dhanman', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;