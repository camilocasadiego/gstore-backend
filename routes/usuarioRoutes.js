import express from "express";
import { actualizarPerfil, autenticar, buscarCorreo, buscarUsuario, cambiarPassword, confirmar, crearCuenta, perfil, recuperarCuenta, restablecerPassword } from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

// Login
router.post('/login', autenticar);

// Crear Cuenta
router.post('/crear-cuenta', crearCuenta);

// Recuperar cuenta
router.post('/recuperar-cuenta', recuperarCuenta)

// Cambiar Contraseña (admin)
router.post('/cambiar-password', cambiarPassword);

// Cambiar Contraseña (autenticación)
router.post('/restablecer-password/:token', restablecerPassword);

// Confirmar Cuenta
router.get('/confirmar/:token', confirmar);

// Perfil
router.get('/perfil', checkAuth, perfil);
router.get('/usuario/:usuario', buscarUsuario);
router.get('/correo/:correo', buscarCorreo);
router.put('/actualizar', checkAuth, actualizarPerfil);


export default router;