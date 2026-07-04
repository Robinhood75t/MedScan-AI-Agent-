// require pdfkit module
const PDFDocument = require('pdfkit'); // pdfDocument is readable node stream
const fs = require('fs');

const doc = new PDFDocument(); // create a new PDF document

doc.pipe(fs.createWriteStream('output.pdf')); // pipe the pdf document to write to a file named 'output.pdf'

doc.fontSize(25).text('hello world!', 100,100); // add text to the pdf document

doc.end(); // finalize the pdf document