var fs = require("fs");
const multer = require("multer");

const imagePathDir = "./public/images/tmp";
if (!fs.existsSync(imagePathDir)) {  
    fs.mkdirSync(imagePathDir, { recursive: true });
    }

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imagePathDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
    });
    
const upload = multer({ storage: fileStorageEngine });
module.exports = upload;