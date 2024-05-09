import 'dotenv/config';
import express from 'express';
import cors from 'cors';
//import setupCLI from './utilities/CLI-Handler.js';
//import { client } from './discordBot.js';
import { getProfessors, getLibrary } from './scrapers/scraper.js';
import { getProfessorDepartments } from './scrapers/getProfessorDepartments.js'; 
import { getAllProfessors, getProfessorsByDepartment } from './chat_commands/professorByDept.js';
import { getAIResponse } from './LLMConnector.js'; 
import { responseSelector } from './responseSelector.js';




// function startBot() {
//     console.log("Starting the Discord bot...");
//     client.login(process.env.DISCORD_API_KEY)
//         .then(() => {
//             console.log("Discord bot started successfully.");
//         })
//         .catch(error => {
//             console.error("Failed to login to Discord:", error);
//         });
// };

// function stopBot() {
//     console.log("Stopping the Discord bot...");
//     client.destroy()
//         .then(() => {
//             console.log("Discord bot stopped successfully.");
//         })
//         .catch(error => {
//             console.error("Failed to stop the Discord bot:", error);
//         });
// };

// create express application
const app = express();
app.use(express.json());

app.use(cors({
    origin: '*', 
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: 'Content-Type,Authorization'
  }));



  const systemPrompt = `Please respond to the user's inquiry with a single number based on the following criteria:
- Respond with '1' if the user's prompt directly asks for information about professors, or it is likely based on the prompt that the user is interested in information about professors.
- Respond with '2' if the user's prompt mentions courses, or it is likely based on the prompt that the user is interested in course information.
- Respond with '3' if neither of the above criteria are met.`;

//APIs
app.post('/api/openai-response', async (req, res) => {
    console.log('Received method:', req.method);
    console.log('Headers:', req.headers);
    if (!req.body.prompt) {
        return res.status(400).send({ message: "Prompt is required." });
    }

    try {

        const initialResponse = await getAIResponse(req.body.prompt, systemPrompt);
        const finalResponse = await responseSelector(initialResponse.aiResponse, req.body.prompt);
        res.json({ aiResponse: finalResponse });


    } catch (error) {
        console.error('Error processing AI response:', error);
        res.status(500).send({ message: 'Failed to process AI response', error: error.message });
    }
});

app.get('/api/professors', async (req, res) => {
    try {
        const professors = await getProfessors();
        res.json(professors);
    } catch (error) {
        console.error('Failed to fetch professors:', error);
        res.status(500).send('Failed to fetch professors');
    }
});

app.get('/api/library', async (req, res) => {
    try {
        const libraryInfo = await getLibrary();
        res.json({ libraryInfo });
    } catch (error) {
        console.error('Failed to fetch library info:', error);
        res.status(500).send('Failed to fetch library information');
    }
});

app.get('/api/update-departments', async (req, res) => {
    try {
        await getProfessorDepartments(); 
        res.json({ message: 'Departments updated successfully.' });
    } catch (error) {
        console.error('Failed to update departments:', error);
        res.status(500).send('Failed to update departments');
    }
});


app.get('/api/all-professors', async (req, res) => {
    try {
        const professors = await getAllProfessors();
        res.json(professors);
    } catch (error) {
        console.error('Failed to fetch all professors:', error);
        res.status(500).send('Failed to fetch all professors');
    }
});


app.get('/api/professors-by-department', async (req, res) => {
    const { department } = req.query; 
    if (!department) {
        return res.status(400).send('Department name is required');
    }

    try {
        const professors = await getProfessorsByDepartment(department);
        res.json(professors);
    } catch (error) {
        console.error(`Failed to fetch professors for department ${department}:`, error);
        res.status(500).send(`Failed to fetch professors for department ${department}`);
    }
});

//setupCLI(startBot, stopBot);


const port = process.env.PORT || 3001;


app.listen(port, () => {
    console.log(`Server running on port ${port}`);


  }
);
