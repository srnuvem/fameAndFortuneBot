import { QuickDB } from "quick.db";
import { Character } from "../structs/types/Character";

const db = new QuickDB();

export async function setEditCharacterId(userId: string, characterId: string) {
    await db.set("editCharacter/" + userId, characterId);
}

export async function getEditCharacterId(userId: string): Promise<string> {
    return await db.get("editCharacter/" + userId) as string;
}

export async function updateCharacter(characterId: string, character: Character) {
    await db.set(characterId, character)
}

export async function getCharacter(characterId: string): Promise<Character> {
    return await db.get(characterId) as Character;
}