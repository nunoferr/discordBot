require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client();

const PREFIX = "?";

client.on('ready', () => {
    console.log(`${client.user.username} is online!`);

});

client.login(process.env.BOT_TOKEN);

