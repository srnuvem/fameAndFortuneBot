import { QuickDB } from 'quick.db'
import { Character } from '../structs/types/Character'
import { Campaign } from '../structs/types/Campaign'

const db = new QuickDB()

export async function setEditCharacterId(userId: string, characterId: string) {
    await db.set('editCharacter/' + userId, characterId)
}

export async function getEditCharacterId(userId: string): Promise<string> {
    return (await db.get('editCharacter/' + userId)) as string
}

export async function setEditCampaignId(userId: string, campaingId: string) {
    await db.set('editCampaign/' + userId, campaingId)
}

export async function getEditCampaignId(userId: string): Promise<string> {
    return (await db.get('editCampaign/' + userId)) as string
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
    return (await db.get(characterId)) as Character
}

export function getCharacterId(userId: string, categoryId: string, guildId: string): string {
    return 'character/' + guildId + '-' + categoryId + '-' + userId
}


export function getCampaignId(categoryId: string, guildId: string): string {
    return 'campaign/' + guildId + '-' + categoryId
}

export async function getCampaign(campaignId: string): Promise<Campaign> {
    return (await db.get(campaignId)) as Campaign
}

export async function updateCampaign(campaignId: string, campaign: Campaign) {
    await db.set(campaignId, campaign)
}