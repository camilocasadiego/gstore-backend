import { DataTypes, Sequelize } from "sequelize";
import db from "../config/db.js";
import generarToken from "../helpers/generarToken.js";
import bcrypt from 'bcrypt';

const Usuario = db.define('usuarios', {
    id: {
        type: DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true, 
    },
    usuario: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        defaultValue: generarToken()
    },
    confirmado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    Sequelize, // Tu instancia de Sequelize
    modelName: 'Usuario',
    hooks: {
        // Hook antes de crear un nuevo registro
        beforeCreate: async (usuario) => {
            console.log("CREANDO!")
            if (usuario.password) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        },
        // Hook antes de actualizar un registro existente
        beforeUpdate: async (usuario) => {
            if (usuario.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        },
    },
});

Usuario.prototype.comprobarPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default Usuario;