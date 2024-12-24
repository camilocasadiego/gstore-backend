import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Genero = db.define('generos', {
    id: {
        type: DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true
    },
    genero: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
});

export default Genero