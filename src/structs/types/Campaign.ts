export interface Campaign {
    name: string
    guildId: string
    categoryId: string
    textChannelId: string
    voiceChannelId: string
    moeda: string
    perola: string
    color: string
    fama: string
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
    fama: string = '0'
    thumbURL: string = 'https://i.ibb.co/WKzbDNc/user.png'
}
