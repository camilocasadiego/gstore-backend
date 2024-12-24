import Carrito from "../models/Carrito.js";
import Juego from "../models/Juego.js";

const compraCarrito = (req, res) => {
    // Cuando se compran los juego del carrito
    res.send("Juego Comprado");
}

const mostrarCarrito = async (req, res) => {

    try {
        const idUsuario = req.usuario.id;
        const juegosEnCarrito = await Juego.findAll({
          attributes: ['id', 'nombre', 'precio'],
          include: [{
            model: Carrito,
            where: { id_usuario: idUsuario },
            attributes: [] // No incluimos atributos de Carrito en el resultado
            }]
        });
    
        res.json(juegosEnCarrito);
      } catch (error) {
        console.error('Error al obtener juegos del carrito:', error);
        throw error;
    }

}

const obtenerCarrito = async (idUsuario, idJuego) => {
    try {
        const resultado = await Carrito.findAll({
            where: {
                id_usuario: idUsuario,
                id_juego: idJuego
            }
        }); 
  
      return resultado;
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      throw error;
    }
};

// TODO: No requiere validar que el juego exista en la bd ya que esto lo hace sql, ¿es necesario validarlo desde el servidor?
const agregarCarrito = async (req, res) => {
    
    // Obtenemos el id del usuario
    const idUsuario = req.usuario.id

    // Obtenemos el id del juego que vamos a agregar al carrito
    const idJuego = req.body.id_juego;

    // Obtenemos los juegos del carrito
    const carrito = await obtenerCarrito(idUsuario, idJuego);

    // Verificamos que el juego no se encuentre agregado al carrito
    if(!carrito.length){
        // Creamos el objeto con el juego elegido
        const juegoCarrito = new Carrito (req.body);
        // Agregamos el id del usuario al objeto del Carrito
        juegoCarrito.dataValues.id_usuario = idUsuario;

        // Almacenamos el juego en la bd
        try {
            await juegoCarrito.save();
            res.json({guardado: true});
        } catch (error) {
            res.send("No se pudo agregar el juego al carrito")
        }
    }else{
        res.json({guardado: false});
    }
}

const eliminarCarrito = async (req, res) => {
    const {id} = req.params;
    const idUsuario = req.usuario.id;

    const juego = await Carrito.findOne({
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
    compraCarrito,
    mostrarCarrito,
    agregarCarrito,
    eliminarCarrito

}