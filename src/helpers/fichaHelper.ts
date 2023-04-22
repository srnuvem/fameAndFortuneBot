import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ColorResolvable, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js'
import { Character } from '../structs/types/Character'
import { getCharacter, updateCharacter } from './dbService'
import { formatAprendizados, formatAtt, getColor, getHealthEmoji, rollD20 } from './formatters'

export async function buildFichaCreationEmbed() {
    return new EmbedBuilder().setTitle('Criar ficha.').setDescription('Você ainda não tem uma ficha criada, gostaria de criar?')
}

export async function buildFichaCreationComponents() {
    const row = new ActionRowBuilder<ButtonBuilder>({
        components: [
            new ButtonBuilder({
                customId: 'criar-ficha',
                emoji: '✍️',
                label: 'Ficha',
                style: ButtonStyle.Secondary,
            }),
        ],
    })
    return [row]
}

export async function buildFichaEmbed(characterId: string) {
    const character: Character = await getCharacter(characterId)

    return new EmbedBuilder()
        .setTitle(`${character?.name}`)
        .setDescription(
            `
        **Humanidade:** ${character?.humanidade}     **PV:** ${character?.PV}/${character?.maxPV} ${getHealthEmoji(
                character?.PV,
                character?.maxPV
            )}
        
        ${formatAprendizados(character?.aprendizados.forca)} | **Força:** ${character?.forca} 
        ${formatAprendizados(character?.aprendizados.astucia)} | **Astúcia:** ${character?.astucia}  
        ${formatAprendizados(character?.aprendizados.manha)} | **Manha:** ${character?.manha}  
        ${formatAprendizados(character?.aprendizados.ardil)} | **Ardil:** ${character?.ardil}
        \u200B
        **Moeda🪙:  ${character?.moeda}€$**   **Pérolas🔮:  ${character?.perolas} CryPe**
        `
        )
        .setColor(character?.color as ColorResolvable)
        .setThumbnail(character?.thumbURL)
}

export function buildFichaComponents() {
    const rowAttributes = new ActionRowBuilder<StringSelectMenuBuilder>({
        components: [
            new StringSelectMenuBuilder({
                customId: 'attribute-selector',
                placeholder: 'Escolha o atributo para rolagem:',
                options: [
                    {
                        label: 'Força',
                        value: 'forca',
                        description: 'Força, Constituição.',
                    },
                    {
                        label: 'Astúcia',
                        value: 'astucia',
                        description: 'Inteligência, Percepção.',
                    },
                    {
                        label: 'Manha',
                        value: 'manha',
                        description: 'Destreza, Agilidade.',
                    },
                    {
                        label: 'Ardil',
                        value: 'ardil',
                        description: 'Carisma, Lábia.',
                    },
                    {
                        label: 'Humanidade',
                        value: 'humanidade',
                        description: 'Humanidade, Sanidade.',
                    },
                ],
            }),
        ],
    })

    const rowMod = new ActionRowBuilder<StringSelectMenuBuilder>({
        components: [
            new StringSelectMenuBuilder({
                customId: 'mod-selector',
                placeholder: 'Escolha o mod:',
                options: [
                    { label: '-5', value: '-5' },
                    { label: '-4', value: '-4' },
                    { label: '-3', value: '-3' },
                    { label: '-2', value: '-2' },
                    { label: '-1', value: '-1' },
                    { label: '0', value: '0' },
                    { label: '1', value: '1' },
                    { label: '2', value: '2' },
                    { label: '3', value: '3' },
                    { label: '4', value: '4' },
                    { label: '5', value: '5' },
                ],
            }),
        ],
    })

    const rowButtons = new ActionRowBuilder<ButtonBuilder>({
        components: [
            new ButtonBuilder({
                customId: 'check-button',
                emoji: '🎲',
                label: ' Check',
                style: ButtonStyle.Secondary,
            }),
            new ButtonBuilder({
                customId: 'attack-button',
                emoji: '💥',
                label: 'Ataque',
                style: ButtonStyle.Danger,
            }),
        ],
    })

    return [rowAttributes, rowMod, rowButtons]
}

export async function buildAtaqueEmbed(characterId: string) {
    const character: Character = await getCharacter(characterId)

    const rolagem = rollD20()
    const attValue = character?.selectedAtt ? character[character?.selectedAtt] : 0
    const modValue = character?.selectedMod | 0
    const total = rolagem + modValue + attValue

    return new EmbedBuilder()
        .setTitle(`${character?.name} atacou! ${formatAtt(character?.selectedAtt)}: ${total}`)
        .setDescription(
            `
        ${formatAtt(character?.selectedAtt)}: ${attValue}
        Modificador: ${modValue}
        Rolagem: ${rolagem}
        Ataque total: **${total}**`
        )
        .setColor('White')
        .setThumbnail(character?.thumbURL)
}
export async function buildCheckEmbed(result: string, character: Character, rolagem: number, attValue: number, modValue: number) {
    return new EmbedBuilder()
        .setTitle(`${result} ${character?.name} 🎲:${rolagem}`)
        .setDescription(
            `
                ${formatAtt(character?.selectedAtt)}: ${attValue}
                Modificador: ${character?.selectedMod}
                Dificuldade total: **${attValue + modValue}**
                 
                Rolagem: **${rolagem}**`
        )
        .setColor(getColor(result) as ColorResolvable)
        .setThumbnail(character?.thumbURL)
        .setFooter({
            text: result.includes('FALHA')
                ? `Mas você aprendeu com isso. +1 de aprendizado em ${formatAtt(character?.selectedAtt)} 🎉`
                : 'Sucesso! 🎉',
        })
}

export async function updateAprendizados(characterId: string) {
    let character: Character = await getCharacter(characterId)

    const levelUP = character?.aprendizados[character?.selectedAtt] >= 4
    if (levelUP) {
        character.aprendizados[character?.selectedAtt] = 0
        character[character?.selectedAtt] += 1
    } else {
        character.aprendizados[character?.selectedAtt] += 1
    }
    await updateCharacter(characterId, character)

    return levelUP
}
export async function updateHumanidade(characterId: string) {
    let character: Character = await getCharacter(characterId)

    character[character?.selectedAtt] -= 1
    await updateCharacter(characterId, character)

    return true
}

export async function buildLvlUpEmbed(character: Character) {
    return new EmbedBuilder()
        .setTitle(`${character?.name} Subiu + 1 ponto em ${formatAtt(character?.selectedAtt)} 🎉`)
        .setDescription(
            `Os esforços de ${character?.name} não foram em vão! 
            Você ganhou mais 1 ponto em ${formatAtt(character?.selectedAtt)}`
        )
        .setThumbnail(character?.thumbURL)
        .setFooter({ text: 'Parabéns! 🎉' })
}

export async function buildHumanityLostEmbed(character: Character) {
    return new EmbedBuilder()
        .setTitle(`${character?.name} perdeu 1 ponto em Humanidade  💀`)
        .setDescription(
            `Os esforços de ${character?.name} estão cobrando um preço alto! 
            Você perdeu 1 ponto de Humanidade`
        )
        .setThumbnail(character?.thumbURL)
        .setFooter({ text: 'Cuidado! 💀' })
}
