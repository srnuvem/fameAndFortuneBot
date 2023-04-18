import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import { Character } from '../structs/types/Character'
import { getCharacter } from './dbService'

export async function buildFichaEditPt1Modal(characterId: string) {
    const character: Character = await getCharacter(characterId)

    const name = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-name-input',
                label: 'Nome:',
                value: character?.name ? character?.name : undefined,
                placeholder: 'Digite o nome do seu personagem 🪪',
                style: TextInputStyle.Short,
                maxLength: 50,
            }),
        ],
    })

    const forca = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-forca-input',
                label: 'Força',
                value: character?.forca ? character?.forca.toString() : undefined,
                placeholder: 'Digite a sua força 💪❤️',
                style: TextInputStyle.Short,
                max_length: 2,
            }),
        ],
    })

    const astucia = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-astucia-input',
                label: 'Astúcia',
                value: character?.astucia ? character?.astucia.toString() : undefined,
                placeholder: 'Digite a sua Astúcia 🧠👀',
                style: TextInputStyle.Short,
                max_length: 2,
            }),
        ],
    })

    const manha = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-manha-input',
                label: 'Manha',
                value: character?.manha ? character?.manha.toString() : undefined,
                placeholder: 'Digite a sua Manha 🏃‍♀️🤾‍♂️',
                style: TextInputStyle.Short,
                max_length: 2,
            }),
        ],
    })

    const ardil = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-ardil-input',
                label: 'Ardil',
                value: character?.ardil ? character?.ardil.toString() : undefined,
                placeholder: 'Digite o seu Ardil 🗨️👄',
                style: TextInputStyle.Short,
                max_length: 2,
            }),
        ],
    })

    return new ModalBuilder({
        custom_id: 'form-ficha',
        title: 'Crie sua personagem',
        components: [name, forca, astucia, manha, ardil],
    })
}
