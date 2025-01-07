import Juego from "../models/Juego.js";

const obtenerImagen = async (req, res) => {
    console.log("Obteniendo Imagen");
}

const obtenerJuegos = async (req, res) => {
    const id_desarrollador = req.usuario.id;

    try {
        const juegos = await Juego.findAll({
            where: {
              id_desarrollador,
            }
          })

        res.json(juegos);
    } catch (error) {
        console.log(error)
    }
}

const obtenerJuego = async (req, res) => {
    const {id} = req.params
    const id_desarrollador = req.usuario.id;
    
    try {
        const juego = await Juego.findOne({       
            where: {
                id,
                id_desarrollador,
              },
        });

        res.json(juego);
    } catch (error) {
        console.log(error)
    }
}

const agregarJuego = async (req, res) => {
    // TODO: agregar campo para la imagen en la bd
    // TODO: verificar que se haya recibido una imagen
    const imagen = req.file !== undefined ? req.file.filename : '';
    const {nombre, descripcion, lanzamiento, precio} = req.body;

    // Verificar que los datos recibidos no esten vacíos
    if(nombre?.trim() && descripcion?.trim() && lanzamiento?.trim() && imagen){
        console.log("good")
        if(precio >= 0){
            const existeJuego = await Juego.findOne({where: {nombre}});
            if(!existeJuego){  
                const juego = new Juego (req.body);
                try{
                    // Se agrega el desarrolador
                    juego.dataValues.desarrollador = req.usuario.id;
                    juego.dataValues.imagen = imagen;
                    await juego.save();
                    res.send(true);
                }catch (error){
                    console.log(error);
                }
            }else{
                res.send("Ya existe un juego con este nombre");
            }
        }else{
            res.send("El valor del precio es incorrecto");
        }
    }else{
        res.send("Debes rellenar todos los campos");
    }
}

export {
    obtenerJuegos,
    obtenerJuego,
    agregarJuego,
    obtenerImagen
}