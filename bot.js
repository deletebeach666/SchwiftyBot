/* Configuration */
const request = require("request");
const path = require('path');
const _ = require('underscore');
const express = require("express");
const bodyParser = require('body-parser');

/* Load config file */
const config = require('./src/Config.js');
const BOT_VER = require('./package.json').version;
const BOT_OWNERS = config.get('bot.owners');
const MAIN_DISCORD = config.get("bot.main_discord_id");

/* Commando Installation */
const Commando = require('discord.js-commando');
const client = new Commando.Client({
    commandPrefix: config.get('bot.prefix'),
    owner: BOT_OWNERS
});

/* Initialize other stuff */
var app = express();
var urlParser = bodyParser.urlencoded({ extended: false });
var port = 6969;


client
    .on('error', console.error)
    .on('warn', console.warn)
    .on('ready', () => {
        console.log(`-> Client ready! \n-> Logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
        console.log(`-> Servers: ${client.guilds.array().length}`);
        client.user.setActivity(config.get('bot.default_playing'));
    })
    .on('commandError', (cmd, err) => {
        if(err instanceof Commando.FriendlyError) return;
        console.error('Error in command ${cmd.groupID}:${cmd.memberName}', err);
    })
    .on('message', (msg) => {
        //console.log("(" + msg.guild.name + ") " + msg.member.displayName + ": " + msg.content);
    });

client.registry
    .registerGroups([
        ['general', 'General Category'],
        ['fun', 'Fun Category'],
        ['user', 'User Category'],
        ['moderation', 'Moderation Category'],
        ['music', 'Music Category'],
        ['owner', 'Owner commands (must be defined in config)']
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'src/commands'));

app.listen(port);
console.log("Server listening on: http://localhost:" + port + "/ is now ready to accept requests!");
client.login(config.get('bot.token'));

/* Web Server */
app.get('/', function (req, res) {
    res.send("[SchwiftyBot] Bot is currently online!");
});
