const fetch = require("node-fetch");

const getSummary = async (text) => {
    try{
        const truncatedText = text.length > 10000 ? text.slice(0,10000): text;
        const prompt = `Summarize the following medical document in simple, easy to understand words. 
Explain any medical terms plainly. Here is the document: ${truncatedText}`;

        const response = await fetch(process.env.PERPLEXITY_API_URL, {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`
            },
            body: JSON.stringify({
                model: "sonar-pro",
                messages: [
                    { role: "system", content: "You are a medical assistant that explains medical reports in simple, clear language that a non-medical person can understand. Avoid jargon. If you use a medical term, explain it immediately." },
                    {role: "user" , content: prompt}
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