const required = [
    "MONGODB_URI",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "GEMINI_API_KEY",
    "GEMINI_API_URL",
    "PORT",
    "CLIENT_URL"
];

required.forEach(key => {
    if(!process.env[key]){
        throw new Error(`Missing required env variable: ${key}`);
    }
});