module.exports = {
    name:'ping',
    description:"This commande say pong when you say !ping",
    execute(message,args){
        message.reply("pong");
    }
}