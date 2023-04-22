import { ApplicationCommandType, Collection, TextChannel } from 'discord.js'
import { getCharacter, getCharacterId, setEditCharacterId, updateCharacter } from '../../helpers/dbService'
import { buildFichaEditPt1Modal } from '../../helpers/fichaEditPt1Helper'
import {
    buildAtaqueEmbed,
    buildCheckEmbed,
    buildFichaComponents,
    buildFichaCreationComponents,
    buildFichaCreationEmbed,
    buildFichaEmbed,
    buildHumanityLostEmbed,
    buildLvlUpEmbed,
    buildRequestAttEmbed,
    updateAprendizados,
    updateHumanidade,
} from '../../helpers/fichaHelper'
import { formatResult, rollD20 } from '../../helpers/formatters'
import { Character } from '../../structs/types/Character'
import { Command } from '../../structs/types/Command'

export default new Command({
    name: 'ficha',
    description: 'Envia a ficha do personagem.',
    type: ApplicationCommandType.ChatInput,
    async run({ interaction }) {
        try {
            if (!interaction.channel) return

            // Define se a mensagem é efemera ou nao baseado no nome do canal
            const channel = interaction.channel as TextChannel
            const campaing = !channel.name.includes('ficha')
            const categoryId = channel.parent?.id as string
            const guildId = interaction?.guild?.id as string

            const userId = interaction.user.id
            const characterId = getCharacterId(userId, categoryId, guildId)
            const character: Character = await getCharacter(characterId)
            character.selectedAtt = ''
            character.selectedMod = 0

            await updateCharacter(characterId, character)

            const embed = await buildFichaEmbed(characterId)

            const components = campaing && character.pv > 0 ? await buildFichaComponents() : undefined

            interaction.reply({ embeds: [embed], components, ephemeral: campaing }).then((repliedMessage) => {
                setTimeout(() => repliedMessage.delete(), 300000)
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
    selects: new Collection([
        [
            'attribute-selector',
            async (selectInteraction) => {
                try {
                    const attribute = selectInteraction.values[0]
                    selectInteraction.deferUpdate()
                    const channel = selectInteraction.channel as TextChannel
                    const categoryId = channel?.parent?.id as string
                    const guildId = selectInteraction?.guild?.id as string
                    const userId = selectInteraction.user.id
                    const characterId = getCharacterId(userId, categoryId, guildId)

                    const character: Character = await getCharacter(characterId)
                    character.selectedAtt = attribute
                    await updateCharacter(characterId, character)
                } catch (error) {
                    console.log(`An error occurred: ${error}`)
                }
            },
        ],
        [
            'mod-selector',
            async (selectInteraction) => {
                try {
                    const { user } = selectInteraction
                    const mod = selectInteraction.values[0]
                    selectInteraction.deferUpdate()
                    const channel = selectInteraction.channel as TextChannel
                    const categoryId = channel?.parent?.id as string
                    const guildId = selectInteraction.guild?.id as string
                    const userId = selectInteraction.user.id
                    const characterId = getCharacterId(userId, categoryId, guildId)

                    const character: Character = await getCharacter(characterId)
                    character.selectedMod = parseInt(mod)
                    await updateCharacter(characterId, character)
                } catch (error) {
                    console.log(`An error occurred: ${error}`)
                }
            },
        ],
    ]),
    buttons: new Collection([
        [
            'attack-button',
            async (buttonInteraction) => {
                try {
                    const channel = buttonInteraction.channel as TextChannel
                    const categoryId = channel?.parent?.id as string
                    const guildId = buttonInteraction.guild?.id as string
                    const userId = buttonInteraction.user.id
                    const characterId = getCharacterId(userId, categoryId, guildId)
                    let character: Character = await getCharacter(characterId)

                    let embed = buildRequestAttEmbed(character)
                    let ephemeral = true

                    if (character?.selectedAtt && character?.selectedMod) {
                        embed = await buildAtaqueEmbed(characterId)
                        ephemeral = false
                    }

                    const fichaEmbed = await buildFichaEmbed(characterId)

                    await buttonInteraction.update({
                        embeds: [fichaEmbed],
                        components: [],
                    })
                    await buttonInteraction.followUp({ embeds: [embed], ephemeral })
                } catch (error) {
                    console.log(`An error occurred: ${error}`)
                }
            },
        ],
        [
            'check-button',
            async (buttonInteraction) => {
                try {
                    const channel = buttonInteraction.channel as TextChannel
                    const categoryId = channel?.parent?.id as string
                    const guildId = buttonInteraction.guild?.id as string
                    const userId = buttonInteraction.user.id
                    const characterId = getCharacterId(userId, categoryId, guildId)

                    let character: Character = await getCharacter(characterId)

                    let checkEmbed = buildRequestAttEmbed(character)
                    let ephemeral = true

                    let levelUP = false
                    let humanityLoss = false

                    if (character?.selectedAtt && character?.selectedMod) {
                        const rolagem = rollD20()
                        const attValue = character?.selectedAtt ? character[character?.selectedAtt] : 0
                        const modValue = character?.selectedMod | 0
                        const result = formatResult(rolagem, attValue, modValue)

                        checkEmbed = await buildCheckEmbed(result, character, rolagem, attValue, modValue)
                        if (result.includes('FALHA')) {
                            if (character?.selectedAtt === 'humanidade') {
                                await updateHumanidade(characterId)
                                humanityLoss = true
                            } else {
                                levelUP = await updateAprendizados(characterId)
                            }
                        }
                        ephemeral = false
                    }

                    const fichaEmbed = await buildFichaEmbed(characterId)
                    await buttonInteraction.update({
                        embeds: [fichaEmbed],
                        components: [],
                    })

                    await buttonInteraction.followUp({ embeds: [checkEmbed], ephemeral })

                    if (levelUP) {
                        await buttonInteraction.followUp({
                            embeds: [await buildLvlUpEmbed(character)],
                        })
                    }

                    if (humanityLoss) {
                        await buttonInteraction.followUp({
                            embeds: [await buildHumanityLostEmbed(character)],
                        })
                    }
                } catch (error) {
                    console.log(`An error occurred: ${error}`)
                }
            },
        ],
        [
            'criar-ficha',
            async (buttonInteraction) => {
                try {
                    const channel = buttonInteraction.channel as TextChannel
                    const categoryId = channel?.parent?.id as string
                    const guildId = buttonInteraction.guild?.id as string
                    const userId = buttonInteraction.user.id
                    const characterId = getCharacterId(userId, categoryId, guildId)

                    await setEditCharacterId(userId, characterId)
                    buttonInteraction.showModal(await buildFichaEditPt1Modal(characterId))
                } catch (error) {
                    console.log(`An error occurred: ${error}`)
                }
            },
        ],
    ]),
})
