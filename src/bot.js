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
        purge: purgeMessages
    }
    var [command, ...args] = message.content.substring(PREFIX.length).split(" ");
    var params = [message, args];
    commandsList[command].apply(null, params);
}

function sayHif(message, args = []) {
    messages = [
        'how is your day going?',
        'hope you are having a wonderful day!',
        'someone looks happy today!',
        'want to hear a joke? Type: ' + PREFIX + 'joke' 
    ];
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
    var randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    message.channel.send(randomJoke.printJoke());
}

function purgeMessages(message, args = []) {
    const maxPurge = 100;

    if (!(args.length > 0)) {
        message.channel.send("Please provide a valid number of messages to purge");
        return;
    }

    if (isNaN(args[0])) {
        message.channel.send("Please provide a valid number of messages to purge");
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