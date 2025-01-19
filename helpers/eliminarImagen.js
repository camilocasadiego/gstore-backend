import fs from 'fs';

// Elimina la imagen almacenada cuando se edita un juego
export const eliminarImagen = (imagen) => {
    
    // Rutas de las imagenes
    const rutaUploads = `./public/uploads/${imagen}`;
    const rutaOptimize = `./public/optimize/resize-${imagen}`;
    
    // Elimina la imagen de la carpeta uploads
    fs.unlink(rutaUploads, (err) => {
        if (err) {
            console.error(`Error al eliminar el archivo: ${err.message}`);
            return;
        }
        console.log('Archivo eliminado exitosamente');
    });

    // Elimina la imagen de la carpeta optimize
    fs.unlink(rutaOptimize, (err) => {
        if (err) {
            console.error(`Error al eliminar el archivo: ${err.message}`);
            return;
        }
        console.log('Archivo eliminado exitosamente');
    });

    
}