import express from "express";
import { buscarJuego, consultarJuego, editarJuego, eliminarJuego, filtrarJuegos, infoJuego, mostrarJuegos, obtenerGeneros, verMasJuegos } from "../controllers/juegosController.js";
import checkAuth from "../middleware/checkAuth.js";
import { agregarCarrito, compraCarrito, eliminarCarrito, mostrarCarrito } from "../controllers/carritoController.js";
import { agregarListaDeseos, eliminarListaDeseos, mostrarListaDeseos } from "../controllers/listaDeseosController.js";
import { agregarCompras, eliminarCompras, mostrarCompras } from "../controllers/comprasController.js";
import { upload } from "../utils/fileUtils.js";

const router = express.Router();

// Juegos
router.get('/ultimos-juegos', mostrarJuegos);
// TODO: Cambiar este endpoint a "desarrollador" y modificarlo para recibir imágenes
router.put('/editar-juego/:id', checkAuth, upload.single('imagen'), editarJuego);
router.delete('/eliminar-juego/:id', checkAuth, eliminarJuego);
router.get('/buscar/:nombre', buscarJuego);
router.get('/consultar/:nombre', consultarJuego);
router.get('/juego/:id', infoJuego);
router.get('/generos', obtenerGeneros);
// TODO: Revisar cual sería el mejor nombre para esto
router.get('/generos/:genero', verMasJuegos)

router.get('/genero/:genero', filtrarJuegos);

// Carrito
router.get('/carrito', checkAuth, mostrarCarrito);
router.post('/carrito', checkAuth, agregarCarrito);
router.delete('/carrito/:id', checkAuth, eliminarCarrito);

// Lista de Deseos
router.get('/lista-deseos', checkAuth, mostrarListaDeseos);
router.post('/lista-deseos', checkAuth, agregarListaDeseos);
router.delete('/lista-deseos/:id', checkAuth, eliminarListaDeseos);

// Compras
router.get('/compras', checkAuth, mostrarCompras);
router.post('/compras', checkAuth, agregarCompras);
router.delete('/compras/:id', checkAuth, eliminarCompras);

export default router;