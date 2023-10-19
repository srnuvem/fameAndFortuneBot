import { ActionRowBuilder, ColorResolvable, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import { Campaign } from '../structs/types/Campaign'
import { getCampaign } from './dbService'

export function buildDMOnlyCampaingEmbed() {
    return new EmbedBuilder()
        .setTitle(`Comando Restrito para DMs`)
        .setDescription(`Por favor, pessa para um Admin te tornar DM`)
        .setColor('Red')
        .setThumbnail('https://i.ibb.co/RCT50Gb/error.png')
}
export async function buildcampaignEmbed(campaingId: string) {  
    const campaign: Campaign = await getCampaign(campaingId)

    return new EmbedBuilder()
        .setTitle(`${campaign?.name}`)
        .setDescription(`
                **Moeda🪙:  ${campaign?.moeda}€$**   
                **Pérola🔮:  ${campaign?.perola}**
        `
        )
        .setColor(campaign?.color as ColorResolvable)
        .setThumbnail(campaign?.thumbURL)
}

export async function buildCampaignModal(campaign?: Campaign) {
    const name = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-campaign-name-input',
                label: 'Nome:',
                value: campaign?.name ? campaign?.name : undefined,
                placeholder: 'Digite o nome pra sua campaign 🪪',
                style: TextInputStyle.Short,
                maxLength: 50,
            }),
        ],
    })
    const moeda = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-campaign-moeda-input',
                label: 'Moeda:',
                value: campaign?.moeda ? campaign?.moeda : "Moeda",
                placeholder: 'Digite o nome da moeda nesse universo 🪙',
                style: TextInputStyle.Short,
                maxLength: 50,
            }),
        ],
    })
    const perola = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-campaign-perola-input',
                label: 'Perola:',
                value: campaign?.perola ? campaign?.perola : "Perola",
                placeholder: 'Digite o nome da perola nesse universo 🔮',
                style: TextInputStyle.Short,
                maxLength: 50,
            }),
        ],
    })

    return new ModalBuilder({
        custom_id: 'form-campaign',
        title: campaign ? 'Edite sua campanha' : 'Crie sua campanha',
        components: [name, moeda, perola],
    })
}
