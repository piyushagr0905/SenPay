require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: "" });

async function run() {
    try {
        const response = await ai.models.list();
        let models = [];
        for await (const model of response) {
            models.push(model.name);
        }
        console.log(models.join(", "));
    } catch(e) { 
        console.error("Error fetching models:", e.message); 
    }
}
run();
