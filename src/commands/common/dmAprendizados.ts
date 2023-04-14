import { ApplicationCommandOptionType, ApplicationCommandType, Collection } from "discord.js";
import { QuickDB } from "quick.db";
import { buildaprendizadoModal } from "../../helpers/dmAprendizadosHelper";
import { buildFichaEmbed } from "../../helpers/fichaHelper";
import { Character } from "../../structs/types/Character";
import { Command } from "../../structs/types/Command";

const db = new QuickDB();

export default new Command({
    name: "dmaprendizados",
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

            const modal = await buildaprendizadoModal(userId)
            await db.set("dmEditUser", userId)

            interaction.showModal(modal);


        } catch (error) {
            console.log(`Um erro ocorreu: ${error}`.red);
        }
    },
    modals: new Collection([["form-edit-aprendizados", async (modalInteraction) => {
        try {
            const { fields } = modalInteraction;
            const editUser = await db.get("dmEditUser");

            let character: Character = await db.get(editUser) as Character;

            character.aprendizados.forca = parseInt(fields.getTextInputValue("form-aprendizado-forca-input"))
            character.aprendizados.astucia = parseInt(fields.getTextInputValue("form-aprendizado-astucia-input"));
            character.aprendizados.manha = parseInt(fields.getTextInputValue("form-aprendizado-manha-input"));
            character.aprendizados.ardil = parseInt(fields.getTextInputValue("form-aprendizado-ardil-input"));
            character.humanidade = parseInt(fields.getTextInputValue("form-aprendizado-humanidade-input"));

            await db.set(editUser, character)

            const embed = await buildFichaEmbed(editUser);
            modalInteraction.reply({ embeds: [embed] })

        } catch (error) {
            console.log(`Um erro ocorreu: ${error}`.red);

        }
    }
    ]])
})