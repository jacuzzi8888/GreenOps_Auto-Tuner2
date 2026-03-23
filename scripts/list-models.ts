import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY is missing in .env");
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    
    try {
        // Note: listModels is not directly on genAI in some versions, 
        // but we can check the documentation or try to use the REST API if needed.
        // Actually, let's use the REST API via axios to be sure.
        const axios = require('axios');
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await axios.get(url);
        console.log("Available Models:");
        response.data.models.forEach((m: any) => {
            console.log(`- ${m.name} (${m.displayName})`);
        });
    } catch (e: any) {
        console.error("Error listing models:", e.response ? e.response.data : e.message);
    }
}

listModels();
