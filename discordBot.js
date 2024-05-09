
import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';
import 'dotenv/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const TOKEN = process.env.DISCORD_API_KEY; 
const SERVER_URL = 'http://localhost:3001';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'professors') {
        const departmentName = interaction.options.getString('department');
        const url = departmentName ? `${SERVER_URL}/api/professors-by-department?department=${encodeURIComponent(departmentName)}` : `${SERVER_URL}/api/all-professors`;
        const response = await fetch(url);
        const data = await response.json();
        const message = data.map(prof => `${prof.FNAME} ${prof.LNAME} (${prof.HOMEDEPTlong})`).join('\n') || 'No professors found.';
        await interaction.reply(message);
    } else if (commandName === 'library') {
        const response = await fetch(`${SERVER_URL}/api/library`);
        const data = await response.json();
        const message = `Library Hours: ${data.libraryInfo}`;
        await interaction.reply(message);
    }
    //more commands to be added
});

client.login(TOKEN);
export { client };