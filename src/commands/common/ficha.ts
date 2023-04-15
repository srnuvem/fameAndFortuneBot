import { ApplicationCommandType, Collection, TextChannel } from "discord.js";
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

            const channel = interaction.channel as TextChannel;
            const categoryId = channel?.parent?.id;
            const userId = interaction.user.id;
            const characterId = categoryId + "-" + userId;

            console.log(categoryId);

            await db.set("editCharacter-" + userId, characterId);

            const modal = await buildFichaModal(characterId)
            interaction.showModal(modal);

        } catch (error) {
            console.log(`Um erro ocorreu: ${error}`.red);
        }
    },
    modals: new Collection([["form-ficha", async (modalInteraction) => {
        try {
            const { fields } = modalInteraction;

            const characterId: string = await db.get("editCharacter-" + modalInteraction.user.id) as string;
            let character: Character = await db.get(characterId) as Character;

            console.log(characterId)
            if (!character) character = new CharacterClass();

            character.characterId = characterId;

            character.userId = modalInteraction.user.id;
            character.name = fields.getTextInputValue("form-ficha-name-input");

            character.forca = parseInt(fields.getTextInputValue("form-ficha-forca-input"));
            character.astucia = parseInt(fields.getTextInputValue("form-ficha-astucia-input"));
            character.manha = parseInt(fields.getTextInputValue("form-ficha-manha-input"));
            character.ardil = parseInt(fields.getTextInputValue("form-ficha-ardil-input"));
            character.maxPV = character?.forca * 5;
            character.PV = character?.maxPV;

            await db.set(characterId, character)
            const embed = await buildFichaEmbed(characterId);
            modalInteraction.reply({ embeds: [embed] })

        } catch (error) {
            console.log(`Um erro ocorreu: ${error}`.red);

        }
    }

    ]])
})