export interface Character {
    name: string
    userId: string
    characterId: string
    channelId: string
    guildId: string
    pv: number
    maxPv: number
    forca: number
    astucia: number
    manha: number
    ardil: number
    humanidade: number
    aprendizados: {
        forca: number
        astucia: number
        manha: number
        ardil: number
    }
    moeda: number
    perolas: number
    color: string
    thumbURL: string
    selectedAtt: string
    selectedMod: number
}
export class CharacterClass implements Character {
    name: string = ''
    userId: string = ''
    characterId: string = ''
    channelId: string = ''
    guildId: string = ''
    pv: number = 0
    maxPv: number = 0
    forca: number = 0
    astucia: number = 0
    manha: number = 0
    ardil: number = 0
    humanidade: number = 19
    aprendizados: {
        forca: number
        astucia: number
        manha: number
        ardil: number
    } = { forca: 0, astucia: 0, manha: 0, ardil: 0 }
    moeda: number = 0
    perolas: number = 0
    color: string = 'Gold'
    thumbURL: string = 'https://i.ibb.co/WKzbDNc/user.png'
    selectedAtt: string = ''
    selectedMod: number = 0
}
