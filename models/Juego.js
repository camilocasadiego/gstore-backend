import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Juego = db.define('juegos', {
    id: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT
    },
    id_genero: {
      type: DataTypes.STRING(50)
    },
    id_desarrollador: {
      type: DataTypes.TINYINT(1)
    },
    lanzamiento: {
      type: DataTypes.DATE
    },
    precio: {
      type: DataTypes.DECIMAL(20, 6)
    }
});

export default Juego