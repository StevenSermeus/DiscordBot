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

// flitre pour chopper les commandes
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
 
// ajoute les commande 
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log("la commande "+command.name+" est chargée");
    client.commands.set(command.name, command);
}


client.on('ready', () =>{
    console.log("Connecter à " + client.user.username);
});

client.on("messageCreate",(message)=>{
    if(message.content.startsWith(prefix) && !(message.author.bot)){

        const args = message.content.slice(prefix.length).split(/ +/);
        const commande = args.shift().toLowerCase();
        if(commande === "ping"){
            client.commands.get("ping").execute(message,args);
        }else if(commande === "kick"){
            client.commands.get("kick").execute(message,args);
        }else if(commande === "vieux"){
            client.commands.get("vieux").execute(message,args,messages.vieux);
        }else if(commande == "settime"){
            client.commands.get("setTime").execute(message,args,redis);
        }else if(commande == "unsettime"){
            client.commands.get("unSetTime").execute(message,args,redis);
        }
    }
});

client.on('voiceStateUpdate',(oldState,newState)=>{
    if(newState.channelId){
        redis.exists(newState.channelId.toString()).then(exist =>{
            if(exist){
                if(newState.guild.channels.cache.get(newState.channelId.toString()).members.size === 1){
                    redis.set(newState.channelId.toString(),new Date());
                }
            }
        });
    }
        if(oldState.channelId){
             redis.exists(oldState.channelId.toString()).then(exist =>{
                if(exist){
                    if(oldState.guild.channels.cache.get(oldState.channelId.toString()).members.size === 0){
                        redis.get(oldState.channelId.toString(),(err,data)=>{
                            let millseconde =(new Date() - new Date(data));
                            let minute = Math.floor(millseconde/1000/60  << 0);
                            let seconde = Math.floor(millseconde/1000) %60;
                            redis.get(oldState.channelId.toString()+"msg",(err,msg)=>{
                                oldState.guild.channels.cache.get(msg).send(`il y a eu un appel de ${minute} minute(s) et ${seconde} seconde(s) dans ${oldState.channel}`);
                            });
                        });
                        redis.set(oldState.channelId.toString(),"");
                    }
                }
            });
            
        }
    });

client.login(process.env.BOT_TOKEN);