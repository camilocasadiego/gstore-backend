import { Op, where } from "sequelize";
import generarJWT from "../helpers/generarJWT.js";
import Usuario from "../models/Usuario.js"
import emailRegistro from "../helpers/emailRegistro.js";
import generarToken from "../helpers/generarToken.js";
import emailRecuperarCuenta from "../helpers/emailRecuperarCuenta.js";

const autenticar = async (req, res) => {
    // Recibir los datos
    const {correo, password} = req.body

    // Verificar si el usuario rellenó los campos (trim() elimina los espacios en blanco)
    if(correo?.trim() === '' && password?.trim() === ''){
        // Enviar alerta al usuario (error.status...)
        res.json({msg: "Debes rellenar todos los campos"});
        return;
    }

    // Buscar el usuario por su correo en la base de datos
    const user = await Usuario.findOne({
        where:{ correo }
    });
    
    // Verificar si el usuario se encuentra registrado
    if(!user){
        res.json({msg: "No se encontró ningún usuario asociado a esta cuenta"});    
        return;
    }
    
    if(!user.confirmado){
        res.json({msg: "La cuenta aun no se encuentra confirmada"});  
        return;  
    }
            
    // Revisar si el correo y la contraseña son correctos
    if(await user.comprobarPassword(password)){
        const { id, usuario, correo } = user;
        res.json({
            id,
            usuario,
            correo,
            token: generarJWT(id)
        });
    }else{
        res.json({msg: "Credenciales inválidas. Por favor, verifica tu correo y contraseña."});
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
        
            // await usuarioNuevo.save();

            emailRegistro({
                correo,
                usuario,
                token: usuarioNuevo.token
            });

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

const confirmar = async (req, res) => {
    const token = req.params.token;
    console.log("Token:", token);

    const usuario = await Usuario.findOne({
        where: {token}
    });

    if(usuario){
        if(!usuario.confirmado){
            try {
                await Usuario.update(
                    { confirmado: true, token: null }, // Datos que deseas actualizar
                    { where: { token } } // Condición para encontrar el registro
                );
                res.json(true);
            } catch (error) {
                console.log(error);
            }
        }
    }else{
        const error = new Error('Token no válido');
        res.status(400).json({msg: error.message});
    }

}

const cambiarPassword = async(req, res) => {
    
    const {correo, currentPassword, newPassword, confirmPassword} = req.body;

    // Validar longitud de la contraseña
    if(newPassword < 8 || confirmPassword < 8){
        res.json({
            success: false,
            msg: "La contraseña debe tener mínimo 8 caracteres"
        });
    
        return;
    }
    
    // Validar que las contraseñas sean iguales
    if(newPassword !== confirmPassword) {
        res.json({
            success: false,
            msg: "La confirmación de la contraseña no coincide con la nueva contraseña."
        });
        
        return;
    }
    
    const usuario = await Usuario.findOne({where: {correo}});

    // Validar la contraseña actual
    if(await usuario.comprobarPassword(currentPassword)){
        console.log(usuario.password);
        // Cambiar contraseña
        try {
            usuario.password = newPassword;
            console.log(usuario)
            await usuario.save();
            res.json({
                success: true,
                msg: "Contraseña actualizada"
            })
        } catch (error) {
            console.log(error);
        }
    }else{
        res.json({
            success: false,
            msg: "La contraseña actual no es correcta"
        });

        return;
    }    
}

const perfil = (req, res) => {
    const { usuario } = req;

    res.json(usuario);
}

// Busca si el usuario se encuentra en uso
const buscarUsuario = async (req, res) => {
    console.log("Buscando usuario");
    const {usuario} = req.params;
    console.log(usuario);

    try {
        const existeUsuario = await Usuario.findOne({
            where: {
                usuario
            }
        });

        res.json(existeUsuario);

    } catch (error) {
        console.log(error);
    }
}

// Busca si el usuario se encuentra en uso
const buscarCorreo = async (req, res) => {
    console.log("Buscando correo");
    const {correo} = req.params;
    console.log(correo);

    try {
        const existeCorreo = await Usuario.findOne({
            where: {
                correo
            }
        });

        res.json(existeCorreo);

    } catch (error) {
        console.log(error);
    }
}

// Guarda los cambios
const actualizarPerfil = async (req, res) => {
    const { id, usuario, correo } = req.body;
    
    try {
        const user = await Usuario.findOne({
            attributes: ['id', 'usuario', 'correo'],
            where: {
                id
            }
        });

        if(user){
            user.usuario = req.body.usuario || user.usuario;
            user.correo = req.body.correo || user.correo;

            try {
                const usuarioActualizado = await user.save();
                console.log(usuarioActualizado);
                res.json(usuarioActualizado);
            } catch (error) {
                console.log(error);
            }
        }

        console.log(user);
    } catch (error) {
        console.log(error);
    }
}

const recuperarCuenta = async (req, res) => {
    
    const {correo} = req.body;

    // Buscar usuario
    const user = await Usuario.findOne({where: {correo}});
    
    if(!user){
        console.log("Usuario no encontrado")
        res.json({
            sucess: false,
            msg: "El correo no se encuentra registrado"
        })

        return;
    }
    
    if(user) {
        if(!user.confirmado){
            res.json({
                success: false,
                msg: 'La cuenta aun no ha sido confirmada'
            })
            return;
        }

        // Generar token
        const token = generarToken();
        user.token = token;
        try {
            await user.save();
            // Enviar correo con el token
            emailRecuperarCuenta({
                correo,
                usuario: user.usuario,
                token
            });

            res.json({
                sucess: true,
                msg: 'Hemos enviado instrucciones a tu correo'
            })
        } catch (error) {
            console.log(error);
        }       
    }
}

const restablecerPassword = async (req, res) => {
    const {newPassword, confirmPassword} = req.body;
    const {token} = req.params;

       // Validar longitud de la contraseña
       // TODO: Esto puede ir en una función
       if(newPassword < 8 || confirmPassword < 8){
        res.json({
            success: false,
            msg: "La contraseña debe tener mínimo 8 caracteres"
        });
    
        return;
    }
    
    // Validar que las contraseñas sean iguales
    if(newPassword !== confirmPassword) {
        res.json({
            success: false,
            msg: "La confirmación de la contraseña no coincide con la nueva contraseña."
        });
        
        return;
    }

    // Obtener usuario
    const user = await Usuario.findOne({where: {token}});

    // Validar la contraseña actual
    if(user){
        // Cambiar contraseña
        try {
            user.password = newPassword;
            user.token = null;
            await user.save();
            res.json({
                success: true,
                msg: "Contraseña actualizada"
            })
        } catch (error) {
            console.log(error);
        }
    }else{
        res.json({
            success: false,
            msg: "Token incorrecto"
        });
    }
}

export {
    autenticar,
    crearCuenta,
    perfil,
    buscarUsuario,
    buscarCorreo,
    actualizarPerfil,
    recuperarCuenta,
    confirmar,
    cambiarPassword,
    restablecerPassword
}