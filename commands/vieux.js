module.exports = {
    name:'vieux',
    description:"This commande send a message that remember that you are old",
    execute(message,args,messages){
        const member = message.mentions.users.first();
        if(member){
            message.channel.send(`${messages[Math.floor(Math.random() * (messages.length -1))]}${member}`)
        }else{
            message.reply(messages[Math.floor(Math.random() * (messages.length -1))]);
        }
    }
}