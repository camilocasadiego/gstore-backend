import { Op } from "sequelize";
import Carrito from "../models/Carrito.js";
import Compras from "../models/Compras.js";
import Juego from "../models/Juego.js";

const mostrarCompras = async (req, res) => {
    try {
        const idUsuario = req.usuario.id;
        const compras = await Juego.findAll({
          attributes: ['id', 'nombre', 'precio', 'imagen'],
          include: [{
            model: Compras,
            where: { id_usuario: idUsuario },
            attributes: []
            }]
        });
    
        res.json(compras);
      } catch (error) {
        console.error('Error al obtener los juegos comprados:', error);
        throw error;
    }

}

// Obtiene los juegos de la biblioteca que sean iguales a los del carrito de un usuario específico
const validarCarritoEnBiblioteca = async (idsCarrito, id_usuario) => {

    try {
        const juegosComprados = await Compras.findAll({
            attributes: ['id_juego'],
            where: {
                id_usuario,
                id_juego: {
                    [Op.in]: idsCarrito
                }
            }
        });
  
    return juegosComprados;

    } catch (error) {
      console.error('Error al obtener los juegos comprados:', error);
      throw error;
    }
};

// TODO: No requiere validar que el juego exista en la bd ya que esto lo hace sql, ¿es necesario validarlo desde el servidor?
// const agregarCompras = async (req, res) => {
    
//     // Obtenemos el id del usuario
//     const idUsuario = req.usuario.id

//     // Obtenemos el id del juego que vamos a agregar a la lista de deseos
//     const idJuego = req.body.id_juego;

//     // Obtenemos los juegos de la lista de deseos
//     const compras = await obtenerCompras(idUsuario, idJuego);

//     // Verificamos que el juego no se encuentre agregado a la lista de deseos
//     if(!compras.length){
//         // Creamos el objeto con el juego elegido
//         const juegoComprado = new Compras (req.body);
//         // Agregamos el id del usuario al objeto de la lista de deseos
//         juegoComprado.dataValues.id_usuario = idUsuario;

//         // Almacenamos el juego en la bd
//         try {
//             await juegoComprado.save();
//             res.json("Juego Agregado a las compras");
//         } catch (error) {
//             res.send("No se pudo agregar el juego a las compras")
//         }
//     }else{
//         res.send({msg: "El juego ya se encuentra comprado"})
//     }
// }

const agregarCompras = async (req, res) => {

    const juegosCarrito = req.body;
    const id_usuario = req.usuario.id;

    // Se crea un arreglo con los juegos que se van a eliminar del carrito
    const idsCarrito = juegosCarrito.map(juego => juego.id);

    // Verifica si los juegos del carrito se encuentran en la biblioteca
    const juegosComprados = await validarCarritoEnBiblioteca(idsCarrito, id_usuario);
    
    if(juegosComprados.length === 0){

        // TODO: Bloquear el botón de "agregar el carrito si el juego ya se encuentra comprado (Frontend)"

        const compra = juegosCarrito.map(juego => ({id_usuario, id_juego: juego.id}));
        try {
            // Se agregan los juegos a la base de datos
            await Compras.bulkCreate(compra);
            // Se eliminan los juegos del carrito
            await Carrito.destroy({ where: {id_juego: idsCarrito}})
            res.json({
                success: true,
                msg: 'Juegos comprados correctamente',
            });
        } catch (error) {
            // TODO: Mejorar error
            res.json({
                success: false,
                msg: error
            });
        }
    }else{
        res.json({
            success: false,
            msg: "No fue posible realizar la compra!"
        });
    }
}

const eliminarCompras = async (req, res) => {
    const {id} = req.params;
    const idUsuario = req.usuario.id;

    const juego = await Compras.findOne({
        attributes: ['id'],
        where: {
          id_usuario: idUsuario,
          id_juego: id
        }
    });

    if(juego){
        try {
            await juego.destroy();
            res.send("Juego eliminado correctamente");
        } catch (error) {
            console.log(error);
        }
    }else{
        res.json({msg: "El juego no se encuentra en la lista de compra"});
    }
}

export {
    mostrarCompras,
    validarCarritoEnBiblioteca,
    agregarCompras,
    eliminarCompras
}