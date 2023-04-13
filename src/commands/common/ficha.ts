import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonInteraction, ButtonStyle, Collection, ColorResolvable, CommandInteraction, EmbedBuilder, Interaction, StringSelectMenuBuilder, User } from "discord.js";
import { Command } from "../../structs/types/Command";
import { Character } from "../../structs/types/Character";

const characters: Character[] = createCharacters();

export default new Command({
    name: "ficha",
    description: "Envia a ficha do personagem",
    type: ApplicationCommandType.ChatInput,
    run({ interaction }) {

        const character = getCharacters().filter(function (character) { return character.userId === interaction.user.id; })[0];

        // Define se a mensagem é efemera ou nao baseado no nome do canal
        const channel: any = interaction.channel;
        const ephemeral = !channel.name.includes('ficha')

        const embed = new EmbedBuilder()
            .setTitle(`${character?.name}`)
            .setDescription(`
            **Humanidade:** ${character.humanidade}     **PV:** ${character.PV} ❤️ 
            
            ${formatAprendizados(character.aprendizados.forca)} | **Força:** ${character.forca} 
            ${formatAprendizados(character.aprendizados.astucia)} | **Astucia:** ${character.astucia}  
            ${formatAprendizados(character.aprendizados.manha)} | **Manha:** ${character.manha}  
            ${formatAprendizados(character.aprendizados.ardil)} | **Ardil:** ${character.ardil}
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
                    emoji: "🎲",
                    label: " Check",
                    style: ButtonStyle.Secondary
                }),
                new ButtonBuilder({
                    customId: "attack-button",
                    emoji: "💥",
                    label: "Ataque",
                    style: ButtonStyle.Danger
                })
            ]
        })

        
        interaction.reply({ embeds: [embed], components: [rowAttributes, rowMod, rowButtons], ephemeral })
            .then(repliedMessage => {
                setTimeout(() => repliedMessage.delete(), 300000);
            })
    },
    selects: new Collection([
        ["attribute-selector", async (selectInteraction) => {
            try {
                const { user } = selectInteraction
                const attribute = selectInteraction.values[0];
                selectInteraction.deferUpdate()
                saveAtt(selectInteraction.user.id, attribute);
            } catch (error) {
                console.log(`An error occurred: ${error}`.red);
            }
        }],
        ["mod-selector", async (selectInteraction) => {
            try {

                const { user } = selectInteraction
                const mod = selectInteraction.values[0];
                selectInteraction.deferUpdate()
                saveMod(selectInteraction.user.id, mod);
            } catch (error) {
                console.log(`An error occurred: ${error}`.red);
            }
        }]]),

    buttons: new Collection([
        ["attack-button", async (buttonInteraction) => {
            const { user } = buttonInteraction
            try {
                const character = getCharacters().filter(function (character) { return character.userId === buttonInteraction.user.id; })[0];
                buttonInteraction.reply({ content: `${user.username} Atacou! ${character.selectedAtt} com mod: ${character.selectedMod}` })
            } catch (error) {
                console.log(`An error occurred: ${error}`.red);
            }
        }],
        ["check-button", async (buttonInteraction) => {
            const { user } = buttonInteraction
            try {
                const character = getCharacters().filter(function (character) { return character.userId === buttonInteraction.user.id; })[0];
                buttonInteraction.reply({ content: `${user.username} Checkou! ${character.selectedAtt} com mod: ${character.selectedMod}` })
            } catch (error) {
                console.log(`An error occurred: ${error}`.red);
            }
        }]
    ])

})

function saveAtt(userId: string, att: string) {
    // Change to update values in DB
    var character = characters.filter(function (character) { return character.userId === userId; })[0];;
    character.selectedAtt = att;

    characters.map(c => c.userId !== character.userId ? c : character);

    console.log('characters -> ', getCharacters());
    console.log(`att: ${att}`)
}

function saveMod(userId: string, mod: string) {
    // Change to update values in DB

    var character = characters.filter(function (character) { return character.userId === userId; })[0];;
    character.selectedMod = mod;

    console.log(character);

    characters.map(c => c.userId !== character.userId ? c : character);

    console.log('characters -> ', getCharacters());
    console.log(`mod: ${mod}`)
}


//Remove
function createCharacters() {
    // Should get all characters from quickDB
    return [{
        name: "A NUVEM",
        userId: "503691865103663104",
        PV: 100,
        forca: 20,
        astucia: 19,
        manha: 18,
        ardil: 17,
        humanidade: 16,
        aprendizados: {
            forca: 4,
            astucia: 3,
            manha: 2,
            ardil: 0
        },
        creditos: 999999999,
        perolas: 999,
        color: "Gold",
        thumbURL: "https://cdn.discordapp.com/attachments/1089306678668824628/1095522105501691914/photo_4990252059920017634_x.jpg"

    } as Character,
    {
        name: "Rubi",
        userId: "818864251044102144",
        PV: 40	,
        forca: 9,
        astucia: 5,
        manha: 6,
        ardil: 12,
        humanidade: 20,
        aprendizados: {
            forca: 2,
            astucia: 2,
            manha: 1,
            ardil: 3
        },
        creditos: 102.00,
        perolas: 3,
        color: "Red",
        thumbURL: "https://cdn.discordapp.com/attachments/1089301374942072933/1091782816464912414/Rubi.jpg"

    } as Character]
}

function getCharacters() {

    // change for get all characters from DB
    return characters;
}

function formatAprendizados(aprendizados: number): string {
    let formattedApprendizados = "";

    for (let i = 0; i < 5; i++) {
        if (aprendizados > 0) {
            formattedApprendizados += "✅"
        } else {
            formattedApprendizados += "⭕️"

        }
        aprendizados--;
    }
    return formattedApprendizados;
}