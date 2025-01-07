import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import { agregarJuego, obtenerJuego, obtenerJuegos } from "../controllers/desarrolladorController.js";
import multer from "multer";

const router = express.Router();

// Multer para imagenes
// TODO: agregar esto en una función
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()
        cb(null, `${Date.now()}.${ext}`);
    }
});

const upload = multer ({storage: storage});

// Desarrollador
router.get('/juegos', checkAuth, obtenerJuegos);
router.get('/juegos/:id', checkAuth, obtenerJuego);

// router.get('/imagenes/:imagen', obtenerImagen);
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('/imagenes/:imagen', (req, res) => {
    const nombre = req.params.imagen;
    const ruta = path.join(__dirname, '../public/uploads', nombre);
    console.log("Ruta:", ruta);
    // Verifica si el archivo existe
    res.sendFile(ruta, (err) => {
        if (err) {
            res.status(404).send('Imagen no encontrada');
        }
    });
});


router.post('/agregar-juego', checkAuth, upload.single('imagen'), agregarJuego);


export default router;