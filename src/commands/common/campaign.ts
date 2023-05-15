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
    VoiceChannel,
} from 'discord.js'
import { buildCampaignModal, buildDMOnlyCampaingEmbed, buildcampaignEmbed } from '../../helpers/campaignHelper'
import { getCampaign, getCampaignId, getEditCampaignId, setEditCampaignId, updateCampaign } from '../../helpers/dbService'
import { formatChannelName } from '../../helpers/formatters'
import { Campaign, CampaignClass } from '../../structs/types/Campaign'
import { Command } from '../../structs/types/Command'

export default new Command({
    name: 'z-campanha',
    description: 'Cria ou edita uma campanha',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'criar',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Comando restrito a DMs para create uma nova campanha',
        },
        {
            name: 'editar',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Comando restrito a DMs para editar esta campaign',
        },
    ],
    async run({ interaction, options }) {
        try {
            const dmRole = interaction?.guild?.roles?.cache.find((role) => role.name === 'DM') as Role
            const member = interaction?.guild?.members.cache.get(interaction.user.id) as GuildMember
            const channel = interaction.channel as TextChannel
            const categoryId = channel.parent?.id as string
            const guildId = interaction?.guild?.id as string

            const campaignId = getCampaignId(categoryId, guildId)

            if (!member.roles.cache.has(dmRole.id)) {
                interaction.reply({ embeds: [buildDMOnlyCampaingEmbed()], ephemeral: true })
                return
            }

            if (options.getSubcommand() === 'criar') {
                let modal = await buildCampaignModal()

                await setEditCampaignId(interaction.user.id, '')
                interaction.showModal(modal)
            }

            if (options.getSubcommand() === 'editar') {
                const campaign: Campaign = await getCampaign(getCampaignId(guildId, categoryId))
                let modal = await buildCampaignModal(campaign)

                await setEditCampaignId(interaction.user.id, campaignId)
                interaction.showModal(modal)
            }
        } catch (error) {
            console.log(`Um erro ocorreu em z-campaign: ${error}`)
        }
    },
    modals: new Collection([
        [
            'form-campaign',
            async (modalInteraction) => {
                try {
                    const { fields } = modalInteraction

                    let campaingId: string = await getEditCampaignId(modalInteraction.user.id)
                    let campaign: Campaign = await getCampaign(campaingId)

                    const guild = modalInteraction.guild

                    //If creating campaing
                    if (campaingId === '') {
                        campaign = new CampaignClass()

                        campaign.name = fields.getTextInputValue('form-campaign-name-input')

                        campaign.guildId = guild?.id as string
                        const category = (await guild?.channels.create({
                            name: campaign.name,
                            type: ChannelType.GuildCategory,
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
                        })) as CategoryChannel

                        const textChannel = (await guild?.channels.create({
                            name: formatChannelName(`campanha-${campaign.name}'`),
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

                        const narradoratextChannel = (await guild?.channels.create({
                            name: formatChannelName(`ficha-narradora-${campaign.name}'`),
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

                        const voiceChannel = (await guild?.channels.create({
                            name: campaign.name,
                            type: ChannelType.GuildVoice,
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
                        })) as VoiceChannel

                        campaign.categoryId = category.id
                        campaign.textChannelId = textChannel.id
                        campaign.voiceChannelId = voiceChannel.id
                        campaingId = getCampaignId(campaign.categoryId, campaign.guildId)
                    }

                    campaign.name = fields.getTextInputValue('form-campaign-name-input')
                    campaign.moeda = fields.getTextInputValue('form-campaign-moeda-input')
                    campaign.perola = fields.getTextInputValue('form-campaign-perola-input')

                    let channel = guild?.channels.cache.find((c) => c.id === campaign.textChannelId) as TextChannel

                    await updateCampaign(campaingId, campaign)

                    const embed = await buildcampaignEmbed(campaingId)

                    modalInteraction.reply({ ephemeral: true, embeds: [embed] })

                    channel.send({ embeds: [embed] } as MessageCreateOptions)
                } catch (error) {
                    console.log(`Um erro ocorreu em form-campaign: ${error}`)
                }
            },
        ],
    ]),
})
