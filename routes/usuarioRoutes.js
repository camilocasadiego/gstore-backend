import express from "express";
import { autenticar, crearCuenta, perfil } from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

// Login
router.post('/login', autenticar);

// Crear Cuenta
router.post('/crear-cuenta', crearCuenta);

// Recuperar cuenta


// Cambiar Contraseña


// Confirmar Cuenta


// Perfil
router.get('/perfil', checkAuth, perfil);



export default router;