const extractedTextFromFile = require("../services/extractService").extractedTextFromFile;
const getSummary = require("../services/aiService");

const summarize = async (req , res) => {
    try{
        if(!req.file){
            return res.status(400).json({ error: "file is required"});
        }

        const filePath = req.file.path;
        const mimetype = req.file.mimetype;

        if(!filePath || !mimetype){
            return res.status(400).json({ error: "file path and mimetype are required"});
        }

        const extractedText = await extractedTextFromFile(filePath, mimetype);

        if(!extractedText){
            return res.status(400).json({ error: "could not extract text from the file"});
        }

        const summary = await getSummary(extractedText);


        let parsedSummary;
        try{
            parsedSummary = JSON.parse(summary);
        }catch{
            parsedSummary = { summary: summary };
        }
        res.json({ summary: parsedSummary });
    }catch(err){
        return res.status(500).json({ error: err.message });
    }
}

module.exports = summarize;