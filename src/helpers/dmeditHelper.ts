import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { QuickDB } from "quick.db";
import { Character } from "../structs/types/Character";

const db = new QuickDB();

export async function buildDmEditModal(userId: string) {
    const character: Character = await db.get(userId) as Character;
    const pv = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-pv-input',
                label: "PV",
                value: character?.PV ? character?.PV.toString() : undefined,
                placeholder: "Altere o PV aqui ❤️",
                style: TextInputStyle.Short,
                required: false
            }),
        ]
    })

    const creditos = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-creditos-input',
                label: "Creditos",
                value: character?.creditos ? character?.creditos.toString() : undefined,
                placeholder: "Altere os creditos aqui 🪙",
                style: TextInputStyle.Short,
                required: false
            }),
        ]
    })

    const perolas = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-perolas-input',
                label: "Foto",
                value: character?.perolas ? character?.perolas.toString() : undefined,
                placeholder: "Altere as perolas aqui 🔮",
                style: TextInputStyle.Short,
                required: false
            }),
        ]
    })


    const thumbURL = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-thumburl-input',
                label: "Foto",
                value: character?.thumbURL ? character?.thumbURL : undefined,
                placeholder: "Cole o link da imagem da sua personagem 🖼️",
                style: TextInputStyle.Paragraph,
                required: false
            }),
        ]
    })

    const color = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-color-input',
                label: "Cor Hex",
                value: character?.color ? character?.color : undefined,
                placeholder: "Edite a cor aqui 🎨",
                style: TextInputStyle.Short,
                max_length: 8,
                required: false
            }),
        ]
    })

    return new ModalBuilder({
        custom_id: 'form-dm-edit', title: "Crie sua personagem", components: [pv, creditos, perolas, thumbURL, color]
    });
}