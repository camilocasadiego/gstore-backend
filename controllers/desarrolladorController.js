import Juego from "../models/Juego.js";
import { helperImg } from "../utils/fileUtils.js";
// import path, { dirname } from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

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
    const imagen = req.file !== undefined ? req.file.filename : '';
    helperImg(req.file.path, `resize-${req.file.filename}`, 100);
    const {nombre, descripcion, lanzamiento, precio} = req.body;

    // Verificar que los datos recibidos no esten vacíos
    if(nombre?.trim() && descripcion?.trim() && lanzamiento?.trim() && imagen){
        if(precio >= 0){
            const existeJuego = await Juego.findOne({where: {nombre}});
            if(!existeJuego){  
                const juego = new Juego (req.body);
                try{
                    // Se agrega el desarrolador
                    juego.dataValues.desarrollador = req.usuario.id;
                    juego.dataValues.imagen = imagen;
                    juego.dataValues.oculto = 0;

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

const ocultarJuego = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    const juego = await Juego.findOne({where: {id}});

    if(juego){
        try {
            juego.oculto = !juego.oculto;
            const juegoActualizado = await juego.save();
            res.json(juegoActualizado);
        } catch (error) {
            console.log(error);
        }
    }
    
}

export {
    obtenerJuegos,
    obtenerJuego,
    agregarJuego,
    ocultarJuego
}