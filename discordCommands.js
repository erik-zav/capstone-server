import { REST, Routes } from 'discord.js';
import 'dotenv/config';

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_API_KEY);
const CLIENT_ID = 'YOUR_CLIENT_ID';
const GUILD_ID = 'YOUR_GUILD_ID';

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: [
          {
              name: 'professors',
              description: 'Lists all professors or by department',
              options: [
                  {
                      type: 3, // STRING type
                      name: 'department',
                      description: 'Department name to filter professors',
                      required: false
                  }
              ]
          },
          {
              name: 'library',
              description: 'Lists the library information',
          },
      ] }
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
