// ✅ No import needed — native fetch works in Node 18+
const getSummary = async (text) => {
    try {
        const truncatedText = text.length > 10000 ? text.slice(0, 10000) : text;

        const prompt = `Summarize the following medical document in simple, easy to understand words. 
Explain any medical terms plainly. Here is the document: ${truncatedText}`;

        const response = await fetch(
            `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: "You are a medical assistant that explains medical reports in simple, clear language that a non-medical person can understand. Avoid jargon. If you use a medical term, explain it immediately.",
                                },
                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        if (!response.ok) {
            const errBody = await response.json();
            throw new Error(`Gemini API error: ${JSON.stringify(errBody)}`);
        }

        const data = await response.json();

        // ✅ Correct Gemini response structure
        return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    } catch (err) {
        console.error(`getSummary error: ${err.message}`);
        throw err;
    }
};

module.exports = getSummary;