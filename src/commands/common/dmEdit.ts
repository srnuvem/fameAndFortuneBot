import { ApplicationCommandOptionType, ApplicationCommandType, Collection } from "discord.js";
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
            const userId = options.getUser("usuario", true).id;

            const modal = await buildDmEditModal(userId)
            await db.set("dmEditUser", userId)

            interaction.showModal(modal);


        } catch (error) {
            console.log(`Um erro ocorreu: ${error}`.red);
        }
    },
    modals: new Collection([["form-dm-edit", async (modalInteraction) => {
        try {
            const { fields } = modalInteraction;
            const editUser = await db.get("dmEditUser");

            let character: Character = await db.get(editUser) as Character;

            character.PV = parseInt(fields.getTextInputValue("form-ficha-pv-input"))
            character.creditos = parseInt(fields.getTextInputValue("form-ficha-creditos-input"));
            character.perolas = parseInt(fields.getTextInputValue("form-ficha-perolas-input"));
            character.color = fields.getTextInputValue("form-ficha-color-input");
            character.thumbURL = fields.getTextInputValue("form-ficha-thumburl-input");

            await db.set(editUser, character)

            const embed = await buildFichaEmbed(editUser);
            modalInteraction.reply({ embeds: [embed] })

        } catch (error) {
            console.log(`Um erro ocorreu: ${error}`.red);

        }
    }

    ]])
})