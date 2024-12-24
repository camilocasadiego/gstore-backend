import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import { agregarJuego, obtenerJuego, obtenerJuegos } from "../controllers/desarrolladorController.js";

const router = express.Router();

// Desarrollador
router.get('/juegos', checkAuth, obtenerJuegos);
router.get('/juegos/:id', checkAuth, obtenerJuego);
router.route('/agregar-juego').post(checkAuth, agregarJuego);

export default router;