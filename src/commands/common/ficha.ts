import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonInteraction, ButtonStyle, Collection, ColorResolvable, CommandInteraction, EmbedBuilder, StringSelectMenuBuilder } from "discord.js";
import { Command } from "../../structs/types/Command";

export default new Command({
    name: "ficha",
    description: "Envia a ficha do personagem",
    type: ApplicationCommandType.ChatInput,
    run({ interaction }) {

        const character = getCharacter(interaction);

        const embed = new EmbedBuilder()
            .setTitle(`${character.name}`)
            .setDescription(`
        **Humanidade:** ${character.humanidade}     **PV:** ${character.PV} ❤️ 

        ✅⭕️⭕️⭕️⭕️ | **Força:** ${character.forca} 
        ✅✅⭕️⭕️⭕️ | **Astucia:** ${character.astucia}  
        ✅✅✅️⭕️⭕️ | **Manha:** ${character.manha}  
        ✅✅✅✅️⭕️ | **Ardil:** ${character.ardil}
        \u200B
        **Creditos🪙:  ${character.creditos}€$**   **Perolas🔮:  ${character.perolas} CryPe**

        `)
            .setColor(character.color as ColorResolvable)
            .setThumbnail(character.thumbURL)
        const rowAttributes = new ActionRowBuilder<StringSelectMenuBuilder>({
            components: [
                new StringSelectMenuBuilder({
                    customId: "attribute-selector",
                    placeholder: "Escolha o atributo para rolagem:",
                    options: [
                        { label: "Força", value: "forca", description: "Força, Constituição." },
                        { label: "Astucia", value: "astucia", description: "Inteligencia, Percepção." },
                        { label: "Manha", value: "manha", description: "Destreza, Agilidade." },
                        { label: "Ardil", value: "ardil", description: "Carisma, Labia." },
                        { label: "Humanidade", value: "humanidade", description: "Humanidade, Sanidade." },
                    ]
                })
            ]
        })

        const rowMod = new ActionRowBuilder<StringSelectMenuBuilder>({
            components: [
                new StringSelectMenuBuilder({
                    customId: "mod-selector",
                    placeholder: "Escolha o mod:",
                    options: [
                        { label: "-5", value: "-5" },
                        { label: "-4", value: "-4" },
                        { label: "-3", value: "-3" },
                        { label: "-2", value: "-2" },
                        { label: "-1", value: "-1" },
                        { label: "0", value: "0" },
                        { label: "1", value: "1" },
                        { label: "2", value: "2" },
                        { label: "3", value: "3" },
                        { label: "4", value: "4" },
                        { label: "5", value: "5" },
                    ]
                })
            ]
        })

        const rowButtons = new ActionRowBuilder<ButtonBuilder>({
            components: [
                new ButtonBuilder({
                    customId: "check-button",
                    emoji: "🔍",
                    label: " Check",
                    style: ButtonStyle.Primary
                }),
                new ButtonBuilder({
                    customId: "attack-button",
                    emoji: "💥",
                    label: "Ataque",
                    style: ButtonStyle.Danger
                })
            ]
        })
        interaction.reply({ embeds: [embed], components: [rowAttributes, rowMod, rowButtons], ephemeral: true })
    },

    buttons: new Collection([
        ["attack-button", async (buttonInteraction) => {
            const { user } = buttonInteraction
            buttonInteraction.reply({ content: `${user.username} atacou!` })
        }],
        ["check-button", async (buttonInteraction) => {
            const { user } = buttonInteraction
            buttonInteraction.reply({ content: `${user.username} Checkou!` })
        }]
    ]),

    selects: new Collection([
        ["attribute-selector", async (selectInteraction) => {
            const { user } = selectInteraction

            const attribute = selectInteraction.values[0];
            selectInteraction.reply({ content: `${user.username} selecionou o Atributo: ${attribute} !` })
        }],
        ["mod-selector", async (selectInteraction) => {
            const { user } = selectInteraction
            const mod = selectInteraction.values[0];
            selectInteraction.reply({ content: `${user.username} selecionou o Mod: ${mod} !` })
        }]])

})

function getCharacter(interaction: CommandInteraction) {
    // Should get the character from quickDB based on user
    return {
        user: interaction.user,
        name: "A NUVEM",
        PV: "100",
        forca: "20",
        astucia: "19",
        manha: "18",
        ardil: "17",
        humanidade: "16",
        aprendizados: {
            forca: "5",
            astucia: "4",
            manha: "3",
            ardil: "2"
        },
        creditos: "999999999",
        perolas: "999",
        color: "Gold",
        thumbURL: "https://cdn.discordapp.com/attachments/1089306678668824628/1095522105501691914/photo_4990252059920017634_x.jpg"

    }
}