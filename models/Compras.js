import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Compras = db.define('Compras', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: DataTypes.INTEGER,
    id_juego: DataTypes.INTEGER
  }, {
    tableName: 'compras'
  });

export default Compras