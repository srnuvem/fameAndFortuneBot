import { User } from "discord.js"

export interface Character {
    name: string,
    userId: string,
    PV: number,
    forca: number,
    astucia: number,
    manha: number,
    ardil: number,
    humanidade: number,
    aprendizados: {
        forca: number,
        astucia: number,
        manha: number,
        ardil: number
    },
    creditos: number,
    perolas: number,
    color: string,
    thumbURL: string,
    selectedMod: string,
    selectedAtt: string

}