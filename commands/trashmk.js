module.exports= {
    name:"trashmk",
    description:"Trash talk you or someone if you @ him about mario kart",
    execute(message,args,messages){
        const member = message.mentions.users.first();
        if(member){
            message.channel.send(`${member}${messages[Math.floor(Math.random() * (messages.length -1))]}`)
        }else{
            message.reply(messages[Math.floor(Math.random() * (messages.length -1))]);
        }
    }
}