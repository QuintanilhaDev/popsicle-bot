const { MessageEmbed } = require('discord.js')

const execute = (bot, msg, args) => {
    msg.guild.voice.channel.leave()
    const embed = new MessageEmbed()
        .setColor('#abfff2')
        .setDescription('Saindo do canal de voz.')
    msg.channel.send(embed)
}

module.exports = {
    name: "leave",
    execute,
}