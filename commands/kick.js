module.exports = {
    name:'kick',
    description:"This commande kick someone from the server",
    execute(message,args){
        const member = message.mentions.users.first();
        if(member){
            member.kick("BARK BARK BARK BARK");
        }else{
            message.channel.send('No memeber mentioned');
        }
    }
}