import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import { Character } from '../structs/types/Character'
import { getCharacter } from './dbService'

export async function buildFichaEditPt4Modal(characterId: string) {
    const character: Character = await getCharacter(characterId)

    const fama = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-fama-input',
                label: 'Fama:',
                value: character?.fama ? character?.fama.toString() : undefined,
                placeholder: 'Edite a fama',
                style: TextInputStyle.Short,
                maxLength: 2,
                required: false,
            }),
        ],
    })

    return new ModalBuilder({
        custom_id: 'form-pt4-edit',
        title: 'Edite a fama',
        components: [fama],
    })
}
