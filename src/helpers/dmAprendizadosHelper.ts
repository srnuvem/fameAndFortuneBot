import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { QuickDB } from "quick.db";
import { Character } from "../structs/types/Character";

const db = new QuickDB();

export async function buildaprendizadoModal(characterId: string) {
    const character: Character = await db.get(characterId) as Character;

    const humanidade = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-aprendizado-humanidade-input',
                label: "Humanidade:",
                value: character?.humanidade ? character?.aprendizados.toString() : undefined,
                placeholder: "Edite a Humanidade",
                style: TextInputStyle.Short,
                maxLength: 2,
                required: false
            }),
        ]
    })

    const forca = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-aprendizado-forca-input',
                label: "Força",
                value: character?.aprendizados?.forca ? character?.aprendizados?.forca.toString() : undefined,
                placeholder: "Edite o aprendizado de Força 💪❤️",
                style: TextInputStyle.Short,
                max_length: 2,
                required: false
            }),
        ]
    })

    const astucia = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-aprendizado-astucia-input',
                label: "Astúcia",
                value: character?.aprendizados.astucia ? character?.aprendizados.astucia.toString() : undefined,
                placeholder: "Edite o aprendizado de Astúcia 🧠👀",
                style: TextInputStyle.Short,
                max_length: 2,
                required: false


            }),
        ]
    })

    const manha = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-aprendizado-manha-input',
                label: "Manha",
                value: character?.aprendizados.manha ? character?.aprendizados.manha.toString() : undefined,
                placeholder: "Edite o aprendizado de Manha 🏃‍♀️🤾‍♂️",
                style: TextInputStyle.Short,
                max_length: 2,
                required: false


            }),
        ]
    })

    const ardil = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-aprendizado-ardil-input',
                label: "Ardil",
                value: character?.aprendizados.ardil ? character?.aprendizados.ardil.toString() : undefined,
                placeholder: "Edite o aprendizado de Ardil 🗨️👄",
                style: TextInputStyle.Short,
                max_length: 2,
                required: false
            }),
        ]
    })

    return new ModalBuilder({
        custom_id: 'form-edit-aprendizados', title: "Edite o aprendizado e a humanidade", components: [forca, astucia, manha, ardil, humanidade]
    });
}