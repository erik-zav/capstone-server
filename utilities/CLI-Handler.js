import readline from 'readline';

export default function setupCLI(botStartCallback, botStopCallback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', (input) => {
        console.log(`Received command: ${input}`);
        switch (input) {
            case 'start bot':
                botStartCallback();
                break;
            case 'stop bot':
                botStopCallback();
                break;
            default:
                console.log('Unknown command');
        }
    });
}
