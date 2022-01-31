module.exports = {
    name:'unSetTime',
    description:"Set a channel to listen",
    execute(message,args,redis){
        redis.exists(args[0].toString(),(err,exist)=>{
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