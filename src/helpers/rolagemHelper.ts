import { ColorResolvable, EmbedBuilder } from "discord.js";
import { QuickDB } from "quick.db";
import { Character } from "../structs/types/Character";
import { formatAtt, getColor, rollD20 } from "./formattersHelper";
const db = new QuickDB();

export async function buildAtaqueEmbed(characterId: string) {
    const character: Character = await db.get(characterId) as Character;

    const rolagem = rollD20();
    const attValue = character?.selectedAtt ? character[character?.selectedAtt] : 0;
    const modValue = character?.selectedMod | 0;
    const total = rolagem + modValue + attValue;


    return new EmbedBuilder()
        .setTitle(`${character?.name} atacou! ${formatAtt(character?.selectedAtt)}: ${total}`)
        .setDescription(`
        ${formatAtt(character?.selectedAtt)}: ${attValue}
        Modificador: ${modValue}
        Rolagem: ${rolagem}
        Ataque total: **${total}**`)
        .setColor("White")
        .setThumbnail(character?.thumbURL)
}
export async function buildCheckEmbed(result: string, character: Character, rolagem: number, attValue: number, modValue: number) {

    return new EmbedBuilder()
        .setTitle(`${result} ${character?.name} 🎲:${rolagem}`)
        .setDescription(`
                ${formatAtt(character?.selectedAtt)}: ${attValue}
                Modificador: ${character?.selectedMod}
                Dificuldade total: **${attValue + modValue}**
                 
                Rolagem: **${rolagem}**`)
        .setColor(getColor(result) as ColorResolvable)
        .setThumbnail(character?.thumbURL)
        .setFooter({ text: result.includes("FALHA") ? `Mas você aprendeu com isso. +1 de aprendizado em ${formatAtt(character?.selectedAtt)} 🎉` : "Sucesso! 🎉" })
}

export async function updateAprendizados(characterId: string) {
    let character: Character = await db.get(characterId) as Character;

    const levelUP = character?.aprendizados[character?.selectedAtt] === 4;
    if (levelUP) {
        character.aprendizados[character?.selectedAtt] = 0;
        character[character?.selectedAtt] += 1;
    } else {
        character.aprendizados[character?.selectedAtt] += 1;
    }
    await db.set(characterId, character)

    return levelUP;
}
export async function updateHumanidade(characterId: string) {
    let character: Character = await db.get(characterId) as Character;

    character[character?.selectedAtt] -= 1;
    await db.set(characterId, character)

    return true;
}


export async function buildLvlUpEmbed(character: Character) {

    return new EmbedBuilder()
        .setTitle(`${character?.name} Subiu + 1 ponto em ${formatAtt(character?.selectedAtt)} 🎉`)
        .setDescription(`Os esforços de ${character?.name} não foram em vão! 
            Você ganhou mais 1 ponto em ${formatAtt(character?.selectedAtt)}`)
        .setThumbnail(character?.thumbURL)
        .setFooter({ text: "Parabéns! 🎉" })
}

export async function buildHumanityLostEmbed(character: Character) {

    return new EmbedBuilder()
        .setTitle(`${character?.name} perdeu 1 ponto em Humanidade  💀`)
        .setDescription(`Os esforços de ${character?.name} estão cobrando um preço alto! 
            Você perdeu 1 ponto de Humanidade`)
        .setThumbnail(character?.thumbURL)
        .setFooter({ text: "Cuidado! 💀" })
}