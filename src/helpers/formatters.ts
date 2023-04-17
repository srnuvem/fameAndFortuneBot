export function rollD20() {
    const min = 1;
    const max = 20;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatResult(roll: number, attValue: number, modValue: number) {
    if (roll === 1) {
        return "CRITICO";
    }
    if (roll === 20) {
        return "FALHA CRITICA";
    }

    return roll <= attValue + modValue ? "SUCESSO" : "FALHA"
}

export function getColor(result: string) {
    switch (result) {
        case 'SUCESSO':
            return 0x01cbf3;
        case 'CRITICO':
            return 0x00ff51;
        case 'FALHA':
            return 0xf30135;
        case 'FALHA CRITICA':
            return 0x000000;
        default:
            return 0xffffff;
    }
}

export function formatAtt(att: string) {

    switch (att) {
        case 'forca':
            return "Força"
        case 'astucia':
            return "Astúcia"
        case 'manha':
            return "Manha"
        case 'ardil':
            return "Ardil"
        case 'humanidade':
            return "Humanidade"
    }


}

export function getHealthEmoji(PV: number, maxPV: number) {
    if (PV === maxPV) {
        return "❤️"
    }

    if (PV > 0) {
        return "❤️‍🩹";
    }

    if (PV === 0) {
        return "😵";
    }

    if (PV < 0 && PV > -10) {
        return "⚰️";
    }

    if (PV < -10) {
        return "💀";
    }
}

export function formatAprendizados(aprendizados: number): string {
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

export function formatChannelName(characterName: string) {
    return `ficha-${characterName.replace(/\s+/g, '-').toLowerCase()}`;
}