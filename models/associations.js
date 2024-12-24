import Usuario from './Usuario.js';
import Carrito from './Carrito.js';
import Juego from './Juego.js';
import ListaDeseos from './ListaDeseos.js';
import Compras from './Compras.js';
import Genero from './Genero.js';

const setupAssociations = () => {
  Usuario.hasMany(Carrito, { foreignKey: 'id_usuario' });
  Carrito.belongsTo(Usuario, { foreignKey: 'id_usuario' });

  Juego.hasMany(Carrito, { foreignKey: 'id_juego' });
  Carrito.belongsTo(Juego, { foreignKey: 'id_juego' });

  Usuario.hasMany(ListaDeseos, { foreignKey: 'id_usuario' });
  ListaDeseos.belongsTo(Usuario, { foreignKey: 'id_usuario' });

  Juego.hasMany(ListaDeseos, { foreignKey: 'id_juego' });
  ListaDeseos.belongsTo(Juego, { foreignKey: 'id_juego' });

  Usuario.hasMany(Compras, { foreignKey: 'id_usuario' });
  Compras.belongsTo(Usuario, { foreignKey: 'id_usuario' });

  Juego.hasMany(Compras, { foreignKey: 'id_juego' });
  Compras.belongsTo(Juego, { foreignKey: 'id_juego' });
 
  Genero.hasMany(Juego, { foreignKey: 'id_genero'});
  Juego.belongsTo(Genero, { foreignKey: 'id_genero'});

  Juego.belongsTo(Usuario, { foreignKey: 'id_desarrollador' });
  // Usuario.belongsTo(Juego, { foreignKey: 'id_desarrollador' });
};

export default setupAssociations;