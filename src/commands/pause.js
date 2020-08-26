const { MessageEmbed } = require("discord.js");

const execute = (bot, msg, args) => {
    const queue = bot.queues.get(msg.guild.id);
    if (!queue) {
      return msg.reply("não existe nenhuma música sendo reproduzida");
    }
    queue.dispatcher.pause();
    const embed = new MessageEmbed()
        .setDescription(':pause_button: **Música pausada!**')
        .setColor('#abfff2')
    msg.channel.send(embed)
  };
  
  module.exports = {
    name: "pause",
    help: "Pausa a reprodução de música atual",
    execute,
  };