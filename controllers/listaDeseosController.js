import Juego from "../models/Juego.js";
import ListaDeseos from "../models/ListaDeseos.js";

const mostrarListaDeseos = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        const listaDeseosUsuario = await Juego.findAll({
            attributes: ['id', 'nombre', 'precio', 'imagen'], // Selecciona columnas de lista_deseos
            where: {oculto: 0},
            include: [
                {
                    model: ListaDeseos,
                    where: {
                        id_usuario, 
                    },
                    
                },
            ],
        })
    
        res.json(listaDeseosUsuario);
      } catch (error) {
        console.log(error)
        throw error;
    }

}

const obtenerListaDeseos = async (idUsuario, idJuego, res) => {
    try {
        const resultado = await ListaDeseos.findAll({
            where: {
                id_usuario: idUsuario,
                id_juego: idJuego
            }
        }); 
  
      return resultado;
    } catch (error) {
      console.error('Error al obtener la listas de deseos:', error);
      throw error;
    }
};

// TODO: No requiere validar que el juego exista en la bd ya que esto lo hace sql, ¿es necesario validarlo desde el servidor?
const agregarListaDeseos = async (req, res) => {
    console.log("Agregando a la lista de deseos")
    // Obtenemos el id del usuario
    const idUsuario = req.usuario.id

    // Obtenemos el id del juego que vamos a agregar a la lista de deseos
    const idJuego = req.body.id_juego;
    console.log(idJuego);

    // Obtenemos los juegos de la lista de deseos
    const listaDeseos = await obtenerListaDeseos(idUsuario, idJuego);

    // Verificamos que el juego no se encuentre agregado a la lista de deseos
    if(!listaDeseos.length){
        // Creamos el objeto con el juego elegido
        const juegosListaDeseos = new ListaDeseos (req.body);
        // Agregamos el id del usuario al objeto de la lista de deseos
        juegosListaDeseos.dataValues.id_usuario = idUsuario;

        // Almacenamos el juego en la bd
        try {
            const juego = await juegosListaDeseos.save();
            res.json({guardado: true});
        } catch (error) {
            res.send("No se pudo agregar el juego a la lista de deseos")
        }
    }else{
        res.send({guardado:false})
    }
}

const eliminarListaDeseos = async (req, res) => {
    console.log("Backend - Eliminando de la lista de deseos")
    const {id} = req.params;
    const idUsuario = req.usuario.id;

    const juego = await ListaDeseos.findOne({
        attributes: ['id'],
        where: {
          id_usuario: idUsuario,
          id_juego: id
        }
    });

    if(juego){
        try {
            await juego.destroy();
            res.json({guardado: false});
        } catch (error) {
            console.log(error);
        }
    }else{
        res.json({msg: "El juego no se encuentra en la lista de deseos"});
    }
}

export {
    mostrarListaDeseos,
    obtenerListaDeseos,
    agregarListaDeseos,
    eliminarListaDeseos
}