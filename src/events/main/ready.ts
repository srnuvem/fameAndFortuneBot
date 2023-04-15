import { MessageCreateOptions, TextChannel } from "discord.js";
import { QuickDB } from "quick.db";
import { client } from "../..";
import { buildFichaEmbed } from "../../helpers/fichaHelper";
import { Character } from "../../structs/types/Character";
import { Event } from "../../structs/types/Event";
const db = new QuickDB();

export default new Event({
    name: "ready",
    once: true,
    async run() {

        const { commands, buttons, selects, modals } = client;

        console.log("✅ Bot online".green);
        console.log(`Commands loaded: ${commands.size}`.cyan);
        console.log(`Buttons loaded: ${buttons.size}`.cyan);
        console.log(`Select Menus loaded: ${selects.size}`.cyan);
        console.log(`Modals loaded: ${modals.size}`.cyan);
        db.set("running", "Yes");
        db.get("running").then(value => console.log(`QuickDB running: ${value}`.cyan))


        setInterval(async () => {
            const entries = await db.all();
            const characterEntries = entries.filter(entry => entry.id.includes('character'));
            characterEntries.forEach(async char => {
                const character = char.value as Character;
                const guild = client.guilds.cache.get(character.guildId);
                let channel = guild?.channels.cache.find(c => c.id === character.channelId) as TextChannel;
                const embed = await buildFichaEmbed(character.characterId);

                channel.send({ embeds: [embed], silent: true } as MessageCreateOptions).then(sentMessage => {
                    setTimeout(() => sentMessage.delete(), 29000);
                })
            })
        }, 30000)
    },
})