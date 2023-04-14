import { ApplicationCommandType, Collection } from "discord.js";
import { QuickDB } from "quick.db";
import { buildFichaComponents, buildFichaCreationComponents, buildFichaCreationEmbed, buildFichaEmbed, buildFichaModal } from "../../helpers/fichaHelper";
import { formatResult, rollD20 } from "../../helpers/formattersHelper";
import { buildAtaqueEmbed, buildCheckEmbed, buildLvlUpEmbed, updateAprendizados } from "../../helpers/rolagemHelper";
import { Character } from "../../structs/types/Character";
import { Command } from "../../structs/types/Command";

const db = new QuickDB();

export default new Command({
    name: "dados",
    description: "Envia a ficha do personagem.",
    type: ApplicationCommandType.ChatInput,
    async run({ interaction }) {
        try {
            const embed = await buildFichaEmbed(interaction.user.id)

            // Define se a mensagem é efemera ou nao baseado no nome do canal
            const channel: any = interaction.channel;
            const ephemeral = !channel.name.includes('ficha')

            const components = ephemeral ? await buildFichaComponents() : undefined

            interaction.reply({ embeds: [embed], components, ephemeral }).then(repliedMessage => { setTimeout(() => repliedMessage.delete(), 300000); })
        } catch (error) {
            console.log(`Ficha Não encontrada: ${error}`.red);
            const embed = await buildFichaCreationEmbed();
            const components = await buildFichaCreationComponents();
            await interaction.reply({ embeds: [embed], components, ephemeral: true })
        }
    },
    selects: new Collection([
        ["attribute-selector", async (selectInteraction) => {
            try {
                const attribute = selectInteraction.values[0];
                selectInteraction.deferUpdate()
                const character: Character = await db.get(selectInteraction.user.id) as Character;
                character.selectedAtt = attribute;
                await db.set(selectInteraction.user.id, character)
            } catch (error) {
                console.log(`An error occurred: ${error}`.red);
            }
        }],
        ["mod-selector", async (selectInteraction) => {
            try {

                const { user } = selectInteraction
                const mod = selectInteraction.values[0];
                selectInteraction.deferUpdate()
                const character: Character = await db.get(selectInteraction.user.id) as Character;
                character.selectedMod = parseInt(mod);
                await db.set(selectInteraction.user.id, character)
            } catch (error) {
                console.log(`An error occurred: ${error}`.red);
            }
        }]]),
    buttons: new Collection([
        ["attack-button", async (buttonInteraction) => {
            try {
                const embed = await buildAtaqueEmbed(buttonInteraction.user.id);
                const fichaEmbed = await buildFichaEmbed(buttonInteraction.user.id);

                await buttonInteraction.update({ embeds: [fichaEmbed], components: [] });
                await buttonInteraction.followUp({ embeds: [embed] })
            } catch (error) {
                console.log(`An error occurred: ${error}`.red);
            }
        }],
        ["check-button", async (buttonInteraction) => {
            try {
                let character: Character = await db.get(buttonInteraction.user.id) as Character;

                const rolagem = rollD20();
                const attValue = character?.selectedAtt ? character[character?.selectedAtt] : 0
                const modValue = character?.selectedMod | 0;
                const result = formatResult(rolagem, attValue, modValue);


                const checkEmbed = await buildCheckEmbed(result, character, rolagem, attValue, modValue);

                let levelUP = false;
                if (result.includes("FALHA")) {
                    levelUP = await updateAprendizados(buttonInteraction.user.id);
                }

                const fichaEmbed = await buildFichaEmbed(buttonInteraction.user.id);
                await buttonInteraction.reply({ embeds: [fichaEmbed], components: [], ephemeral: true });

                await buttonInteraction.followUp({ embeds: [checkEmbed] })

                if (levelUP) {
                    await buttonInteraction.followUp({ embeds: [await buildLvlUpEmbed(character)] })
                }



            } catch (error) {
                console.log(`An error occurred: ${error}`.red);
            }
        }], ["editar-ficha", async (buttonInteraction) => {
            try {
                buttonInteraction.showModal(await buildFichaModal(buttonInteraction.user.id))
            } catch (error) {
                console.log(`An error occurred: ${error}`.red);
            }
        }]
    ])

})

