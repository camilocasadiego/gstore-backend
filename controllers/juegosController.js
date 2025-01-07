import { Op } from "sequelize";
import Genero from "../models/Genero.js";
import Juego from "../models/Juego.js"
import Usuario from "../models/Usuario.js";

const mostrarJuegos = async (req, res) => {
    let {limit} = req.query;
    limit = parseInt(limit);
    
    let {page} = req.query;
    page = parseInt(page);
    
    const offset = page * limit
    try {
        const juegos = await Juego.findAndCountAll({
            limit,
            attributes: ['id', 'nombre', 'precio', 'imagen'],
            include: [{
                model: Genero,
                attributes: ['genero'],
                required: false // Esto hace que sea un LEFT JOIN
            }],
            offset
        });
        res.json(juegos);
    }catch(error){
        console.log(error);
    }
}

const obtenerGeneros = async (req, res) => {

    try {
        const generos = await Genero.findAll({
            attributes: ['id', 'genero'],
            raw: true
        })

        // Transforma los datos en el formato deseado
        const generosObj = generos.reduce((obj, genero) => {
            obj[genero.id] = genero.genero;
            return obj;
        }, {});
  
        res.json(generosObj);       
    } catch (error) {
        console.log(error);
    }
}

const editarJuego = async (req, res) => {
    const {id} = req.params;
    const id_desarrollador = req.usuario.id;

    const juego = await Juego.findOne({
        where: {
            id_desarrollador,
            id
        }
    });

    if(juego){
        // if(juego.veterinario._id.toString() === req.veterinario._id.toString()){
        juego.nombre = req.body.nombre || juego.nombre;
        juego.descripcion = req.body.descripcion || juego.descripcion;
        juego.genero = req.body.genero || juego.genero;
        juego.desarrollador = req.body.desarrollador || juego.desarrollador;
        juego.lanzamiento = req.body.lanzamiento || juego.lanzamiento;
        juego.precio = req.body.precio || juego.precio;

        try {
            const juegoActualizado = await juego.save();
            res.json({
                msg: "Se actualizó el juego correctamente",
                juegoActualizado
            });
        } catch (error) {
            console.log(error)
        }
    }else{
        res.json({msg: "No se encontró el juego"})
    }

}

const eliminarJuego = async (req, res) => {
    const {id} = req.params;
    const id_desarrollador = req.usuario.id;

    const juego = await Juego.findOne({
        where: {
            id_desarrollador,
            id
        }
    });

    if(juego){
        try {
            await juego.destroy();
            res.json({eliminado: true});
        } catch (error) {
            console.log(error);
        }
    }else{
        res.json({msg: "Juego no encontrado"});
    }
}

const buscarJuego = async (req, res) => {
    
    const {nombre} = req.params;

    const limit = 5;

    const juegos = await Juego.findAll({
        where: {
          nombre: {
            [Op.like]: `${nombre}%`
          }
        },
        limit: limit
    });

    res.json(juegos);
}

// Buscar un juego por nombre
const consultarJuego = async (req, res) => {
    const {nombre} = req.params
    
    try {
        const juego = await Juego.findOne({
            where: {
                nombre
            }
        });

        res.json(juego);
    } catch (error) {
        console.log(error)
    }
}

const infoJuego = async(req, res) => {
    const {id} = req.params;

    try {
        const juego = await Juego.findOne({
            attributes: [
                'id',
                'nombre',
                'descripcion',
                'lanzamiento',
                'precio',
                'imagen'
              ],
              include: [
                {
                  model: Genero,
                  attributes: ['genero'],
                  required: true
                },
                {
                  model: Usuario,
                  attributes: [['usuario', 'desarrollador']],
                  required: true
                }
              ],
              where: { id }
        });
        
        res.json(juego);
    } catch (error) {
        console.log(error);
    }
}

const verMasJuegos = async (req, res) => {

    const {genero} = req.params;
    
    let {limit} = req.query;
    limit = parseInt(limit);
    
    let {page} = req.query;
    page = parseInt(page);
        
    const offset = page * limit
    try {
        const juegos = await Juego.findAndCountAll({
            attributes: ['id', 'nombre', 'precio', 'imagen'],
            include: [{
                model: Genero,
                attributes: [],
                where: {
                    genero
                }
            }],
            // raw: true,
            limit,
            offset,
            nest: true
        });
        
        if(juegos.rows.length !== 0){
            res.json(juegos);
        }else{
            res.json({msg: "Juegos no encontrados"});
        }
    } catch (error) {
        console.log(error);
    }   
}

const filtrarJuegos = async (req, res) => {
    
    const LIMIT = 10;
        
    const {genero} = req.params;

    try {
        const juegos = await Juego.findAndCountAll({
            attributes: ['id', 'nombre', 'precio', 'imagen'],
            include: [{
                model: Genero,
                attributes: [],
                where: {
                    genero
                }
            }],
            // raw: true,
            limit: LIMIT,
            nest: true
        });
        
        if(juegos.rows.length !== 0){
            console.log("Juegos", juegos)
            res.json(
                juegos.rows
            );
        }else{
            res.json({msg: "Juegos no encontrados"});
        }
    } catch (error) {
        console.log(error);
    }
}

export {
    mostrarJuegos,
    obtenerGeneros,
    editarJuego,
    eliminarJuego,
    buscarJuego,
    infoJuego,
    verMasJuegos,
    filtrarJuegos,
    consultarJuego
}
