import multer from 'multer';
import path from 'path';

// Set up storage
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('materialFile'); // 'materialFile' is the name of the form field

// Check File Type
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|ppt|pptx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Error: Files of this type are not allowed!');
    }
}

export default upload;