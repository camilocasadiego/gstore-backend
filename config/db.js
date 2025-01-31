import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
});

// Sincroniza todos los modelos definidos con la base de datos
db.sync({ force: false })  // force: false significa que no eliminará las tablas existentes
  .then(() => {
    console.log("Tablas sincronizadas correctamente.");
  })
  .catch((error) => {
    console.error("Error al sincronizar las tablas:", error);
  });

export default db;