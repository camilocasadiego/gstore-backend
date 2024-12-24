import { Op } from "sequelize";
import generarJWT from "../helpers/generarJWT.js";
import Usuario from "../models/Usuario.js"

const autenticar = async (req, res) => {
    // Recibir los datos
    const {correo, password} = req.body

    // Buscar el usuario por su correo en la base de datos
    const usuario = await Usuario.findOne({where: {correo}});

    // Verificar si el usuario rellenó los campos (trim() elimina los espacios en blanco)
    if(correo?.trim() && password?.trim()){
        // Verificar si el usuario se encuentra registrado
        if(usuario){
            const { id, usuario: nombreUsuario, correo, confirmado } = usuario; // Cambia "usuario" a "nombreUsuario"
            if(confirmado){
                // Revisar si el correo y la contraseña son correctos
                if(await usuario.comprobarPassword(password)){
                    // TODO: Enviar correo de confirmación
                    // TODO: Autenticar
                    res.json({
                        id,
                        nombreUsuario,
                        correo,
                        token: generarJWT(id)
                    });
                }else{
                    res.json({msg: "Credenciales inválidas. Por favor, verifica tu correo y contraseña."});
                }
            }else{
                res.json({msg: "Tu cuenta no se encuentra confirmada"});
            }
        }
    }else{
        res.json({msg: "Debes ingresar tus datos"});
    }
}

// const crearCuenta = async (req, res) => {

//     // Recibimos los datos del usuario
//     const {usuario, correo, password, confirmarPassword} = req.body;
//     let alertas = [];

//     // Revisamos que los campos no esten vacios
//     if(!usuario?.trim() && !correo?.trim() && !password?.trim() && !confirmarPassword?.trim()){
//         alertas.push({
//             msg: "Debes rellenar todos los campos",
//             error: true
//         })
//     }else{
//         if(password === confirmarPassword){
//             try {
//                 // Buscamos el usuario por el correo y usuario
//                 const usuarios = await Usuario.findOne({
//                 where: {
//                     [Op.or]: [
//                         { usuario},
//                         { correo }
//                     ]
//                 }
//                 }); 
    
//                 if(usuarios){
//                     if(usuarios.correo === correo){
//                         alertas.push({
//                             msg: "Este correo ya se encuentra asociado a una cuenta",
//                             error: true
//                         })
//                     }
//                     if(usuarios.usuario === usuario){
//                         alertas.push({
//                             msg: "Este nombre de usuario ya se encuentra en uso",
//                             error: true
//                         })
//                     }
//                 }
//             } catch (error) {
//                 console.log(error)
//             }
//         }else{
//             alertas.push({
//                 msg: "Ambas contraseñas deben ser iguales",
//                 error: true
//             })
//         }
        
//         if(password.length < 8){
//             alertas.push({
//                 msg: "La contraseña debe tener mínimo 8 caracteres",
//                 error: true
//             })
//         }
//     }

//     if(!alertas){
//         const usuarioNuevo = new Usuario(req.body);
//         await usuarioNuevo.save();
//         res.json({
//             msg: "Usuario creado correctamente", 
//             usuarios: usuarioNuevo
//         });
//     }else{
//         res.json(alertas)
//     }   
// }   

const crearCuenta = async (req, res) => {
    // req.body contiene los datos que enviemos (de la petición POST)
    const {usuario,correo} = req.body

    const existeUsuario = await Usuario.findOne({
        where: {
            [Op.or]: [
                { usuario},
                { correo }
            ]
        }
    });
    
    if(existeUsuario === null){
        // Guardar nuevo usuario
        try {
            const usuarioNuevo = new Usuario(req.body);
            await usuarioNuevo.save();
            res.json({
                msg: "Usuario creado correctamente", 
                usuarios: usuarioNuevo
            });
        } catch (error) {
            console.log(error)
        }
    }else {
        const error = new Error("¡Ups! Ya hay un usuario registrado con este nombre o correo");
        res.status(400).json({msg: error.message});
    }
}

const perfil = (req, res) => {
    const { usuario } = req;

    res.json(usuario);
}



export {
    autenticar,
    crearCuenta,
    perfil,
}