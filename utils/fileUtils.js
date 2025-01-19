import multer from "multer";
import sharp from "sharp";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Función para guardar imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()
        cb(null, `${Date.now()}.${ext}`);
    }
});
export const helperImg = (filePath, fileName, size = {width: 64, height: 80}) => {
    console.log(filePath)
    console.log(fileName)
    
    return sharp(filePath)
            .resize(size)
            .toFile(`./public/optimize/${fileName}`)
}

export const upload = multer ({storage});
