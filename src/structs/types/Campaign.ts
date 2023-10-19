export interface Campaign {
    name: string
    guildId: string
    categoryId: string
    textChannelId: string
    voiceChannelId: string
    moeda: string
    perola: string
    color: string
    thumbURL: string
}
export class CampaignClass implements Campaign {
    textChannelId: string = ''
    voiceChannelId: string = ''
    categoryId: string = ''
    name: string = ''
    channelId: string = ''
    guildId: string = ''
    moeda: string = ''
    perola: string = ''
    color: string = 'Blue'
    thumbURL: string = 'https://i.ibb.co/WKzbDNc/user.png'
}
