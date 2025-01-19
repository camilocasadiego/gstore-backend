import express from "express"
import db from "./config/db.js";
import juegoRoutes from "./routes/juegoRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import desarrolladorRoutes from "./routes/desarrolladorRoutes.js";
import setupAssociations from "./models/associations.js";
import cors from 'cors';
import dotenv from 'dotenv';
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();

// Permite recibir datos de tipo JSON
app.use(express.json());

// Configuración del puerto del servidor
const PORT = process.env.PORT || 4000; 

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`)
});

dotenv.config();

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback) {
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            // El origen está permitido, o la solicitud es del mismo origen (origin es null)
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
};

// Enable cors
app.use(cors({
    origin: '*', // Permitir solicitudes desde tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

// Manejo del routing
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/juegos', juegoRoutes);
app.use('/api/desarrollador', desarrolladorRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Serve static files
const uploadsPath = path.join(__dirname, 'public/uploads');
const optimizePath = path.join(__dirname, 'public/optimize');
// console.log("Path:", uploadsPath);
app.use('/uploads', express.static(uploadsPath));
app.use('/optimize', express.static(optimizePath));

// Generar asociaciones
setupAssociations();

// // Conectar la base de datos
// const conectarDB = async () => {
//     try {
//         await db.authenticate();
//         console.log('Conexión a la base de datos EXITOSA!');
//     } catch (error) {
//         console.log(error);
//     }
// }

// conectarDB();
