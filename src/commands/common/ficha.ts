import { ApplicationCommandType, Collection } from "discord.js";
import { QuickDB } from "quick.db";
import { buildFichaEmbed, buildFichaModal } from "../../helpers/fichaHelper";
import { Character, CharacterClass } from "../../structs/types/Character";
import { Command } from "../../structs/types/Command";

const db = new QuickDB();

export default new Command({
    name: "ficha",
    description: "Envia o formulario de criação e edição de ficha da personagem",
    type: ApplicationCommandType.ChatInput,
    async run({ interaction }) {
        try {
            const modal = await buildFichaModal(interaction.user.id)
            interaction.showModal(modal);


        } catch (error) {
            console.log(`Um erro ocorreu: ${error}`.red);
        }
    },
    modals: new Collection([["form-ficha", async (modalInteraction) => {
        try {
            const { fields } = modalInteraction;
            let character: Character = await db.get(modalInteraction.user.id) as Character;

            if (!character) character = new CharacterClass();

            character.userId = modalInteraction.user.id;
            character.name = fields.getTextInputValue("form-ficha-name-input");

            character.forca = parseInt(fields.getTextInputValue("form-ficha-forca-input"));
            character.astucia = parseInt(fields.getTextInputValue("form-ficha-astucia-input"));
            character.manha = parseInt(fields.getTextInputValue("form-ficha-manha-input"));
            character.ardil = parseInt(fields.getTextInputValue("form-ficha-ardil-input"));
            character.maxPV = character?.forca * 5;
            character.PV = character?.maxPV;

            await db.set(modalInteraction.user.id, character)
            const embed = await buildFichaEmbed(modalInteraction.user.id);
            modalInteraction.reply({ embeds: [embed] })

        } catch (error) {
            console.log(`Um erro ocorreu: ${error}`.red);

        }
    }

    ]])
})