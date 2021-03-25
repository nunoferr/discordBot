const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client();

const PREFIX = "<";

/* Executes the bot */
client.login(process.env.BOT_TOKEN);

/* Called when the bot logs in (executes) */
client.on('ready', () => {
    console.log(`${client.user.username} is online!`);
});

/* Changes the bot status randomly and makes it pretendo to be live */
client.on('ready', () => {
    const status = [
        'Partying',
        'Having dinner brb',
        'I need my coffee'
    ];
    setInterval(() => client.user.setActivity(`${status[Math.floor(Math.random() * status.length)]}`, {type:"STREAMING",url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstleyVEVO"}), 5000)
});


/* Reads all sent messages and verifies if a command was called */
client.on('message', message => {
    if (!message.content.startsWith(PREFIX)) return;
    if (message.author.bot) return; // bots shouldn't execute commands
    commandsMenu(message);
});


/* Calls the function related to a specific command with the necessary parameters. */
function commandsMenu(message) {
    const commandsList = {
        sayHi: sayHif,
        joke: tellMeAJoke,
        purge: purgeMessages,
        help: helpMessage
    }
    const [command, ...args] = message.content.substring(PREFIX.length).split(" ");
    const params = [message, args];
    if (commandsList[command] !== undefined) {
        commandsList[command].apply(null, params);
    } else {
        message.channel.send(embeededMessage('Error', 'Command not found. :/'));
    }
}


/* Creates a dialog (MessageEmbed)
 *
 * @string  ?title
 * 
 * @string  ?description
 * 
 * @array[@string name, @string value]  ?fields   - Fields to add to the embeeded message
 * 
 * @string  ?color  - Left bar color
 * 
 * return   Discord.MessageEmbed()  ?embeededMsg    - Message dialog
 */
function embeededMessage(title = '', description = '', fields = [], color = '#0099ff') {
    var embeededMsg = new Discord.MessageEmbed()
    .setColor(color)
	.setTitle(title)
	.setDescription(description);

    fields.forEach(function(field) {
        embeededMsg.addField(field[0], field[1]);
    });
    return embeededMsg;
}


/* Says hello to users in a happy way. */
function sayHif(message, args = []) {
    const messages = [
        'how is your day going?',
        'hope you are having a wonderful day!',
        'someone looks happy today!',
        'want to hear a joke? Type: ' + PREFIX + 'joke' 
    ];

    if (args[0] === 'help') {
        message.channel.send(`Use: ${PREFIX}sayHi.`);
        return;
    }

    message.channel.send(`Hello ${message.author}, ${messages[Math.floor(Math.random() * messages.length)]}`);
}


/* Sends a joke inside a channel. */
function tellMeAJoke(message, args = []) {
    class jokeItem {
        constructor(joke, answer = null) {
            this.joke = joke;
            this.answer = answer;
        }

        printJoke() {
            if (this.answer !== null) {
                return "Q: " + this.joke + "\nA: " + this.answer;
            } else {
                return this.joke;
            }
        }
    };

    const jokes = [
        new jokeItem("What's the best thing about Switzerland?",
            "I don't know, but their flag is a huge plus."),
        new jokeItem("I used to be addicted to soap. But I'm clean now.")
    ];

    if (args[0] === 'help') {
        message.channel.send(`Use: ${PREFIX}joke`);
        return;
    }
    var randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    message.channel.send(randomJoke.printJoke());
}


/* Sends a joke inside a channel.
 *
 * @int args[0] toPurgeNum - Number of messages to purge
 */
function purgeMessages(message, args = []) {
    const maxPurge = 100;

    if (!(args.length > 0)) {
        message.channel.send(`Please provide a valid number of messages to purge.`);
        return;
    }

    if (args[0] === 'help') {
        message.channel.send(`Use: ${PREFIX}purge (count).`);
        return;
    }

    if (isNaN(args[0])) {
        message.channel.send(`Please provide a valid number of messages to purge.`);
        return;
    }
    var toPurgeNum = parseInt(args[0]);

    if (toPurgeNum <= 0 && toPurgeNum > maxPurge) {
        message.channel.send(`Sorry, the number of purge messages must be between 0 and ${maxPurge}.`);
        return;
    }
    toPurgeNum++;

    message.channel.messages.fetch({ limit: toPurgeNum }).then(messages => message.channel.bulkDelete(messages, true));
}


/* Shows the help dialog */
function helpMessage(message, args = []) {
    var helpMessages = [
        ['Say hello:', `${PREFIX}SayHi help`],
        ['Request a joke:', `${PREFIX}joke help`],
        ['Purge messages:', `${PREFIX}purge help`]
    ];
    var embeededMsg = embeededMessage('Help!', 'Hello there, you may find this information useful.', helpMessages);
    message.channel.send(embeededMsg);
}