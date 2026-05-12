const fetch = require("node-fetch");

const getSummary = async (text) => {
    try{
        const truncatedText = text.length > 10000 ? text.slice(0,10000): text;
        const prompt = `Summarize the following medical document in simple, easy to understand words. 
Explain any medical terms plainly. Here is the document: ${truncatedText}`;

        const response = await fetch(`${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: "You are a medical assistant that explains medical reports in simple, clear language that a non-medical person can understand. Avoid jargon. If you use a medical term, explain it immediately.",
                            },{
                                text: prompt,
                            },
                        ],
                    },
                ],
            }),
        });

        if(!response.ok){
            throw new Error(`perplexity api error ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || "";
    }catch(err){
        console.error(`getSummary error: ${err.message}`);
        throw err;
    }

}

module.exports = getSummary;