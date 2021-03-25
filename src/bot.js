require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client();

const PREFIX = "<";

client.on('ready', () => {
    console.log(`${client.user.username} is online!`);

});

client.login(process.env.BOT_TOKEN);

client.on('message', message => {
    if (!message.content.startsWith(PREFIX)) return;
    if (message.author.bot) return; // bots shouldn't execute commands
    commandsMenu(message);
});

function commandsMenu(message) {
    var commandsList = {
        sayHi: sayHif,
        joke: tellMeAJoke,
        purge: purgeMessages,
        help: helpMessage
    }
    var [command, ...args] = message.content.substring(PREFIX.length).split(" ");
    var params = [message, args];
    if (commandsList[command] !== undefined) {
        commandsList[command].apply(null, params);
    } else {
        message.channel.send(embeededMessage('Error', 'Command not found. :/'));
    }
}

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

function sayHif(message, args = []) {
    messages = [
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

    jokes = [
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

function helpMessage(message, args = []) {
    var helpMessages = [
        ['Say hello:', `${PREFIX}SayHi help`],
        ['Request a joke:', `${PREFIX}joke help`],
        ['Purge messages:', `${PREFIX}purge help`]
    ];
    var embeededMsg = embeededMessage('Help!', 'Hello there, you may find this information useful.', helpMessages);
    message.channel.send(embeededMsg);
}