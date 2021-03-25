require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client();

const PREFIX = "?";

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
        joke: tellMeAJoke
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
    function jokeItem(joke, answer) {
        this.joke = joke;
        this.answer = answer;
    }
    jokes = [
        new jokeItem("What's the best thing about Switzerland?",
            "I don't know, but their flag is a huge plus."),
        new jokeItem("What's the best thing about Switzerland?",
            "I don't know, but their flag is a huge plus.")
    ];
    var randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    message.channel.send("Q: " + randomJoke.joke);
    message.channel.send("A: " + randomJoke.answer);
}