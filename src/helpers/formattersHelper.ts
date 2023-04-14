export function rollD20() {
    let min = 1;
    let max = 20;
    let mathLogic = Math.floor(Math.random() * (max - min + 1)) + min;
    return mathLogic
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