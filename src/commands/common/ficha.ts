import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonInteraction, ButtonStyle, Collection, ColorResolvable, CommandInteraction, ComponentType, EmbedBuilder, Interaction, StringSelectMenuBuilder, User } from "discord.js";
import { Command } from "../../structs/types/Command";
import { Character } from "../../structs/types/Character";

const characters: Character[] = createCharacters();

export default new Command({
    name: "ficha",
    description: "Envia a ficha do personagem",
    type: ApplicationCommandType.ChatInput,
    run({ interaction }) {

        const character = getCharacters().filter(function (character) { return character.userId === interaction.user.id; })[0];

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
                        { label: "Astúcia", value: "astucia", description: "Inteligência, Percepção." },
                        { label: "Manha", value: "manha", description: "Destreza, Agilidade." },
                        { label: "Ardil", value: "ardil", description: "Carisma, Lábia." },
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

        // Define se a mensagem é efemera ou nao baseado no nome do canal
        const channel: any = interaction.channel;
        const ephemeral = !channel.name.includes('ficha')

        // Esconde os componentes se a mensagem for efemera
        const components = ephemeral ? [rowAttributes, rowMod, rowButtons] : [];

        interaction.reply({ embeds: [embed], components, ephemeral})
            .then(repliedMessage => {
                // Apaga a mensagem depois de 5 min
                setTimeout(() => repliedMessage.delete(), 30000);
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
                saveMod(selectInteraction.user.id, parseInt(mod));
            } catch (error) {
                console.log(`An error occurred: ${error}`.red);
            }
        }]]),
    buttons: new Collection([
        ["attack-button", async (buttonInteraction) => {
            const { user } = buttonInteraction
            try {
                const character = getCharacters().filter(function (character) { return character.userId === buttonInteraction.user.id; })[0];
                const rolagem = rollD20();
                const attValue = character?.selectedAtt ? character[character.selectedAtt] : 0;
                const modValue = character?.selectedMod | 0;
                const total = rolagem + modValue;

                const embed = new EmbedBuilder()
                .setTitle(`${character?.name} atacou! ${character.selectedAtt}: ${total}`)
                .setDescription(`
                ${character.selectedAtt}: ${attValue}
                Modificador: ${modValue}
                Rolagem: ${rolagem}
                Ataque total: **${total}**`)
                .setColor("White")
                .setThumbnail(character.thumbURL)
                
                await buttonInteraction.update({components: []});
                await buttonInteraction.followUp({ embeds: [embed] })
            } catch (error) {
                console.log(`An error occurred: ${error}`.red);
            }
        }],
        ["check-button", async (buttonInteraction) => {
            const { user } = buttonInteraction
            try {
                const character = getCharacters().filter(function (character) { return character.userId === buttonInteraction.user.id; })[0];
                const rolagem = rollD20();
                const attValue = character?.selectedAtt ? character[character.selectedAtt] : 0
                const modValue = character?.selectedMod | 0;
                
                const result = calculateResult(rolagem, attValue, modValue);

                const embed = new EmbedBuilder()
                    .setTitle(`${result} ${character?.name} rolou: ${rolagem} em ${character.selectedAtt}`)
                    .setDescription(`
                ${character.selectedAtt}: ${attValue}
                Modificador: ${character.selectedMod}
                Dificuldade total: **${attValue + modValue}**`)
                    .setColor(getColor(result) as ColorResolvable)
                    .setThumbnail(character.thumbURL)

                    await buttonInteraction.update({components: []});
                    await buttonInteraction.followUp({ embeds: [embed] })

                // Adicionar update de aprendizado em caso de falha
                // Enviar comemoração de subida de nivel em caso de 5 aprendizados.
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
}

function saveMod(userId: string, mod: number) {
    // Change to update values in DB

    var character = characters.filter(function (character) { return character.userId === userId; })[0];;
    character.selectedMod = mod;

    characters.map(c => c.userId !== character.userId ? c : character);
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
        thumbURL: "https://media.discordapp.net/attachments/1095822353193242785/1096156443058643045/photo_4990252059920017634_x.jpg"

    } as Character,
    {
        name: "Rubi",
        userId: "818864251044102144",
        PV: 40,
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


export function rollD20() {
    let min = 1;
    let max = 20;
    let mathLogic = Math.floor(Math.random() * (max - min + 1)) + min;
    return mathLogic
}

export function calculateResult(roll: number, attValue: number, modValue: number) {
    if (roll === 1) {
        return "CRITICO";
    }
    if (roll === 20) {
        return "FALHA CRITICA";
    }

    return roll <= attValue + modValue ? "SUCESSO" : "FALHA"
}

export function getColor(result: string) {
    var color;
    switch (result) {
        case 'SUCESSO':
            color = 0x01cbf3;
            break;
        case 'CRITICO':
            color = 0x00ff51;
            break;
        case 'FALHA':
            color = 0xf30135;
            break;
        case 'FALHA CRITICA':
            color = 0x000000;
            break;
        default:
            color = 0xffffff;
    }
    return color;

}