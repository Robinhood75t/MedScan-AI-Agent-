const multer = require("multer");
// upload middleware

const upload = multer({
    dest: "uploads/",
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        const allowed = ["application/pdf","image/jpeg","image/png","image/jpg", "image/webp"];
        if(allowed.includes(file.mimetype)){
            cd(null, true);
        }else{
            cb(new Error("file type not allowed"));
        }
    }
})

module.exports = upload;