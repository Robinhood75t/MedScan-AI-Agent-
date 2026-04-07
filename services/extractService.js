const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const fs = require("fs/promises");

const extractedTextFromFile = async(filePath, mimetype) => {

    // text from PDF
    if(mimetype === "application/pdf"){
        const dataBuffer = await fs.readFile(filePath);
        const pdfData = await pdfParse(dataBuffer);
        return pdfData.text;
    }

    // text from image
    if(mimetype.startsWith("image/")){
        const result = await Tesseract.recognize(filePath, "eng");
        return result.data.text;
    }

}

module.exports = {
    extractedTextFromFile
};