const {Client, Message, MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'unmute',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async(client, message, args) => {
        if(!message.guild.me.permissions.has('MANAGE_ROLES')) return;
        if(!message.member.permissions.has("MANAGE_ROLES")) return;

        const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if(!Member) return message.reply({ content: "Please specify someone", allowedMentions:{repliedUsers:false}})

        const role = db.get(`muterole_${message.guild.id}`)
        if(role === null){
            return message.channel.send('<:cross:873923620517347389> Muterole is not setup')
        }

        if(!Member.roles.cache.get(role)) return message.channel.send(`${Member.displayName} is not muted`)

        await Member.roles.remove(role).catch(error => console.log(error))

        const embed = new MessageEmbed()
        .setDescription(`<:check:873923620282437654> ${Member.displayName} has been unmuted`)
        .setColor("GREEN")

        message.channel.send({ embeds: [embed] }).catch(e => console.log(e))

        let umutelog = db.get(`setmodlogs_${message.guild.id}`)
        if(umutelog === null){
            return;
        }
        const log = new MessageEmbed()
        .setAuthor(Member.user.tag, Member.user.displayAvatarURL())
        .setTitle(`<:blurplecertifiedmoderator:879212267470749746> Member Unmuted`)
        .addField(`Member`, `<@${Member.user.id}>`)
        .addField(`Moderator`, message.author.tag)
        .setTimestamp()
        .setFooter(`User ID: ${Member.user.id}`)
        .setColor("GREEN")

        try {
            await client.channels.cache.get(umutelog).send({ embeds: [log] })
        } catch (error) {
            console.log(error)
        }
    }
}