import { ApplicationCommandOptionType, ApplicationCommandType, TextChannel } from 'discord.js'
import { getCharacter, getCharacterId, updateCharacter } from '../../helpers/dbService'
import { Command } from '../../structs/types/Command'

export default new Command({
    name: 'pagar',
    description: 'Adiciona ou remove moeda ou perolas á sua ficha',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'moeda',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Adiciona ou remove moeda de uma ficha',
            options: [
                {
                    name: 'usuario',
                    description: 'Usuario a ser editado',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
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
            description: 'Adiciona ou remove perolas de uma ficha',
            options: [
                {
                    name: 'usuario',
                    description: 'Usuario a ser editado',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
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
            const channelId = interaction.channel as TextChannel
            const categoryId = channelId.parent?.id ? channelId.parent?.id : ''
            const guildId = interaction?.guild?.id ? channelId.guild?.id : ''
            const quantidade = options.getNumber('quantidade', true)

            const userId = options?.getUser('usuario', true)?.id
            const characterId = getCharacterId(userId, categoryId, guildId)
            const character = await getCharacter(characterId)

            if (options.getSubcommand() === 'moeda') character.moeda += quantidade
            if (options.getSubcommand() === 'perolas') character.perolas += quantidade

            updateCharacter(characterId, character)
            await interaction.reply(`${character.name} recebeu ${quantidade} moeda`)
        } catch (error) {
            console.log(`Um erro ocorreu: ${error}`)
        }
    },
})
