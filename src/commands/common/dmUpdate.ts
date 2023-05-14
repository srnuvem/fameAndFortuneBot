import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    CategoryChannel,
    ChannelType,
    Collection,
    GuildMember,
    MessageCreateOptions,
    Role,
    TextChannel,
} from 'discord.js'
import {
    getCharacter,
    getCharacterId,
    getEditCharacterId,
    killCharacter,
    setEditCharacterId,
    updateCharacter,
} from '../../helpers/dbService'
import { buildFichaEditPt1Modal } from '../../helpers/fichaEditPt1Helper'
import { buildFichaEditPt2Modal } from '../../helpers/fichaEditPt2Helper'
import { buildFichaEditPt3Modal } from '../../helpers/fichaEditPt3Helper'
import { buildDMOnlyEmbed, buildFichaEmbed } from '../../helpers/fichaHelper'
import { formatChannelName } from '../../helpers/formatters'
import { Character, CharacterClass } from '../../structs/types/Character'
import { Command } from '../../structs/types/Command'

export default new Command({
    name: 'z-narradora',
    description: 'Comandos restrito a DMs para',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'update',
            description: 'editar a ficha do usuário',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'pt1',
                    type: ApplicationCommandOptionType.Subcommand,
                    description: 'Comando restrito a DMs para editar Nome, Força, Astúcia, Manha, Ardil',
                    options: [
                        {
                            name: 'usuario',
                            description: 'Usuario a ser editado',
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'pt2',
                    type: ApplicationCommandOptionType.Subcommand,
                    description: 'Comando restrito a DMs editar PV, Moeda, Pérolas, Foto, Cor',
                    options: [
                        {
                            name: 'usuario',
                            description: 'Usuario a ser editado',
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'pt3',
                    type: ApplicationCommandOptionType.Subcommand,
                    description: 'Comando restrito a DMs editar aprendizados e humanidade',
                    options: [
                        {
                            name: 'usuario',
                            description: 'Usuario a ser editado',
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                    ],
                },
            ],
        },
        {
            name: 'creditar',
            description: 'credita moeda para o usuário',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'moedas',
                    type: ApplicationCommandOptionType.Subcommand,
                    description: 'Comando restrito a DMs para adicionar ou remove moeda de uma ficha',
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
                    description: 'Comando restrito a DMs para adicionr ou remove pérolas de uma ficha',
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
        },
        {
            name: 'matar',
            description: 'mata uma ficha do usuário',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'personagem',
                    type: ApplicationCommandOptionType.Subcommand,
                    description: 'Comando restrito a DMs para Matar uma ficha e possibilitar a criação de uma nova',
                    options: [
                        {
                            name: 'usuario',
                            description: 'Usuario a ser liberado',
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                    ],
                },
            ],
        },
    ],
    async run({ interaction, options }) {
        try {
            const dmRole = interaction?.guild?.roles?.cache.find((role) => role.name === 'DM') as Role
            const member = interaction?.guild?.members.cache.get(interaction.user.id) as GuildMember
            
            const userId = options.getUser('usuario', true).id
            const channel = interaction.channel as TextChannel
            const categoryId = channel.parent?.id as string
            const guildId = interaction?.guild?.id as string
            
            const characterId = getCharacterId(userId, categoryId, guildId)
            const character = await getCharacter(characterId)
            
            if (!member.roles.cache.has(dmRole.id)) {
                interaction.reply({embeds:[buildDMOnlyEmbed(character)], ephemeral: true})
                return
            }
            
            if (options.getSubcommandGroup() === 'update') {
                let modal = await buildFichaEditPt1Modal(characterId)

                await setEditCharacterId(interaction.user.id, characterId)
                if (options.getSubcommand() === 'pt2') modal = await buildFichaEditPt2Modal(characterId)
                if (options.getSubcommand() === 'pt3') modal = await buildFichaEditPt3Modal(characterId)

                interaction.showModal(modal)
            }
            if (options.getSubcommandGroup() === 'creditar') {
                const quantidade = options.getNumber('quantidade', true)

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
            }

            if (options.getSubcommandGroup() === 'matar') {
                await killCharacter(characterId)

                await interaction.reply(`O ${character.name} está morto, de vez. Adeus 0/`)

                const fichaEmbed = await buildFichaEmbed(characterId)
                await interaction.followUp({
                    embeds: [fichaEmbed],
                    components: [],
                })
            }
        } catch (error) {
            console.log(`Um erro ocorreu no comando de ficha : ${error}`)
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
                    character.maxPv = character?.forca * 5
                    character.pv = character?.maxPv
                    character.guildId = guild?.id as string

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
                    }

                    character.channelId = channel.id as string
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
                    console.log(`Um erro ocorreu em form-ficha: ${error}`)
                }
            },
        ],
        [
            'form-pt2-edit',
            async (modalInteraction) => {
                try {
                    const { fields } = modalInteraction
                    const characterId = await getEditCharacterId(modalInteraction.user.id)

                    let character: Character = await getCharacter(characterId)

                    character.pv = parseInt(fields.getTextInputValue('form-ficha-pv-input'))
                    character.moeda = parseFloat(fields.getTextInputValue('form-ficha-moeda-input'))
                    character.perolas = parseInt(fields.getTextInputValue('form-ficha-perolas-input'))
                    character.color = fields.getTextInputValue('form-ficha-color-input')
                    character.thumbURL = fields.getTextInputValue('form-ficha-thumburl-input')

                    await updateCharacter(characterId, character)

                    const embed = await buildFichaEmbed(characterId)
                    modalInteraction.reply({ embeds: [embed] })
                } catch (error) {
                    console.log(`Um erro ocorreu em form-pt2-edit: ${error}`)
                }
            },
        ],
        [
            'form-pt3-edit',
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
                    console.log(`Um erro ocorreu em form-pt3-edit: ${error}`)
                }
            },
        ],
    ]),
})
