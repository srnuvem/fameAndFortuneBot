import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    CategoryChannel,
    ChannelType,
    Collection,
    MessageCreateOptions,
    TextChannel,
} from 'discord.js'
import { getCharacter, getCharacterId, getEditCharacterId, setEditCharacterId, updateCharacter } from '../../helpers/dbService'
import { buildFichaEditPt1Modal } from '../../helpers/fichaEditPt1Helper'
import { buildFichaEditPt2Modal } from '../../helpers/fichaEditPt2Helper'
import { buildFichaEditPt3Modal } from '../../helpers/fichaEditPt3Helper'
import { buildFichaEmbed } from '../../helpers/fichaHelper'
import { formatChannelName } from '../../helpers/formatters'
import { Character, CharacterClass } from '../../structs/types/Character'
import { Command } from '../../structs/types/Command'

export default new Command({
    name: 'editar',
    description: 'Envia o formulario de criação e edição de ficha da personagem',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'ficha',
            description: 'editar a ficha do usuário',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'pt1',
                    type: ApplicationCommandOptionType.Subcommand,
                    description: 'Editar Nome, Força, Astúcia, Manha, Ardil',
                    options: [
                        {
                            name: 'usuario',
                            description: 'Usuario a ser editado',
                            type: ApplicationCommandOptionType.User,
                        },
                    ],
                },
                {
                    name: 'pt2',
                    type: ApplicationCommandOptionType.Subcommand,
                    description: 'Editar PV, Moeda, Perolas, Foto, Cor',
                    options: [
                        {
                            name: 'usuario',
                            description: 'Usuario a ser editado',
                            type: ApplicationCommandOptionType.User,
                        },
                    ],
                },
                {
                    name: 'pt3',
                    type: ApplicationCommandOptionType.Subcommand,
                    description: 'Editar aprendizados e humanidade',
                    options: [
                        {
                            name: 'usuario',
                            description: 'Usuario a ser editado',
                            type: ApplicationCommandOptionType.User,
                        },
                    ],
                },
            ],
        },
    ],
    async run({ interaction, options }) {
        try {
            const channelId = interaction.channel as TextChannel
            const categoryId = channelId.parent?.id ? channelId.parent?.id : ''
            const guildId = interaction?.guild?.id ? channelId.guild?.id : ''

            const userId = options?.getUser('usuario')?.id ? options.getUser('usuario', true).id : interaction.user.id

            const characterId = getCharacterId(userId, categoryId, guildId)
            let modal = await buildFichaEditPt1Modal(characterId)

            await setEditCharacterId(userId, characterId)
            if (options.getSubcommand() === 'pt2') modal = await buildFichaEditPt2Modal(characterId)
            if (options.getSubcommand() === 'pt3') modal = await buildFichaEditPt3Modal(characterId)

            interaction.showModal(modal)
        } catch (error) {
            console.log(`Um erro ocorreu: ${error}`)
        }
    },
    modals: new Collection([
        [
            'form-ficha',
            async (modalInteraction) => {
                try {
                    const { fields } = modalInteraction

                    const characterId: string = await getEditCharacterId(modalInteraction.user.id)
                    let character: Character = await getCharacter(characterId)
                    const categoryId = characterId.substring(
                        characterId.indexOf('-') + 1,
                        characterId.indexOf('-', characterId.indexOf('-') + 1)
                    )

                    const guild = modalInteraction.guild
                    const category = guild?.channels.cache.get(categoryId) as CategoryChannel
                    const channelName = formatChannelName(fields.getTextInputValue('form-ficha-name-input'))
                    let channel = guild?.channels.cache.find((c) => c.name === channelName) as TextChannel

                    const newCharacter = !character
                    if (newCharacter) character = new CharacterClass()

                    character.characterId = characterId

                    character.userId = modalInteraction.user.id
                    character.name = fields.getTextInputValue('form-ficha-name-input')

                    character.forca = parseInt(fields.getTextInputValue('form-ficha-forca-input'))
                    character.astucia = parseInt(fields.getTextInputValue('form-ficha-astucia-input'))
                    character.manha = parseInt(fields.getTextInputValue('form-ficha-manha-input'))
                    character.ardil = parseInt(fields.getTextInputValue('form-ficha-ardil-input'))
                    character.maxPV = character?.forca * 5
                    character.PV = character?.maxPV

                    if (newCharacter && !channel) {
                        channel = (await guild?.channels.create({
                            name: channelName,
                            type: ChannelType.GuildText,
                            parent: category,
                            permissionOverwrites: [
                                {
                                    id: guild.roles.everyone,
                                    deny: 'ViewChannel',
                                },
                                {
                                    id: modalInteraction.user.id,
                                    allow: ['ViewChannel', 'SendMessages', 'ManageMessages'],
                                },
                            ],
                        })) as TextChannel

                        character.channelId = channel.id as string
                        character.guildId = channel.guildId as string
                    }

                    await updateCharacter(characterId, character)

                    const embed = await buildFichaEmbed(characterId)
                    await modalInteraction.reply({ embeds: [embed] })

                    if (newCharacter) {
                        await channel
                            .send({
                                embeds: [embed],
                                silent: true,
                            } as MessageCreateOptions)
                            .then((sentMessage) => {
                                setTimeout(() => sentMessage.delete(), 10000)
                            })
                    }
                } catch (error) {
                    console.log(`Um erro ocorreu: ${error}`)
                }
            },
        ],
        [
            'form-dm-edit',
            async (modalInteraction) => {
                try {
                    const { fields } = modalInteraction
                    const characterId = await getEditCharacterId(modalInteraction.user.id)

                    let character: Character = await getCharacter(characterId)

                    character.PV = parseInt(fields.getTextInputValue('form-ficha-pv-input'))
                    character.moeda = parseInt(fields.getTextInputValue('form-ficha-moeda-input'))
                    character.perolas = parseInt(fields.getTextInputValue('form-ficha-perolas-input'))
                    character.color = fields.getTextInputValue('form-ficha-color-input')
                    character.thumbURL = fields.getTextInputValue('form-ficha-thumburl-input')

                    await updateCharacter(characterId, character)

                    const embed = await buildFichaEmbed(characterId)
                    modalInteraction.reply({ embeds: [embed] })
                } catch (error) {
                    console.log(`Um erro ocorreu: ${error}`)
                }
            },
        ],
        [
            'form-edit-aprendizados',
            async (modalInteraction) => {
                try {
                    const { fields } = modalInteraction
                    const characterId = await getEditCharacterId(modalInteraction.user.id)

                    let character: Character = await getCharacter(characterId)

                    character.aprendizados.forca = parseInt(fields.getTextInputValue('form-aprendizado-forca-input'))
                    character.aprendizados.astucia = parseInt(fields.getTextInputValue('form-aprendizado-astucia-input'))
                    character.aprendizados.manha = parseInt(fields.getTextInputValue('form-aprendizado-manha-input'))
                    character.aprendizados.ardil = parseInt(fields.getTextInputValue('form-aprendizado-ardil-input'))
                    character.humanidade = parseInt(fields.getTextInputValue('form-aprendizado-humanidade-input'))

                    updateCharacter(characterId, character)

                    const embed = await buildFichaEmbed(characterId)
                    modalInteraction.reply({ embeds: [embed] })
                } catch (error) {
                    console.log(`Um erro ocorreu: ${error}`)
                }
            },
        ],
    ]),
})
