const multer = require("multer")
const path = require("path")

//destino para armazenar imagens
const imageStrore = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = ""

        if(req.baseUrl.includes("users")) {
            folder = "users"
        } else if(req.baseUrl.includes("photos")) {
            folder = "photos"
        }

        cb(null, `uploads/${folder}/`)
    },
    filename: (req, file, cb) => {

        cb(null, Date.now() + path.extname(file.originalname))

    }
})

const imageUpload = multer({
    storage: imageStrore,
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg)$/)) {

            //uploads somente com arquivos png e jpg
            return cb(new Error("Por Favor, envie apenas png ou jpg!"))

        }
        cb(undefined, true)
    }
})

module.exports = { imageUpload }