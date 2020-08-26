const discord = require('discord.js')
const execute = (bot, msg, args) => {
    const queue = bot.queues.get(msg.guild.id)

    if (!queue) {
        return msg.reply('não há nenhuma música!')
    }

    queue.dispatcher.resume()

    const embed = new discord.MessageEmbed()
        .setColor('#abfff2')
        .setDescription(':notes: **Música despausada!**')
    msg.channel.send(embed)
}

module.exports = {
    name: "resume",
    execute,
}