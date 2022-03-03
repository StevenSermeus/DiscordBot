const Discord = require('discord.js')

require('dotenv').config();

const fs= require('fs');

const Redis = require('ioredis');

let redis = new Redis();

const client = new Discord.Client({
    intents:["GUILDS", "GUILD_MESSAGES","GUILD_VOICE_STATES","GUILD_BANS"]
});

client.commands = new Discord.Collection();

const fileMessage = fs.readFileSync('message.json');

const messages = JSON.parse(fileMessage);

const prefix = '!';


// filter to get the commands
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
 
// load commands
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(command.name+" is charge");
    client.commands.set(command.name, command);
}

function setListening(oldState,newState){
    redis.exists(newState.channelId.toString()).then(exist =>{
        if(exist){
            if(newState.guild.channels.cache.get(newState.channelId.toString()).members.size === 1){
                redis.set(newState.channelId.toString(),new Date());
            }
        }
    });
}

function sendMessageWithTime(oldState,newState){
    redis.exists(oldState.channelId.toString()).then(exist =>{
        if(exist){
            if(oldState.guild.channels.cache.get(oldState.channelId.toString()).members.size === 0){
                redis.get(oldState.channelId.toString(),(err,data)=>{
                    let millseconde =(new Date() - new Date(data));
                    let minute = Math.floor(millseconde/1000/60  << 0);
                    let seconde = Math.floor(millseconde/1000) %60;
                    redis.get(oldState.channelId.toString()+"msg",(err,msg)=>{
                        oldState.guild.channels.cache.get(msg).send(`There was a call of ${minute} min and ${seconde} s in ${oldState.channel}`);
                    });
                });
                // Remove date from bd
                redis.set(oldState.channelId.toString(),"");
            }
        }
    });
}

client.on('ready', () =>{
    console.log("connected as " + client.user.username);
});

client.on("messageCreate",(message)=>{
    if(message.content.startsWith(prefix) && !(message.author.bot)){

        const args = message.content.slice(prefix.length).split(/ +/);
        const commande = args.shift().toLowerCase();
        if(commande === "ping"){
            client.commands.get("ping").execute(message,args);
        }else if(commande === "kick"){
            client.commands.get("kick").execute(message,args);
        }else if(commande === "old"){
            client.commands.get("old").execute(message,args,messages.vieux);
        }else if(commande == "settime"){
            client.commands.get("setTime").execute(message,args,redis);
        }else if(commande == "unsettime"){
            client.commands.get("unSetTime").execute(message,args,redis);
        }else if(commande === "trashmk"){
            client.commands.get("trashmk").execute(message,args,messages.MK);
        }else if(commande === "battle"){
            client.commands.get("battle").execute(message,args,messages.battleMove,Discord);
        }
    }
});

client.on('voiceStateUpdate',(oldState,newState)=>{
    if(newState.channelId){
        setListening(oldState,newState);
    }
    if(oldState.channelId){
            sendMessageWithTime(oldState,newState)
        }
});
client.login(process.env.BOT_TOKEN);