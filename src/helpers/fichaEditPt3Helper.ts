import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import { Character } from '../structs/types/Character'
import { getCharacter } from './dbService'

export async function buildFichaEditPt3Modal(characterId: string) {
    const character: Character = await getCharacter(characterId)

    const sanidade = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-sanidade-input',
                label: 'Sanidade:',
                value: character?.sanidade ? character?.sanidade.toString() : undefined,
                placeholder: 'Edite a Sanidade',
                style: TextInputStyle.Short,
                maxLength: 2,
                required: false,
            }),
        ],
    })

    const forca = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-aprendizado-forca-input',
                label: 'Aprendizado em Força',
                value: character?.aprendizados?.forca ? character?.aprendizados?.forca.toString() : undefined,
                placeholder: 'Edite o aprendizado de Força 💪❤️',
                style: TextInputStyle.Short,
                max_length: 2,
                required: false,
            }),
        ],
    })

    const astucia = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-aprendizado-astucia-input',
                label: 'Aprendizado em Astúcia',
                value: character?.aprendizados.astucia ? character?.aprendizados.astucia.toString() : undefined,
                placeholder: 'Edite o aprendizado de Astúcia 🧠👀',
                style: TextInputStyle.Short,
                max_length: 2,
                required: false,
            }),
        ],
    })

    const manha = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-aprendizado-manha-input',
                label: 'Aprendizado em Manha',
                value: character?.aprendizados.manha ? character?.aprendizados.manha.toString() : undefined,
                placeholder: 'Edite o aprendizado de Manha 🏃‍♀️🤾‍♂️',
                style: TextInputStyle.Short,
                max_length: 2,
                required: false,
            }),
        ],
    })

    const ardil = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-aprendizado-ardil-input',
                label: 'Aprendizado em Ardil',
                value: character?.aprendizados.ardil ? character?.aprendizados.ardil.toString() : undefined,
                placeholder: 'Edite o aprendizado de Ardil 🗨️👄',
                style: TextInputStyle.Short,
                max_length: 2,
                required: false,
            }),
        ],
    })

    return new ModalBuilder({
        custom_id: 'form-pt3-edit',
        title: 'Edite o aprendizado e a sanidade',
        components: [forca, astucia, manha, ardil, sanidade],
    })
}
