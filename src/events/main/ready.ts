import { ChannelType, MessageCreateOptions, TextChannel } from 'discord.js'
import { QuickDB } from 'quick.db'
import { client } from '../..'
import { buildFichaEmbed } from '../../helpers/fichaHelper'
import { Character } from '../../structs/types/Character'
import { Event } from '../../structs/types/Event'
import { updateDefaultCampaign } from '../../helpers/dbService'
const db = new QuickDB()

export default new Event({
    name: 'ready',
    once: true,
    async run() {
        const { commands, buttons, selects, modals } = client

        console.log('✅ Bot online')
        console.log(`✅ Commands loaded: ${commands.size}`)
        console.log(`✅ Buttons loaded: ${buttons.size}`)
        console.log(`✅ Select Menus loaded: ${selects.size}`)
        console.log(`✅ Modals loaded: ${modals.size}`)
        await db.set('running', '✅')
        console.log(`${await db.get('running')} QuickDB running`)

        setInterval(async () => {
            const entries = await db.all()
            // updateDefaultCampaign()
            const characterEntries = entries.filter((entry) => entry.id.includes('character'))

            characterEntries.forEach(async (char) => {
                const character = char.value as Character
                const guild = client.guilds.cache.get(character.guildId)
                let channel = guild?.channels.cache.find((c) => c.id === character.channelId) as TextChannel
                let channelN = guild?.channels.cache.find(
                    (c) => c.type === ChannelType.GuildText && c?.parentId === channel?.parentId && c.name.includes('narradora')
                ) as TextChannel
                    
                const embed = await buildFichaEmbed(character.characterId)

                try {
                    channel
                        .send({
                            embeds: [embed],
                            silent: true,
                        } as MessageCreateOptions)
                        .then((sentMessage) => {
                            setTimeout(() => sentMessage.delete(), 10000)
                        })
                        .catch()
                    channelN
                        .send({
                            embeds: [embed],
                            silent: true,
                        } as MessageCreateOptions)
                        .then((sentMessage) => {
                            setTimeout(() => sentMessage.delete(), 10000)
                        })
                } catch (error) {
                    console.log(`Canal não encontrado: ${error}`)
                }
            })
        }, 10000)
    },
})
