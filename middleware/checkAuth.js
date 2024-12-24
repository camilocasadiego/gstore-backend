import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const checkAuth = async (req, res, next) => {
    const bearerToken = req.headers.authorization;
    let token;
    if(bearerToken && bearerToken.startsWith('Bearer')){
        try {
            token = bearerToken.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Usando findByPk de Sequelize
            const usuario = await Usuario.findByPk(decoded.id, {
                attributes: { exclude: ['password', 'token', 'confirmado'] }
            });

            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
            
            req.usuario = usuario;
            return next();

        } catch (error) {
            console.log(error);
            const e = new Error("Token no válido");
            return res.status(403).json({msg: e.message});
        }
    }

    const error = new Error("Token no válido o inexistente");
    return res.status(403).json({msg: error.message});
};

export default checkAuth;