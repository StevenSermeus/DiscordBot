module.exports = {
    name:'setTime',
    description:"Set a channel to listen",
    execute(message,args,redis){
        if(args.length != 2){
            message.reply("This command need at lease 2 args");
            return;
        }
        let channelListen = message.guild.channels.cache.get(args[0].toString());
        let channelMessageSend = message.guild.channels.cache.get(args[1].toString())
        if(!channelListen || !channelMessageSend){
            message.reply("Un des deux channels n'est pas valide");
            return;
        }
        if(channelListen.isVoice && channelMessageSend.isText){
            redis.exists(args[0].toString()).then(alreadyListen => {
                if(alreadyListen){
                    message.channel.send("On monitor déjà ce channel");
                }else{
                    redis.set(args[0].toString(),"");
                    redis.set(args[0].toString()+"msg",args[1].toString());
                    message.reply("Done");
                }
            });
            
        }else{
            message.reply("Le premier channel doit être un voacle le second doit être un channel écrit");
        }
    }
}