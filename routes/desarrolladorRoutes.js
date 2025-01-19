import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import { agregarJuego, obtenerJuego, obtenerJuegos } from "../controllers/desarrolladorController.js";
import { upload } from "../utils/fileUtils.js";

const router = express.Router();

// Desarrollador
router.get('/juegos', checkAuth, obtenerJuegos);
router.get('/juegos/:id', checkAuth, obtenerJuego);
router.post('/agregar-juego', checkAuth, upload.single('imagen'), agregarJuego);

export default router;