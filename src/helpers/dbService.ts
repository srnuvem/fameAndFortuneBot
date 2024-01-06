import { QuickDB } from 'quick.db';
import { Campaign } from '../structs/types/Campaign';
import { Character } from '../structs/types/Character';

const db = new QuickDB()


export async function updateDefaultCampaign() {
    // Chave e valor fornecidos
    const chave = 'campaign/1059652181743124480-1095393697023152158';
    const valor = {
        "textChannelId": "1063919333258035350",
        "voiceChannelId": "1059652181743124485",
        "categoryId": "1095393697023152158",
        "name": "WonderCity",
        "channelId": "",
        "guildId": "1059652181743124480",
        "moeda": "EuroDollar",
        "perola": "CryptoPerolas",
        "color": "Blue",
        "thumbURL": "https://media.discordapp.net/attachments/1099227289562124308/1179232939746275378/avatar-820029831.jpg",
        "fama": "1"
    };

    // Adicionando a chave e o valor ao banco de dados
    await db.set(chave, valor);
}

export async function setEditCharacterId(userId: string, characterId: string) {
    await db.set('editCharacter/' + userId, characterId)
}

export async function getEditCharacterId(userId: string): Promise<string> {
    const editCharacterId = await db.get('editCharacter/' + userId) as string
    return editCharacterId
}

export async function setEditCampaignId(userId: string, campaingId: string) {
    await db.set('editCampaign/' + userId, campaingId)
}

export async function getEditCampaignId(userId: string): Promise<string> {
    const editCampaignId = await db.get('editCampaign/' + userId) as string
    return editCampaignId
}

export async function updateCharacter(characterId: string, character: Character) {
    await db.set(characterId, character)
}

export async function killCharacter(characterId: string) {
    const deadId = characterId.replace('character', 'dead')
    const character = await db.get(characterId)
    await db.set(deadId, character)
    await db.delete(characterId)
}

export async function getCharacter(characterId: string): Promise<Character> {
    const character = await db.get(characterId) as Character
    return character
}

export function getCharacterId(userId: string, categoryId: string, guildId: string): string {
    return 'character/' + guildId + '-' + categoryId + '-' + userId
}


export function getCampaignId(categoryId: string, guildId: string): string {
    return 'campaign/' + guildId + '-' + categoryId
}

export async function getCampaign(campaignId: string): Promise<Campaign> {
    const campaign = await db.get(campaignId) as Campaign
    return campaign
}

export async function updateCampaign(campaignId: string, campaign: Campaign) {
    await db.set(campaignId, campaign)
}