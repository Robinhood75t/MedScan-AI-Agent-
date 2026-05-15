// ✅ No import needed — native fetch works in Node 18+
const getSummary = async (text) => {
    try {
        const truncatedText = text.length > 10000 ? text.slice(0, 10000) : text;

        const prompt = `Analyze the following medical document and return a JSON response with this EXACT structure:
            {
                "overview": "2-3 sentence simple overview of the report for a non-medical person",
                "findings": [
                    {
                        "label": "test/metric name (e.g. Hemoglobin)",
                        "value": "actual value with unit (e.g. 13.2 g/dL)",
                        "status": "normal or warning",
                        "note": "simple explanation with normal range (e.g. Within normal range 12-16 g/dL)"
                    }
                ],
                "recommendations": [
                    "recommendation 1",
                    "recommendation 2"
                ]
            }

            Rules:
            - "status" must be ONLY "normal" or "warning" — nothing else
            - "findings" should list every measurable value in the report
            - Keep all language simple and easy to understand
            - Return ONLY the JSON object, no markdown, no backticks, no extra text

            Medical Document:
            ${truncatedText}`;

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