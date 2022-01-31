module.exports = {
    name:'unSetTime',
    description:"unset a channel to listen",
    execute(message,args,redis){
        redis.exists(args[0].toString(),(err,exist)=>{
            if(err){
                message.reply("There was an error");
                return;
            }
            if(exist){
                redis.del(args[0].toString());
                redis.del(args[0].toString()+"msg")
                message.reply("Channel not monitor anymore");
            }
            else{
                message.reply("Channel isn't monitor");
            }
        });
        
    }
}