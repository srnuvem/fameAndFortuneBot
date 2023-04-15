
export interface Character {
    name: string,
    userId: string,
    characterId: string,
    PV: number,
    maxPV: number,
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
    selectedAtt: string,
    selectedMod: number

}
export class CharacterClass implements Character {
    name: string = '';
    userId: string = '';
    characterId: string = '';
    PV: number = 0;
    maxPV: number = 0;
    forca: number = 0;
    astucia: number = 0;
    manha: number = 0;
    ardil: number = 0;
    humanidade: number = 19;
    aprendizados: { forca: number, astucia: number, manha: number, ardil: number } = { forca: 0, astucia: 0, manha: 0, ardil: 0 };
    creditos: number = 0.1;
    perolas: number = 0.1;
    color: string = 'Gold';
    thumbURL: string = 'https://i.ibb.co/WKzbDNc/user.png';
    selectedAtt: string = '';
    selectedMod: number = 0;
}