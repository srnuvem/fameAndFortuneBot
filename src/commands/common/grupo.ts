import { ApplicationCommandType, MessageCreateOptions, TextChannel } from 'discord.js'
import { getCampaignId } from '../../helpers/dbService'
import { buildGroupdEmbed } from '../../helpers/groupHelper'
import { Command } from '../../structs/types/Command'

export default new Command({
    name: 'grupo',
    description: 'Envia a ficha do grupo.',
    type: ApplicationCommandType.ChatInput,
    async run({ interaction }) {
        try {
            if (!interaction.channel) return

            // Define se a mensagem é efemera ou nao baseado no nome do canal
            const channel = interaction.channel as TextChannel
            const categoryId = channel.parent?.id as string
            const guildId = interaction?.guild?.id as string
            const campaingId = await getCampaignId(categoryId, guildId)

            const embed = await buildGroupdEmbed(campaingId)

            interaction.reply({ embeds: [embed], ephemeral: false }).then((repliedMessage) => {
                setTimeout(() => repliedMessage.delete(), 300000)
            })

        } catch (error) {
            console.log(`Grupo Não encontrado: ${error}`)
        }
    },
})
