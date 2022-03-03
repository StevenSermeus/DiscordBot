const {MessageEmbed} = require('discord.js');
const { get } = require('ioredis/built/promiseContainer');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    name:"battle",
    description:"Battle between 2 player",
    async execute(message,args,moves,Discord){
        let player1 = message.mentions.users.first();
        let player2 = message.mentions.users.last();
        if(!(player1 && player2) || player1 == player2){
            message.reply("Missing a player");
            return;
        }

        player1.hp = 100;
        player2.hp = 100;

        if(Math.floor(Math.random() * (1- 0+ 1) + 0)){
            player1.turn = true;
            player2.turn = false;
        }
        start = `${player1.turn ? "Le joueur 1 a commencé":"Le joueur 2 a commencé"} `
        const embed = new Discord.MessageEmbed()
        .setColor(0x3498DB)
        .setAuthor("IG GANG")
        .setTitle(`Fight entre ${player1.username} et ${player2.username}`)
        .setDescription(`${start}\n C'est l'heure du DUDUDUDUDU DUELLLL`)
        await message.channel.send({ embeds: [embed] }).then(async (messageEmbed)=>{
            let turn = 1;
            while(player1.hp > 0 && player2.hp > 0){
                await delay(5000);
                attack = moves[Math.floor(Math.random() * (moves.length -1))];
                attack.dommage = Math.floor(Math.random() * (attack.max - attack.min + 1) + attack.min);
                let getDommage = "";
                    if(player1.turn){
                        player2.hp -= attack.dommage;
                        player2.turn = true;
                        player1.turn = false;
                        getDommage=player2.username;
                    }else{
                        player1.hp -= attack.dommage;
                        getDommage=player1.username;
                        player1.turn = true;
                        player2.turn = false;
                    }
                    embed.addFields(
                        { name: `Player HP`, value: `${player1.username} ${player1.hp} HP \n ${player2.username} ${player2.hp} HP`, inline: true ,inlineBreak: false},
                        { name: "Attaque", value: `Tour ${turn}\n${attack.name} a fait ${attack.dommage} ${attack.emoji} à ${getDommage} !`, inline: false },
                      );
                      messageEmbed.edit({ embeds: [embed] });            
                turn++;
            }
        });
        if(player1.hp < 0){
            message.channel.send(`${player2} a gagner contre la merde de ${player1}`);
        }else{
            message.channel.send(`${player1} a gagner contre la merde de ${player2}`);
        }
        
        
    }
}
