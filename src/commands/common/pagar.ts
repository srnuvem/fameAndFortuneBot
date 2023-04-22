import { ApplicationCommandOptionType, ApplicationCommandType, TextChannel } from 'discord.js'
import { getCharacter, getCharacterId, updateCharacter } from '../../helpers/dbService'
import { buildFichaCreationComponents, buildFichaCreationEmbed, buildFichaEmbed } from '../../helpers/fichaHelper'
import { Command } from '../../structs/types/Command'

export default new Command({
    name: 'pagar',
    description: 'Adiciona ou remove moeda ou pérolas á sua ficha',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'moeda',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Adiciona ou remove moeda de uma ficha',
            options: [
                {
                    name: 'quantidade',
                    description: 'Quantidade à adicionar ou subtrair',
                    type: ApplicationCommandOptionType.Number,
                    required: true,
                },
            ],
        },
        {
            name: 'perolas',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Adiciona ou remove pérolas de uma ficha',
            options: [
                {
                    name: 'quantidade',
                    description: 'Quantidade à adicionar ou subtrair',
                    type: ApplicationCommandOptionType.Number,
                    required: true,
                },
            ],
        },
    ],
    async run({ interaction, options }) {
        try {
            const channel = interaction.channel as TextChannel
            const categoryId = channel.parent?.id as string
            const guildId = interaction?.guild?.id as string
            const quantidade = options.getNumber('quantidade', true)

            const userId = interaction.user.id
            const characterId = getCharacterId(userId, categoryId, guildId)
            const character = await getCharacter(characterId)

            if (options.getSubcommand() === 'moeda') character.moeda += quantidade
            if (options.getSubcommand() === 'perolas') character.perolas += quantidade

            updateCharacter(characterId, character)
            const reply =
                quantidade > 0
                    ? `${character.name} recebeu ${quantidade} ${options.getSubcommand()}`
                    : `${character.name} gastou ${quantidade} ${options.getSubcommand()}`

            await interaction.reply(reply)

            const fichaEmbed = await buildFichaEmbed(characterId)
            await interaction.followUp({
                embeds: [fichaEmbed],
                components: [],
            })
        } catch (error) {
            console.log(`Ficha Não encontrada: ${error}`)
            const embed = await buildFichaCreationEmbed()
            const components = await buildFichaCreationComponents()
            await interaction.reply({
                embeds: [embed],
                components,
                ephemeral: true,
            })
        }
    },
})
