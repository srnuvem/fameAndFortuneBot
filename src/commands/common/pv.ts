import { ApplicationCommandOptionType, ApplicationCommandType, TextChannel } from 'discord.js'
import { getCharacter, getCharacterId, updateCharacter } from '../../helpers/dbService'
import { buildFichaCreationComponents, buildFichaCreationEmbed, buildFichaEmbed, buildUseCampaignChannelEmbed } from '../../helpers/fichaHelper'
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
            const quantidade = Math.abs(options.getNumber('quantidade', true))
            
            const userId = interaction.user.id
            const characterId = getCharacterId(userId, categoryId, guildId)
            const character = await getCharacter(characterId)
            
            const campaing = channel.name.includes('campanha')
            if (!campaing) {
                await interaction.reply({ embeds: [buildUseCampaignChannelEmbed(character)], ephemeral:true })
                return
            }

            //TODO: Trocar as mensagens por embeds bonitos
            if (options.getSubcommand() === 'dano') {
                if (character.pv > 0) {
                    character.pv -= quantidade
                    if (character.pv <= 0) {
                        character.pv = 0
                        await interaction.reply(`${character.name} recebeu ${quantidade} de dano, e desmaiou`)
                    } else {
                        await interaction.reply(`${character.name} recebeu ${quantidade} de dano`)
                    }
                } else {
                    character.pv = -1
                    // TODO: Lembrar os personagens sobre usar suas perolas para sobreviver.
                    await interaction.reply(`${character.name} recebeu ${quantidade} de dano, e morreu`)
                }
            }

            if (options.getSubcommand() === 'cura') {
                character.pv += quantidade
                if (character.pv > character.maxPv) {
                    character.pv = character.maxPv
                    await interaction.reply(`${character.name} se curou em ${quantidade} PV, e esta 100% de volta ao jogo`)
                } else {
                    await interaction.reply(`${character.name} se curou em ${quantidade} PV`)
                }
            }
            await updateCharacter(characterId, character)

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
