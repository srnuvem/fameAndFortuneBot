import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import { Character } from '../structs/types/Character'
import { getCharacter } from './dbService'

export async function buildFichaEditPt2Modal(characterId: string) {
    const character: Character = await getCharacter(characterId)
    const pv = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-pv-input',
                label: 'PV',
                value: character?.pv ? character?.pv.toString() : undefined,
                placeholder: 'Altere o PV aqui ❤️',
                style: TextInputStyle.Short,
                required: false,
            }),
        ],
    })

    const moeda = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-moeda-input',
                label: 'Moeda',
                value: character?.moeda ? character?.moeda.toString() : undefined,
                placeholder: 'Altere os moeda aqui 🪙',
                style: TextInputStyle.Short,
                required: false,
            }),
        ],
    })

    const perolas = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-perolas-input',
                label: 'Pérolas',
                value: character?.perolas ? character.perolas.toString() : undefined,
                placeholder: 'Altere as pérolas aqui 🔮',
                style: TextInputStyle.Short,
                required: false,
            }),
        ],
    })

    const thumbURL = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-thumburl-input',
                label: 'Foto',
                value: character?.thumbURL ? character?.thumbURL : undefined,
                placeholder: 'Cole o link da imagem da sua personagem 🖼️',
                style: TextInputStyle.Paragraph,
                required: false,
            }),
        ],
    })

    const color = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-color-input',
                label: 'Cor Hex',
                value: character?.color ? character?.color : undefined,
                placeholder: 'Edite a cor aqui 🎨',
                style: TextInputStyle.Short,
                max_length: 8,
                required: false,
            }),
        ],
    })

    return new ModalBuilder({
        custom_id: 'form-pt2-edit',
        title: 'Crie sua personagem',
        components: [pv, moeda, perolas, thumbURL, color],
    })
}
