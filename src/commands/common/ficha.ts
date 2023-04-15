import { ApplicationCommandType, CategoryChannel, ChannelType, Collection, MessageCreateOptions, MessagePayload, TextChannel, spoiler } from "discord.js";
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
            const characterId = "character/"+categoryId + "-" + userId;

            await db.set("editCharacter/" + userId, characterId);

            const modal = await buildFichaModal(characterId)
            interaction.showModal(modal);

        } catch (error) {
            console.log(`Um erro ocorreu: ${error}`.red);
        }
    },
    modals: new Collection([["form-ficha", async (modalInteraction) => {
        try {
            const { fields } = modalInteraction;

            const characterId: string = await db.get("editCharacter/" + modalInteraction.user.id) as string;
            let character: Character = await db.get(characterId) as Character;
            const categoryId = characterId.substring(characterId.indexOf("/")+1, characterId.indexOf("-"));

            const guild = modalInteraction.guild;
            const category = guild?.channels.cache.get(categoryId) as CategoryChannel;
            const channelName = formatChannelName(fields.getTextInputValue("form-ficha-name-input"));
            let channel = guild?.channels.cache.find(c => c.name === channelName) as TextChannel;

            const newCharacter = !character;
            if (newCharacter) character = new CharacterClass();

            character.characterId = characterId;

            character.userId = modalInteraction.user.id;
            character.name = fields.getTextInputValue("form-ficha-name-input");

            character.forca = parseInt(fields.getTextInputValue("form-ficha-forca-input"));
            character.astucia = parseInt(fields.getTextInputValue("form-ficha-astucia-input"));
            character.manha = parseInt(fields.getTextInputValue("form-ficha-manha-input"));
            character.ardil = parseInt(fields.getTextInputValue("form-ficha-ardil-input"));
            character.maxPV = character?.forca * 5;
            character.PV = character?.maxPV;

            if (newCharacter && !channel) {
                channel = await guild?.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone,
                            deny: "ViewChannel"
                        },
                        {
                            id: modalInteraction.user.id,
                            allow: "ViewChannel"
                        }
                    ]
                }) as TextChannel;

                character.channelId = channel.id as string;
                character.guildId = channel.guildId as string;
            }

            await db.set(characterId, character)

            const embed = await buildFichaEmbed(characterId);
            await modalInteraction.reply({ embeds: [embed] });

            if(newCharacter){
                await channel.send({embeds: [embed], silent: true } as MessageCreateOptions).then(sentMessage => {
                    setTimeout(() => sentMessage.delete(), 10000);
                })
            }

        } catch (error) {
            console.log(`Um erro ocorreu: ${error}`.red);

        }
    }

    ]])
})


export function formatChannelName(characterName: string) {
    return `ficha-${characterName.replace(/\s+/g, '-').toLowerCase()}`;
}