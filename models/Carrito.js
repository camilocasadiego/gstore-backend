import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Carrito = db.define('Carrito', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: DataTypes.INTEGER,
    id_juego: DataTypes.INTEGER
  }, {
    tableName: 'carrito'
  });

export default Carrito