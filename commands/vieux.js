module.exports = {
    name:'old',
    description:"This commande send a message that remember that you are old",
    execute(message,args,messages){
        const member = message.mentions.users.first();
        if(member){
            message.channel.send(`${member}${messages[Math.floor(Math.random() * (messages.length -1))]}`)
        }else{
            message.reply(messages[Math.floor(Math.random() * (messages.length -1))]);
        }
    }
}