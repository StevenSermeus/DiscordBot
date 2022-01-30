const Discord = require('discord.js')
require('dotenv').config();
const fs= require('fs');
const client = new Discord.Client({
    intents:["GUILDS", "GUILD_MESSAGES","GUILD_VOICE_STATES","GUILD_BANS"]
});
client.commands = new Discord.Collection();
const fileMessage = fs.readFileSync('message.json');
const messages = JSON.parse(fileMessage);
console.log(messages);


const prefix = '!';


// flitre pour chopper les commandes
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
 
// ajoute les commande 
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
 
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
        }
    }
});
    

client.login(process.env.BOT_TOKEN);