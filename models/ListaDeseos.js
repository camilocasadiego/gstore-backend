import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ListaDeseos = db.define('ListaDeseos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: DataTypes.INTEGER,
    id_juego: DataTypes.INTEGER
  }, {
    tableName: 'lista_deseos'
  });

export default ListaDeseos