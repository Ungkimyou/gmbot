//IT IS IN DEVELOPMENT

const Discord = require('discord.js');
const mongoose = require('mongoose');
const dbUrl = process.env.MONGODBURL;

mongoose.connect(dbUrl, {
    useNewUrlParser: true
});
const Coins = require('../../models/money.js');

module.exports = {
    name: 'rob',
    category: "economy",
    description: "Rob someone! If u r lucky, u will succeed!",
    aliases: ["steal", "robbery"],
    run: async(client, message, args) => {
        await message.delete()

        let target = message.mentions.members.first();
        if (!target || target.id === message.author.id) return message.reply("Mention a valid member whom you wanna rob! (You also cant rob yourself!)").then(m => m.delete(5000));
      
        Coins.findOne({
          userID: message.author.id,
          serverID: message.guild.id
        }, (err, sendres) => {
          if (err) console.log(err);

            Coins.findOne({
              userID: target.id,
              serverID: message.guild.id
            }, (err, targetres) => {
              if (err) console.log(err);
                let chance = Math.floor(Math.random() * 100) + 1;
              if(chance < 50) {
              sendres.coins = sendres.coins - 500;
              sendres.save().catch(err => console.log(err));
              targetres.coins = targetres.coins + 500
              targetres.save().catch(err => console.log(err));
              message.channel.send(`:money_with_wings: Oh No! You were caught robbing **${target.displayName}** and you paid him **500 coins** as a fine! :money_with_wings:`);
              }

              let amt = Math.floor(Math.random() * targetres.coins) - 1;
      
              if(chance > 50){
                sendres.coins = sendres.coins + amt;
                sendres.save().catch(err => console.log(err));
                targetres.coins = targetres.coins - amt;
                targetres.save().catch(err => console.log(err))
                message.channel.send(`:money_mouth: Yes! You successfully robbed **${target.displayName}**! Your payout was **${amt}**! :money_mouth:`);
              }
            })
          }
      
        )
        }
}