import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

// open ai key 
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getAIResponse(userPrompt, systemPrompt) {
    const fullPrompt = systemPrompt + "\n\n" + userPrompt;
    
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
            model: "gpt-3.5-turbo",
        });
        //console.log("API Response:", JSON.stringify(completion, null, 2)); 
        const responseText = completion.choices[0].message.content.trim();
        //console.log(responseText);
        
        return { aiResponse: responseText };
    } catch (error) {
        console.error('Error calling the OpenAI API:', error);
        return { message: 'Failed to process AI response', error: error.message };
    }
}

