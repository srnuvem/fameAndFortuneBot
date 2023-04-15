import { ApplicationCommandOptionType, ApplicationCommandType, Collection, TextChannel } from "discord.js";
import { QuickDB } from "quick.db";
import { buildFichaComponents, buildFichaCreationComponents, buildFichaCreationEmbed, buildFichaEmbed, buildFichaModal } from "../../helpers/fichaHelper";
import { formatResult, rollD20 } from "../../helpers/formattersHelper";
import { buildAtaqueEmbed, buildCheckEmbed, buildHumanityLostEmbed, buildLvlUpEmbed, updateAprendizados, updateHumanidade } from "../../helpers/rolagemHelper";
import { Character } from "../../structs/types/Character";
import { Command } from "../../structs/types/Command";

const db = new QuickDB();

export default new Command({
    name: "dados",
    description: "Envia a ficha do personagem.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuario",
            description: "Usuario",
            type: ApplicationCommandOptionType.User,
        }
    ],
    async run({ interaction, options, client }) {
        try {
            if (!interaction.channel) return;

            // Define se a mensagem é efemera ou nao baseado no nome do canal
            const channel = interaction.channel as TextChannel;
            const ephemeral = !channel.name.includes('ficha');
            const categoryId = channel?.parent?.id;

            const userId = options?.getUser("usuario")?.id;
            const characterId = "character/"+categoryId + "-" + (userId || interaction.user.id)

            const embed = await buildFichaEmbed(characterId)

            const components = ephemeral && !userId ? await buildFichaComponents() : undefined

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
                const channel = selectInteraction.channel as TextChannel;
                const categoryId = channel?.parent?.id;
                const userId = selectInteraction.user.id;
                const characterId = "character/"+categoryId + "-" + userId;

                const character: Character = await db.get(characterId) as Character;
                character.selectedAtt = attribute;
                await db.set(characterId, character)
            } catch (error) {
                console.log(`An error occurred: ${error}`.red);
            }
        }],
        ["mod-selector", async (selectInteraction) => {
            try {

                const { user } = selectInteraction
                const mod = selectInteraction.values[0];
                selectInteraction.deferUpdate()
                const channel = selectInteraction.channel as TextChannel;
                const categoryId = channel?.parent?.id;
                const userId = selectInteraction.user.id;
                const characterId = "character/"+categoryId + "-" + userId;

                const character: Character = await db.get(characterId) as Character;
                character.selectedMod = parseInt(mod);
                await db.set(characterId, character)
            } catch (error) {
                console.log(`An error occurred: ${error}`.red);
            }
        }]]),
    buttons: new Collection([
        ["attack-button", async (buttonInteraction) => {
            try {
                const channel = buttonInteraction.channel as TextChannel;
                const categoryId = channel?.parent?.id;
                const userId = buttonInteraction.user.id;
                const characterId = "character/"+categoryId + "-" + userId;

                const embed = await buildAtaqueEmbed(characterId);
                const fichaEmbed = await buildFichaEmbed(characterId);

                await buttonInteraction.update({ embeds: [fichaEmbed], components: [] });
                await buttonInteraction.followUp({ embeds: [embed] })
            } catch (error) {
                console.log(`An error occurred: ${error}`.red);
            }
        }],
        ["check-button", async (buttonInteraction) => {
            try {
                const channel = buttonInteraction.channel as TextChannel;
                const categoryId = channel?.parent?.id;
                const userId = buttonInteraction.user.id;
                const characterId = "character/"+categoryId + "-" + userId;

                let character: Character = await db.get(characterId) as Character;

                const rolagem = rollD20();
                const attValue = character?.selectedAtt ? character[character?.selectedAtt] : 0
                const modValue = character?.selectedMod | 0;
                const result = formatResult(rolagem, attValue, modValue);


                const checkEmbed = await buildCheckEmbed(result, character, rolagem, attValue, modValue);

                let levelUP = false;
                let humanityLoss = false;
                if (result.includes("FALHA")) {
                    if (character.selectedAtt === "humanidade") {
                        humanityLoss = await updateHumanidade(characterId)
                    } else {
                        levelUP = await updateAprendizados(characterId);
                    }
                }

                const fichaEmbed = await buildFichaEmbed(characterId);
                await buttonInteraction.update({ embeds: [fichaEmbed], components: [] });

                await buttonInteraction.followUp({ embeds: [checkEmbed] })

                if (levelUP) {
                    await buttonInteraction.followUp({ embeds: [await buildLvlUpEmbed(character)] })
                }

                if (humanityLoss) {
                    await buttonInteraction.followUp({ embeds: [await buildHumanityLostEmbed(character)] })
                }



            } catch (error) {
                console.log(`An error occurred: ${error}`.red);
            }
        }], ["editar-ficha", async (buttonInteraction) => {
            try {

                const userId = buttonInteraction.user.id;
                const channel = buttonInteraction.channel as TextChannel;
                const categoryId = channel.parent?.id;

                const characterId = "character/"+categoryId + "-" + userId;

                await db.set("editCharacter/" + userId, characterId);
                buttonInteraction.showModal(await buildFichaModal(characterId))
            } catch (error) {
                console.log(`An error occurred: ${error}`.red);
            }
        }]
    ])

})

