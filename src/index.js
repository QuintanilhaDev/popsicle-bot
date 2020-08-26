const discord = require("discord.js")
const { token, prefixo } = require("../config.json")
const bot = new discord.Client()
const fs = require('fs')
const path = require('path')

bot.commands = new discord.Collection();
bot.queues = new Map()

const commandFiles = fs
    .readdirSync(path.join(__dirname, "/commands"))
    .filter(filename => filename.endsWith(".js"))

for (var filename of commandFiles) {
    const command = require(`./commands/${filename}`)
    bot.commands.set(command.name, command)
}

console.log(bot.commands)

bot.on("ready", () => {
    console.log('O Popsicle está online!')
    bot.user.setStatus('online')

    const activities_list = [
        'Sou um sorvetinho de morango :3',
        'Sigam minha desenhista! @bialpaca',
        'Meu criador: berry#9925',
        'pop!help'
    ]
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1)
        bot.user.setActivity(activities_list[index])
    }, 1000)
})

bot.on('message', async msg => {
    if (!msg.content.startsWith(prefixo) || msg.author.bot) return;
    const args = msg.content.slice(prefixo.length).trim().split(/ +/)
    const command = args.shift();

    function getUserFromMention(mention) {
        if (!mention) return;

        if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);

            if (mention.startsWith('bx.')) {
                mention = mention.slice(1);
            }

            return bot.users.cache.get(mention);
        }
    }

    //#region COMANDOS DE ULTILIDADES
    if (command === "serverinfo") {
        const idDoServidor = msg.guild.id
        const nomeDoServidor = msg.guild.name
        const criador = msg.guild.owner.user.id
        const quantidadeDeCargos = msg.guild.roles.cache.size
        const serverDiaDeCriacao = msg.guild.createdAt.getDate()
        const serverMesDeCriacao = msg.guild.createdAt.getMonth() + 1
        const fotoDoServidor = msg.guild.iconURL({
            format: "png",
            dynamic: true
        })
        const serverAnoDeCriacao = msg.guild.createdAt.getFullYear()
        const serverRegiao = msg.guild.region.toUpperCase()
        const quantidadeDeMembros = msg.guild.members.cache.size

        const infoPainel = new discord.MessageEmbed()
            .setTitle('**DADOS DESTE SERVIDOR**')
            .setColor('#abfff2')
            .addFields(
                { name: "**NOME DO SERVIDOR**", value: `${nomeDoServidor}`, inline: true },
                { name: "**ID DO SERVIDOR**", value: `(${idDoServidor})`, inline: true },
                { name: "**DATA DE CRIAÇÃO**", value: `${serverDiaDeCriacao}/${serverMesDeCriacao}/${serverAnoDeCriacao}`, inline: true },
                { name: "**CRIADOR**", value: `<@${criador}>`, inline: true },
                { name: "**REGIÃO**", value: `${serverRegiao}`, inline: true },
                { name: "**MEMBROS**", value: `${quantidadeDeMembros} membros`, inline: true },
                { name: "**CARGOS**", value: `${quantidadeDeCargos} cargos criados`, inline: true }
            )
            .setThumbnail(fotoDoServidor)

        msg.channel.send(infoPainel)
    }

    if (command === "bug") {
        const cliente = bot.users.cache.get(msg.author.id)
        const bug = args.join(" ")
        const autor = bot.users.cache.get("596699670055485480")

        if (!bug) {
            msg.reply("você precisa relatar algum bug!")
        } else {
            autor.send(`Bug reportado por <@${msg.author.id}>: ${bug}`)
                .then(m => {
                    m.react("✅")
                    const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === msg.author.id
                    const collector = m.createReactionCollector(filter, {
                        max: 1,
                        time: 5 * 5 * 1000
                    })
                })

            const msgEnviada = new discord.MessageEmbed()
                .setDescription(`:white_check_mark: <@${msg.author.id}>**, sua mensagem foi enviada com sucesso**`)
                .setColor("GREEN")
            msg.channel.send(`<@${msg.author.id}>`, msgEnviada)
        }
    }

    if (command === "ping") {
        const m = await msg.channel.send("Ok, mostrarei a latência");
        const embed = new discord.MessageEmbed()
            .setColor('#abfff2')
            .setDescription(`A minha **latência** é **${m.createdTimestamp - msg.createdTimestamp} ms**. \n \n A **latência** da API é **${Math.round(bot.ws.ping)} ms**.`)
        msg.channel.send(embed)
    }

    if (command === "info") {
        const embed = new discord.MessageEmbed()
            .setTitle('**MINHAS INFORMAÇÕES**')
            .setColor('#abffe3')
            .addFields(
                { name: "**CONVITE**", value: 'Clique [**aqui**](https://discord.com/api/oauth2/authorize?client_id=745698543179792414&permissions=8&scope=bot) para \n me adicionar!', inline: true },
                { name: "**SERVIDORES**", value: `Estou em ${bot.guilds.cache.size} servidores!`, inline: true },
                { name: "**MEU CRIADOR**", value: `<@596699670055485480>`, inline: true },
                { name: "**USUÁRIOS**", value: `Sou amiguinho \n de ${bot.users.cache.size} usuários!`, inline: true },
                { name: "**VERSÃO**", value: 'v1.0.0', inline: true },
                { name: "**REGIÃO**", value: "Sou do Brasil!", inline: true}
            )
            .setThumbnail(bot.user.displayAvatarURL({
                format: "png",
                dynamic: true
            }))
        msg.channel.send(embed)
    }

    //#endregion

    //#region COMANDOS DIVERTIDOS

    //#region COMANDO DE MORDIDA
    if (command === "bite") {
        const usuario = getUserFromMention(args[0]) || args[0]

        if (!usuario || args[0]) {
            const erro = new discord.MessageEmbed()
                .setDescription(`:x: <@${msg.author.id}>**, você precisa mencionar alguém!**`)
                .setColor("RED")
            return msg.channel.send(`<@${msg.author.id}>`, erro)
        }

        let mordidas = [
            'https://pa1.narvii.com/6314/836fd24d924f54695c3842f577b71a7c9d89b332_hq.gif',
            'https://pa1.narvii.com/6206/b981fe8f12c41535ca55748244151470402045b7_hq.gif',
            'https://media.tenor.com/images/b60d919b812adae2d475b23a5124b64d/tenor.gif',
        ]

        let mordidaAleatoria = mordidas[Math.floor(Math.random() * mordidas.length)]

        const mordida = new discord.MessageEmbed()
            .setDescription(`<@${msg.author.id}>** mordeu ${usuario} com força!**`)
            .setImage(mordidaAleatoria)
            .setColor('#abfff2')
        msg.channel.send(mordida)
    }
    //#endregion

    //#region COMANDO DE ABRAÇO
    if (command === "hug") {
        const user = getUserFromMention(args[0]) || args[0]

        if (!args[0] || !user) {
            const alertEmbed = new discord.MessageEmbed()
                .setDescription(`<@${msg.author.id}>, você precisa mencionar um usuário!`)
                .setColor('AQUA')
            msg.channel.send(alertEmbed)
        } else {

            let abracos = [
                'https://i.imgur.com/8Yc6sq6.gif',
                'https://33.media.tumblr.com/6a02f9f626db7b7e3027ed5763649027/tumblr_inline_njc1ii3hwN1sl9x7p.gif',
                'https://miro.medium.com/max/1307/1*xn6dDPa5EmVAxOSQusvO7g.gif',
                'https://media.tumblr.com/tumblr_lt6mgxZXOU1qbvovho1_500.gif',
                'https://pa1.narvii.com/6616/37db8e28b32599874a45eef7d12909285e91ef3c_00.gif',
                'https://k40.kn3.net/taringa/1/8/1/5/0/2/39/n-sync/8BF.gif?41',
                'https://3.bp.blogspot.com/-LXzbmOj9cRc/U0HYH8o4GQI/AAAAAAAACbI/myZEF5Yia60/s1600/Rainbow_Pie_2_hug.gif',
                'https://acegif.com/wp-content/uploads/anime-hug.gif',
                'https://i.pinimg.com/originals/82/c8/e9/82c8e9ff24cce631fa061b35cf9fe82b.gif',
                'https://i.pinimg.com/originals/49/5d/a3/495da3253424973e0658c4ebecc2b1dc.gif',


            ]

            let abraçoAleatorio = abracos[Math.floor(Math.random() * abracos.length)]
            const msgAbraco = new discord.MessageEmbed()
                .setDescription(`<@${msg.author.id}> **deu um abraço em** ${user}`)
                .setColor('#abfff2')
                .setImage(abraçoAleatorio)

            msg.channel.send(`<@${msg.author.id}>`)
            msg.channel.send(msgAbraco)
        }

    }

    //#endregion

    //#region COMANDO AVATAR   
    if (command === "avatar") {
        const user = getUserFromMention(args[0]);
        if (args[0]) {
            const embed = new discord.MessageEmbed()
                .setDescription(`**FOTO DE ${user}**`)
                .setColor('AQUA')
                .setImage(`${user.displayAvatarURL({ dynamic: true, size: 1024 })}`)
            msg.channel.send(`<@!${msg.author.id}>`)
            msg.channel.send(embed);
        }

        if (!args[0]) {
            const embed = new discord.MessageEmbed()
                .setTitle('Aqui está a sua foto')
                .setColor('#abfff2')
                .setImage(`${msg.author.displayAvatarURL({ dynamic: true, size: 1024 })}`)
            msg.channel.send(`<@${msg.author.id}>`, embed)
        }
    }
    //#endregion

    //#region COMANDO HORA
    if (command === "hora") {
        let date = new Date()
        let horas = date.getHours()
        let minutos = date.getMinutes()

        const horaEmbed = new discord.MessageEmbed()
            .setColor('#abfff2')
            .setDescription(`**Agora são ${horas}h${minutos}!`)
        msg.channel.send(horaEmbed)
    }
    //#endregion

    //#region COMANDO CARINHO
    if (command === "pat") {
        const usuario = getUserFromMention(args[0]) || args[0]
        if (usuario || args[0]) {
            let carinhos = [
                'https://pa1.narvii.com/6244/5c979c1b83cae4d8d14c53c2a28e99984d620e3d_hq.gif',
                'https://media.tenor.com/images/c7192cc8ffa738690156fbb9334a8937/tenor.gif',
                'https://i.pinimg.com/originals/68/c1/b6/68c1b61a30b4eccb033c4a47895c7be0.gif',
                'https://pa1.narvii.com/6267/8c9f06254bbeafdcc05a4387b3969c215cbe6a25_hq.gif',
                'https://imgur.com/xGz4Dut.gif',
                'https://images-ext-2.discordapp.net/external/oPOfuzPgGP6972fTatlHW_0dEZwosyrbP7pNnujL-GE/https/loritta.website/assets/img/actions/headpat/generic/gif_5.gif',
                'https://images-ext-1.discordapp.net/external/K-Tw3OZ0tQTftxPG3NK1wqHJu_RNA9ImWnaJ57Zs_UQ/https/loritta.website/assets/img/actions/headpat/generic/gif_6.gif',
                'https://images-ext-2.discordapp.net/external/H0yIk2X6dDpv9jHhjD9Zm5ytB0V79t5vBRBcox4rU3A/https/loritta.website/assets/img/actions/headpat/generic/gif_3.gif'
            ]

            let carinhoAleatorio = carinhos[Math.floor(Math.random() * carinhos.length)]

            const carinho = new discord.MessageEmbed()
                .setDescription(`<@${msg.author.id}>** deu um carinho em** ${usuario}`)
                .setColor('#abfff2')
                .setImage(carinhoAleatorio)
            msg.channel.send(carinho)
        }
        if (!usuario || args[0]) {
            const alertEmbed = new discord.MessageEmbed()
                .setDescription(`<@${msg.author.id}>, você precisa mencionar um usuário!`)
                .setColor('AQUA')
            msg.channel.send(alertEmbed)
        }
    }
    //#endregion

    //#region COMANDO SAY
    if (command === "say") {
        msg.delete()
        const sayMessage = args.join(" ")
        msg.channel.send(sayMessage)

        if (!sayMessage) return;
    }
    //#endregion

    //#region COMANDO KISS
    if (command === "kiss") {
        let usuario = getUserFromMention(args[0]) || args[0]
        if (usuario || args[0]) {
            let beijos = [
                'https://i.pinimg.com/originals/a3/4b/5d/a34b5dcd20bf9db14c9af93b709bfef3.gif',
                'https://i.pinimg.com/originals/a7/4a/bf/a74abfc0fa25c35353066b37443e74ae.gif',
                'https://i.pinimg.com/originals/29/65/3a/29653ad6e372605c4c43c3c015f9e499.gif',
                'https://i.pinimg.com/originals/b0/37/a0/b037a0d27fc2fce28cd279561ec89825.gif',
                'https://ptanime.com/wp-content/uploads/2017/02/Kuzu-no-honkai-GIF1.gif',
                'https://pa1.narvii.com/6238/3f69781186c1f316e03927bedbe038cacadc8949_hq.gif',
                'https://utinuti.files.wordpress.com/2017/04/kuzunohonkai-episode6-omake-1.gif',
                'https://www.intoxianime.com/wp-content/uploads/2018/03/tumblr_p63vgejlBt1vptudso5_500.gif',
                'https://pa1.narvii.com/5770/ff3b717f50fce335c98dc82e19d3d0e768573ea7_hq.gif',
                'https://37.media.tumblr.com/7bbfd33feb6d790bb656779a05ee99da/tumblr_mtigwpZmhh1si4l9vo1_500.gif',
                'https://i.pinimg.com/originals/56/0b/b3/560bb37b1596f48d93a76db4f87dc2f9.gif',
                'https://i.pinimg.com/originals/6f/c2/5f/6fc25fdd3e22d89b19c3ea76d11789e6.gif',
                'https://acegif.com/wp-content/uploads/anime-kiss-m.gif',
                'https://pa1.narvii.com/6271/b757fb1a97d10a0bbc6d99af66b3e6d4ca2b377d_00.gif'
            ]

            let beijoAleatorio = beijos[Math.floor(Math.random() * beijos.length)]

            const beijo = new discord.MessageEmbed()
                .setDescription(`<@${msg.author.id}> **deu um beijo em** ${usuario}`)
                .setColor('#abfff2')
                .setImage(beijoAleatorio)
            msg.channel.send(beijo)
        }

        if (!args[0]) return msg.reply('você precisa citar alguém!')

    }
    //#endregion

    //#region COMANDO SLAP
    if (command === 'slap') {
        let usuario = getUserFromMention(args[0]) || args[0]
        if (!args[0]) {
            msg.reply('você precisar citar alguém!')
        } else {

            let tapas = [
                'https://ptanime.com/wp-content/uploads/2017/06/Sakura-Haruno-top-personagens-femininas-demasiado-violentas.gif',
                'https://media.tenor.com/images/6dbd997e3e79f21b7841b244833325c0/tenor.gif',
                'https://i.pinimg.com/originals/a5/9d/f3/a59df307e6bb26c6c0f1d726675ee934.gif',
                'https://media1.tenor.com/images/f2e22829f9dc2e796d8e9d0590e8076c/tenor.gif?itemid=17223486',
                'https://media1.tenor.com/images/af36628688f5f50f297c5e4bce61a35c/tenor.gif?itemid=17314633',
                'https://i.imgur.com/Agwwaj6.gif',
                'https://i.pinimg.com/originals/2f/0f/82/2f0f82e4fb0dee8efd75bee975496eab.gif',
                'https://media1.tenor.com/images/f9f121a46229ea904209a07cae362b3e/tenor.gif?itemid=7859254https://media1.tenor.com/images/f9f121a46229ea904209a07cae362b3e/tenor.gif?itemid=7859254',
                'https://media1.tenor.com/images/9ea4fb41d066737c0e3f2d626c13f230/tenor.gif?itemid=7355956',
            ]

            let tapaAleatorio = tapas[Math.floor(Math.random() * tapas.length)]

            const tapa = new discord.MessageEmbed()
                .setDescription(`<@${msg.author.id}> **deu um tapa em** ${usuario}`)
                .setColor('#abfff2')
                .setImage(tapaAleatorio)
            msg.channel.send(tapa)
        }
    }
    //#endregion

    //#region COMANDO CRY
    if (command === "cry") {
        let choros = [
            'https://i.pinimg.com/originals/5c/d7/5a/5cd75a928da6df4e8b2027ea32a3068f.gif',
            'https://pa1.narvii.com/6343/5c25a3b8777750c12b914863cae2ea9b451ec0d6_hq.gif',
            'https://pa1.narvii.com/6504/0ff90c7b09278234299fd2ef37d1eda4f27946d7_hq.gif',
            'https://i.pinimg.com/originals/2f/52/93/2f52934bb32f36ac667c1144ddbf34e2.gif',
            'https://64.media.tumblr.com/af8d096632af5626183737c18278a8af/tumblr_o5surdA61P1u70l0wo1_500.gif',
            'https://i.imgur.com/Tlw9G2D.gif',
            'https://i.imgur.com/O8RVSov.gif',
            'https://media.tumblr.com/tumblr_m1gbnqgFOe1r10257.gif',
            'https://sm.ign.com/ign_br/screenshot/default/giphy-6_s7pd.gif',
            'https://coisasdojapao.com/wp-content/uploads/2020/01/usagi-chorando.gif',
            'https://uploads.spiritfanfiction.com/fanfics/historias/201412/fanfiction-originais-when-i-was-your-man-2869273,181220140322.gif',
            'https://pa1.narvii.com/6439/485a7acd35832b642b7cf1120385ba5800ab5790_hq.gif',
            'https://i2.wp.com/25.media.tumblr.com/tumblr_lr8gf0crj71qjxm01o1_500.gif'
        ]

        let choroAleatorio = choros[Math.floor(Math.random() * choros.length)]

        const choro = new discord.MessageEmbed()
            .setDescription(`<@${msg.author.id}> **está chorando**`)
            .setColor('#abfff2')
            .setImage(choroAleatorio)
        msg.channel.send(choro)
    }
    //#endregion

    //#region COMANDO 8BALL
    if (command === "8ball") {
        let pergunta = args.join(" ")
        let respostas = [
            'creio eu que não.',
            'com certeza.',
            'infelizmente não.',
            'não vou responder a essa pergunta...',
            'sim!',
            'não!',
            'não sei, só sei que a crush do meu criador é muito legal!'
        ]
        if (pergunta) {
            let respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)]
            msg.reply(respostaAleatoria)
        }

        if (!pergunta) {
            msg.reply('você precisa me perguntar algo.')
        }
    }
    //#endregion

    //#region COMANDO SHIP
    if (command === "ship") {
        let user1 = getUserFromMention(args[0]) || args[0]
        let user2 = getUserFromMention(args[1]) || args[1]
        const love = Math.random() * 100;
        const loveIndex = love / 10;
        const loveLevel = "💖".repeat(loveIndex) + "💔".repeat(10 - loveIndex);
        if (user1 && user2) {
            const lovePanel = new discord.MessageEmbed()
                .setDescription(`**Chance do casal: ${user1} + ${user2}** \n \n 💘 ${Math.floor(love)}% \n \n〘${loveLevel}〙`)
                .setColor('#ff73c0')
            msg.channel.send(lovePanel)
        } else if (!user1 || !user2) {
            const erro = new discord.MessageEmbed()
                .setDescription(`:x: <@${msg.author.id}>**, você não definiu o casal!**`)
                .setColor("#ff000d")
            msg.channel.send(erro)
        }

    }
    //#endregion

    //#endregion

    //#region COMANDO MODERATIVOS
    //#region COMANDO "LIMPAR"
    if (command === "clear" && msg.member.hasPermission("MANAGE_MESSAGES")) {
        let quantidadeDeMensagens = args.join(' ')
        msg.delete()
        if (!quantidadeDeMensagens || isNaN(quantidadeDeMensagens)) {
            const erro = new discord.MessageEmbed()
                .setDescription(':x: **Por favor, insira uma quantidade em números!**')
                .setColor('#ff0400')
            return msg.channel.send(erro)
        }

        if (quantidadeDeMensagens > 100 || quantidadeDeMensagens < 1) {
            const erro = new discord.MessageEmbed()
                .setDescription(':x: **Por favor, insira uma quantidade entre 1 e 100!**')
                .setColor('#ff0400')
            return msg.channel.send(erro)
        }

        await msg.channel.messages.fetch({ limit: quantidadeDeMensagens })
            .then(messages => {
                msg.channel.bulkDelete(messages)
                const msgsDeletadas = new discord.MessageEmbed()
                    .setDescription(`:white_check_mark: **Limpeza feita com sucesso!** \n \n quantidade de mensagens: ${quantidadeDeMensagens}`)
                    .setColor('#00ff22')
                msg.channel.send(msgsDeletadas)
            })

    }
    //#endregion

    //#region COMANDO KICK
    if (command === "kick" && msg.member.hasPermission("KICK_MEMBERS")) {
        var member = msg.mentions.members.first();
        member.kick().then((member) => {
            const kickado = new discord.MessageEmbed()
                .setDescription(`**Usuário kickado com sucesso! Melhor aprender a ter bons modos.**`)
                .setColor("AQUA")
            return msg.channel.send(kickado);
        }).catch(() => {
            const fail = new discord.MessageEmbed()
                .setDescription(`:x: <@${msg.author.id}>, você é fraco. Falta-lhe permissão!`)
                .setColor("AQUA")
            return msg.channel.send(fail);
        });
    }
    //#endregion

    //#region COMANDO BAN
    if (command === "ban" && msg.member.hasPermission("BAN_MEMBERS")) {
        var member = msg.mentions.members.first();
        member.ban().then((member) => {
            const banido = new discord.MessageEmbed()
                .setDescription(`:white_check_mark: ${member} **foi banido com sucesso! Pelo visto ele foi malvado.**`)
                .setColor("#6aff00")
            return msg.channel.send(banido);
        }).catch(() => {
            const fail = new discord.MessageEmbed()
                .setDescription(`:x: <@${msg.author.id}>**, você é fraco. Falta-lhe permissão!**`)
                .setColor("#ff1e00")
            return msg.channel.send(fail);
        });
    }
    //#endregion

    //#region COMANDO "CRIAR CARGO"
    const nomeDoCargo = args[0]
    if (command === "cargo") {
        if (!msg.member.hasPermission("MANAGE_ROLES")) {
            const fail = new discord.MessageEmbed()
                .setDescription(`:x: <@${msg.author.id}>, você é fraco. Falta-lhe permissão!`)
                .setColor("RED")
            return msg.channel.send(fail);
        }
        if (nomeDoCargo !== "admin") {
            msg.guild.roles.create({
                data: {
                    name: nomeDoCargo,
                    color: 'BLUE',

                },
                reason: 'Cargo criado!',
            })
                .then(console.log)
                .catch(console.error)
            const cargoCriado = new discord.MessageEmbed()
                .setDescription(`<@${msg.author.id}>, seu cargo foi criado com sucesso!`)
                .setColor('AQUA')
            msg.channel.send(cargoCriado)
        } else if (nomeDoCargo === "Silenciado") {
            msg.guild.roles.create({
                data: {
                    name: nomeDoCargo,
                    color: '#919194',
                    permissions: [

                    ]
                }
            })
            msg.channel.updateOverwrite(msg.channel.guild.roles.Silenciado, {
                SEND_MESSAGES: false,
            }
            )



        } else {
            msg.guild.roles.create({
                data: {
                    name: 'ADMIN',
                    color: 'RED',
                    permissions: "ADMINISTRATOR",
                },
                reason: "Cargo administrativo criado!",
            })
            const cargoCriado = new discord.MessageEmbed()
                .setDescription(`<@${msg.author.id}>**, o cargo de administrador foi criado!**`)
                .setColor('AQUA')
            msg.channel.send(cargoCriado)
        }
    }
    //#endregion

    //#region BOAS-VINDAS
    if (command === "welcome" && msg.member.hasPermission("ADMINISTRATOR")) {
        let channelId = msg.channel.id
        var saudacao = true;
        msg.channel.send('Esse será o canal de boas-vindas!')
        bot.on("guildMemberAdd", async member => {
            var user = msg.mentions.users.first();
            let avatar = member.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 1024,
            });
            const embed = new discord.MessageEmbed()
                .setTitle('NOVO MEMBRO!')
                .setColor('WHITE')
                .setDescription(`**${member.user.username}**, seja bem-vindo à nossa comunidade! \n Espero que se divirta! \n Espalhe para os amigos!`)
                .setThumbnail(avatar)
            msg.channel.send(`<@${member.id}>`)
            msg.channel.send(embed)
        })
        if (!msg.member.hasPermission("ADMINISTRATOR")) {
            msg.reply('você não tem permissão para execuar esse comando!')
        }
    }
    //#endregion

    //#region DESPEDIDA
    if (command === "bye") {
        var despedida = true;
        msg.channel.send('Esse será o canal de despedidas!')
        bot.on("guildMemberRemove", async member => {
            let avatar = member.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 1024,
            });
            let user = msg.mentions.users.first();
            const embed = new discord.MessageEmbed()
                .setTitle(`**MAS QUE PENA :(**`)
                .setColor('WHITE')
                .setDescription(`Tchau, <@${member.id}>! \n Espero que tenha se divertido :(`)
                .setThumbnail(avatar)
            msg.channel.send(embed)
        })
        if (!msg.member.hasPermission("ADMINISTRATOR")) {
            msg.reply('você não tem permissão para execuar esse comando!')
        }
    }

    //#endregion

    //#region COMANDO AVISAR UM USUARIO
    if (command === "warn" && msg.member.hasPermission("ADMINISTRATOR")) {
        let rasao = args.slice(1).join(' ')
        let usuario = msg.mentions.users.first();

        if (msg.mentions.users.size < 1) return msg.reply('você precisa mencionar algum usuário!')
        if (rasao.length < 1) return msg.reply('você precisa definir um motivo!')

        let aviso = new discord.MessageEmbed()
            .setDescription(`:exclamation: **VOCÊ RECEBEU UM AVISO DO SERVIDOR** ${msg.guild.name} :exclamation: \n \n **Rasão:** \n ${rasao}`)
            .setColor('#ff0400')
        usuario.send(aviso)
        msg.delete()

        let avisoEnviado = new discord.MessageEmbed()
            .setDescription(`:white_check_mark: <@${usuario.id}>** foi avisado com sucesso!**`)
            .setColor('#6aff00')
        msg.channel.send(avisoEnviado)
    }
    //#endregion

    //#region MUTAR USUARIO
    if (command === "mute") {
        let quemMutar = msg.guild.member(msg.mentions.users.first() || msg.guild.members.cache.get(args[0]))

        if (!quemMutar) return msg.reply('você precisa mencionar alguém!')
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.reply('você é fraco! Falta-lhe permissão.')
        if (quemMutar.hasPermission("MANAGE_MESSAGES")) return msg.reply('não posso mutar esse usuário!')
        if (quemMutar.id === msg.author.id) return msg.reply('quer mutar você mesmo, brother?!')

        let cargoDeMute = msg.guild.roles.cache.find(role => role.name === "Silenciado")

        if (!cargoDeMute) {
            try {
                cargoDeMute = await msg.guild.roles.create({
                    data: {
                        name: 'Silenciado',
                        color: '#757574'
                    }
                })
                msg.guild.channels.cache.forEach(async (channel, id) => {
                    await channel.overwritePermissions([
                        {
                            id: cargoDeMute.id,
                            deny: [
                                "SEND_MESSAGES",
                                "ADD_REACTIONS"
                            ]
                        }
                    ]);
                });
            } catch (e) {
                console.log(e.stack);
            }
        }

        let tempoDeMute = args[1]
        if (!tempoDeMute) return msg.reply('você precisa especificar o tempo de mute!')

        await (quemMutar.roles.add(cargoDeMute.id))
        const foiMutado = new discord.MessageEmbed()
            .setDescription(`<@${quemMutar.id}> **foi multado com sucesso!** \n \n Tempo de mute: ${ms(ms(tempoDeMute))}`)
            .setColor('#7afc62')
        msg.reply(foiMutado)

        setTimeout(function () {
            quemMutar.roles.remove(cargoDeMute.id)
            msg.channel.send(`<@${quemMutar.id}> foi desmutado!`)
        }, ms(tempoDeMute))
        msg.delete()

    }


    //#endregion

    //#endregion

    //#region PAINEL DE AJUDA
    if (command === "help") {
        const embed = new discord.MessageEmbed()
            .setTitle("PAINEL DE AJUDA")
            .addField("``COMANDOS DE DIVERSÃO``", "**Clique** em 🎮 para visualizar \n \n")
            .addField("``COMANDOS DE MODERAÇÃO``", "**Clique** em 🛡️ para visualizar \n \n")
            .addField("``COMANDOS DE ULTILIDADES``", "**Clique** em 🤖 para visualizar \n \n")
            .addField("``COMANDOS MUSICAIS``", "**Clique** em 📀 para visualizar")
            .setColor('AQUA')
        msg.channel.send(embed)
            .then(m => {
                const fun = (reaction, user) => reaction.emoji.name === "🎮" && user.id === msg.author.id;
                const mod = (reaction, user) => reaction.emoji.name === "🛡️" && user.id === msg.author.id;
                const ultil = (reaction, user) => reaction.emoji.name === "🤖" && user.id === msg.author.id;
                const music = (reaction, user) => reaction.emoji.name === "📀" && user.id === msg.author.id;
                m.react("🎮")
                m.react("🛡")
                m.react("🤖")
                m.react('📀')
                const collectorFun = m.createReactionCollector(fun, {
                    time: 5 * 5 * 1000
                })
                const collectorMod = m.createReactionCollector(mod, {
                    time: 5 * 5 * 1000
                })
                const collectorUltil = m.createReactionCollector(ultil, {
                    time: 5 * 5 * 1000
                })

                const collectorMusic = m.createReactionCollector(music, {
                    time: 5 * 5 * 1000
                })

                collectorFun.on('collect', () => {

                    let comandosFun = new discord.MessageEmbed()
                        .setTitle("COMANDOS DIVERTIDOS")
                        .setDescription(`<@${msg.author.id}>**, seja bem-vindo(a) ao painel de diversão!**`)
                        .addFields(
                            { name: 'Abraço', value: 'pop!abraçar ``@Usuário``', inline: true },
                            { name: 'Mordida', value: 'pop!bite ``@Usuário``', inline: true },
                            { name: 'Beijo', value: "pop!kiss ``@Usuário``", inline: true },
                            { name: "Tapa", value: "pop!tapa ``@Usuário``", inline: true },
                            { name: "Chorar", value: "pop!cry", inline: true },
                            { name: 'Dizer', value: 'pop!say ``seu texto``', inline: true },
                            { name: '8ball', value: "pop!8ball", inline: true },
                            { name: 'Horário', value: 'pop!hora', inline: true },
                            { name: 'Avatar', value: 'pop!avatar ``@Usuário``', inline: true },
                        )
                        .setColor("AQUA")
                    m.edit(comandosFun)
                    m.reactions.removeAll()
                    m.react("🎮")
                    m.react("🛡️")
                    m.react("🤖")
                    m.react('📀')
                })
                collectorMod.on('collect', () => {
                    let comandosMod = new discord.MessageEmbed()
                        .setTitle('COMANDOS MODERATIVOS')
                        .addFields(
                            { name: '**CRIAR CARGO**', value: 'pop!cargo `nome do cargo`', inline: true },
                            { name: '**KICKAR USUÁRIO**', value: 'pop!kick `@Usuário`', inline: true },
                            { name: '**BANIR USUÁRIO**', value: 'pop!ban `@Usuário`', inline: true },
                            { name: '**MUTAR USUÁRIO \n TEMPORARIAMENTE**', value: 'pop!mute `@Usuário`', inline: true },
                            { name: '**EXCLUIR MENSAGENS**', value: 'pop!clear `quantidade de mensagens`', inline: true },
                            { name: "**CANAL DE DESPEDIDA**", value: 'pop!bye', inline: true },
                            { name: "**CANAL DE ENTRADAS**", value: 'pop!welcome', inline: true },
                            { name: "**AVISAR USUÁRIO**", value: 'pop!warn `@Usuário` `aviso`', inline: true },
                        )
                        .setColor("BLUE")
                    m.edit(comandosMod)
                    m.reactions.removeAll()
                    m.react("🎮")
                    m.react("🛡️")
                    m.react("🤖")
                    m.react('📀')
                })
                collectorUltil.on('collect', () => {
                    let comandosUltil = new discord.MessageEmbed()
                        .setTitle('COMANDOS ÚLTEIS')
                        .setColor('#8af3ff')
                        .addFields(
                            { name: '**INFORMAÇÕES DO SERVIDOR**', value: 'pop!serverinfo', inline: true },
                            { name: '**MINHAS INFORMAÇÕES**', value: 'pop!info', inline: true },
                            { name: '**REPORTAR BUG**', value: 'pop!bug `bug encontrado`', inline: true }
                        )
                        m.edit(comandosUltil)
                        m.reactions.removeAll()
                        m.react("🎮")
                        m.react("🛡️")
                        m.react("🤖")
                        m.react('📀')
                })

                collectorMusic.on('collect', () => {
                    let comandosMusic = new discord.MessageEmbed()
                        .setTitle('COMANDOS MUSICAIS')
                        .setColor('#8af3ff')
                        .addFields(
                            { name: "Play", value: "pop!play `nome da música`", inline: true },
                            { name: "Pause", value: "pop!pause para pausar \n a música atual", inline: true },
                            { name: "Resume", value: "pop!resume para voltar a \n música pausada", inline: true },
                            { name: "Skip", value: "pop!skip para pular a música", inline: true },
                            { name: "Queue", value: "pop!queue para \n mostrar a fila", inline: true }
                        )
                    m.edit(comandosMusic)
                    m.reactions.removeAll()
                        m.react("🎮")
                        m.react("🛡️")
                        m.react("🤖")
                        m.react('📀')
                })
            })
            .catch(err => console.error(err))
    }
    //#endregion

    try {
        bot.commands.get(command).execute(bot, msg, args)
    } catch (e) {
        return;
    }
})

bot.login(token)