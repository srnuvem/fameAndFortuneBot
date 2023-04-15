import { ApplicationCommandOptionType, ApplicationCommandType, Collection, TextChannel } from "discord.js";
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

            const channel = interaction.channel as TextChannel;
            const categoryId = channel?.parent?.id;

            const userId = options.getUser("usuario", true).id;
            const characterId = categoryId + "-" + userId;

            const modal = await buildaprendizadoModal(characterId);
            await db.set("editCharacter-" + userId, characterId);

            interaction.showModal(modal);


        } catch (error) {
            console.log(`Um erro ocorreu: ${error}`.red);
        }
    },
    modals: new Collection([["form-edit-aprendizados", async (modalInteraction) => {
        try {
            const { fields } = modalInteraction;
            const editCharacter = await db.get("editCharacter-" + modalInteraction.user.id);

            let character: Character = await db.get(editCharacter) as Character;

            character.aprendizados.forca = parseInt(fields.getTextInputValue("form-aprendizado-forca-input"))
            character.aprendizados.astucia = parseInt(fields.getTextInputValue("form-aprendizado-astucia-input"));
            character.aprendizados.manha = parseInt(fields.getTextInputValue("form-aprendizado-manha-input"));
            character.aprendizados.ardil = parseInt(fields.getTextInputValue("form-aprendizado-ardil-input"));
            character.humanidade = parseInt(fields.getTextInputValue("form-aprendizado-humanidade-input"));


            await db.set(editCharacter, character)

            const embed = await buildFichaEmbed(editCharacter);
            modalInteraction.reply({ embeds: [embed] })

        } catch (error) {
            console.log(`Um erro ocorreu: ${error}`.red);

        }
    }
    ]])
})