import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import { agregarJuego, obtenerJuego, obtenerJuegos, ocultarJuego } from "../controllers/desarrolladorController.js";
import { upload } from "../utils/fileUtils.js";

const router = express.Router();

// Desarrollador
router.get('/juegos', checkAuth, obtenerJuegos);
router.get('/juegos/:id', checkAuth, obtenerJuego);
router.post('/agregar-juego', checkAuth, upload.single('imagen'), agregarJuego);
router.post('/ocultar-juego/:id', checkAuth, ocultarJuego);

export default router;