import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ColorResolvable, EmbedBuilder, ModalBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { QuickDB } from "quick.db";
import { Character } from "../structs/types/Character";
import { formatAprendizados, getHealthEmoji } from "./formattersHelper";

const db = new QuickDB();


export async function buildFichaEmbed(userId: string) {
    const character: Character = await db.get(userId) as Character;

    return new EmbedBuilder()
        .setTitle(`${character?.name}`)
        .setDescription(`
        **Humanidade:** ${character?.humanidade}     **PV:** ${character?.PV}/${character?.maxPV} ${getHealthEmoji(character?.PV, character?.maxPV)}
        
        ${formatAprendizados(character?.aprendizados.forca)} | **Força:** ${character?.forca} 
        ${formatAprendizados(character?.aprendizados.astucia)} | **Astucia:** ${character?.astucia}  
        ${formatAprendizados(character?.aprendizados.manha)} | **Manha:** ${character?.manha}  
        ${formatAprendizados(character?.aprendizados.ardil)} | **Ardil:** ${character?.ardil}
        \u200B
        **Creditos🪙:  ${character?.creditos}€$**   **Perolas🔮:  ${character?.perolas} CryPe**
        `)
        .setColor(character?.color as ColorResolvable)
        .setThumbnail(character?.thumbURL)
}

export async function buildFichaCreationEmbed() {
    return new EmbedBuilder()
        .setTitle("Criar ficha.")
        .setDescription("Você ainda não tem uma ficha criada, gostaria de criar?")
}

export async function buildFichaCreationComponents() {
    const row = new ActionRowBuilder<ButtonBuilder>({
        components: [
            new ButtonBuilder({
                customId: "editar-ficha",
                emoji: "✍️",
                label: "Ficha",
                style: ButtonStyle.Secondary
            })]
    });
    return [row]
}

export function buildFichaComponents() {
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

    return [rowAttributes, rowMod, rowButtons]

}


export async function buildFichaModal(userId: string) {
    const character: Character = await db.get(userId) as Character;

    const name = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-name-input',
                label: "Nome:",
                value: character?.name ? character?.name : undefined,
                placeholder: "Digite o nome do seu personagem 🪪",
                style: TextInputStyle.Short,
                maxLength: 50
            }),
        ]
    })

    const forca = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-forca-input',
                label: "Força",
                value: character?.forca ? character?.forca.toString() : undefined,
                placeholder: "Digite a sua força 💪❤️",
                style: TextInputStyle.Short,
                max_length: 2
            }),
        ]
    })

    const astucia = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-astucia-input',
                label: "Astúcia",
                value: character?.astucia ? character?.astucia.toString() : undefined,
                placeholder: "Digite a sua Astúcia 🧠👀",
                style: TextInputStyle.Short,
                max_length: 2

            }),
        ]
    })

    const manha = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-manha-input',
                label: "Manha",
                value: character?.manha ? character?.manha.toString() : undefined,
                placeholder: "Digite a sua Manha 🏃‍♀️🤾‍♂️",
                style: TextInputStyle.Short,
                max_length: 2

            }),
        ]
    })

    const ardil = new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                custom_id: 'form-ficha-ardil-input',
                label: "Ardil",
                value: character?.ardil ? character?.ardil.toString() : undefined,
                placeholder: "Digite o seu Ardil 🗨️👄",
                style: TextInputStyle.Short,
                max_length: 2

            }),
        ]
    })

    return new ModalBuilder({
        custom_id: 'form-ficha', title: "Crie sua personagem", components: [name, forca, astucia, manha, ardil]
    });
}