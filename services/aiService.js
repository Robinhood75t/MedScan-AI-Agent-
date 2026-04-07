const fetch = require("node-fetch");

const getSummary = async (text) => {
    const prompt = `summarize the followiing medical document in a consise manner : ${text}`;

    const response = await fetch(process.env.PERPLEXITY_API_URL, {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`
        },
        body: JSON.stringify({
            model: "sonar-pro",
            messages: [
                {role: "system" , content: "you are a helpful medical assistant."},
                {role: "user" , content: prompt}
            ],
        }),
    });

    if(!response.ok){
        throw new Error(`perplexity api error ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.messages?.content?.trim() || "";
}

module.exports = {
    getSummary
}