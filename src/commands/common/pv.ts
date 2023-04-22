import { ApplicationCommandOptionType, ApplicationCommandType, TextChannel } from 'discord.js'
import { getCharacter, getCharacterId, updateCharacter } from '../../helpers/dbService'
import { buildFichaCreationComponents, buildFichaCreationEmbed } from '../../helpers/fichaHelper'
import { Command } from '../../structs/types/Command'

export default new Command({
    name: 'pv',
    description: 'Manipula o PV de uma ficha',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'dano',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Aplica dano á uma ficha',
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
            name: 'cura',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Aplica cura á de uma ficha',
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
            const channel = interaction.channel as TextChannel
            const categoryId = channel.parent?.id ? channel.parent?.id : ''
            const guildId = interaction?.guild?.id ? channel.guild?.id : ''
            const quantidade = options.getNumber('quantidade', true)

            const userId = options?.getUser('usuario', true)?.id
            const characterId = getCharacterId(userId, categoryId, guildId)
            const character = await getCharacter(characterId)

            //TODO: Trocar as mensagens por embeds bonitos
            if (options.getSubcommand() === 'dano') {
                if (character.PV > 0) {
                    character.PV -= quantidade
                    if (character.PV <= 0) {
                        character.PV = 0
                        interaction.reply(`${character.name} recebeu ${quantidade} de dano, e desmaiou`)
                    } else {
                        interaction.reply(`${character.name} recebeu ${quantidade} de dano`)
                    }
                } else {
                    character.PV = -1
                    // TODO: Lembrar os personagens sobre usar suas perolas para sobreviver.
                    interaction.reply(`${character.name} recebeu ${quantidade} de dano, e morreu`)
                }
            }

            if (options.getSubcommand() === 'cura') {
                character.PV += quantidade
                if (character.PV > character.maxPV) {
                    character.PV = character.maxPV
                    interaction.reply(`${character.name} se curou em ${quantidade} PV, e esta 100% de volta ao jogo`)
                } else {
                    interaction.reply(`${character.name} se curou em ${quantidade} PV`)
                }
            }

            updateCharacter(characterId, character)
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
