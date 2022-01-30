module.exports = {
    name:'kick',
    description:"This commande ban someone",
    execute(message,args){
        const member = message.mentions.users.first();
        if(member){
            member.kick("BARK BARK BARK BARK");
        }else{
            message.channel.send('Pas de membre mentionné');
        }
    }
}