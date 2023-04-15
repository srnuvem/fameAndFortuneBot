import { ApplicationCommandOptionType, ApplicationCommandType, Collection, TextChannel } from "discord.js";
import { QuickDB } from "quick.db";
import { buildDmEditModal } from "../../helpers/dmeditHelper";
import { buildFichaEmbed } from "../../helpers/fichaHelper";
import { Character } from "../../structs/types/Character";
import { Command } from "../../structs/types/Command";

const db = new QuickDB();

export default new Command({
    name: "dmedit",
    description: "Envia o formulario  edição de ficha do DM",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuario",
            description: "Usuario a ser editado",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    async run({ interaction, options }) {
        try {
            const channelId = interaction.channel as TextChannel;
            const categoryId = channelId.parent?.id;

            const userId = options.getUser("usuario", true).id;
            const characterId = "character/"+categoryId + "-" + userId;

            const modal = await buildDmEditModal(characterId)
            await db.set("editCharacter/" + userId, characterId)

            interaction.showModal(modal);


        } catch (error) {
            console.log(`Um erro ocorreu: ${error}`.red);
        }
    },
    modals: new Collection([["form-dm-edit", async (modalInteraction) => {
        try {
            const { fields } = modalInteraction;
            const editCharacter = await db.get("editCharacter/" + modalInteraction.user.id);

            let character: Character = await db.get(editCharacter) as Character;

            character.PV = parseInt(fields.getTextInputValue("form-ficha-pv-input"))
            character.creditos = parseInt(fields.getTextInputValue("form-ficha-creditos-input"));
            character.perolas = parseInt(fields.getTextInputValue("form-ficha-perolas-input"));
            character.color = fields.getTextInputValue("form-ficha-color-input");
            character.thumbURL = fields.getTextInputValue("form-ficha-thumburl-input");

            await db.set(editCharacter, character)

            const embed = await buildFichaEmbed(editCharacter);
            modalInteraction.reply({ embeds: [embed] })

        } catch (error) {
            console.log(`Um erro ocorreu: ${error}`.red);

        }
    }

    ]])
})