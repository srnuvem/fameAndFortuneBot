export function rollD20() {
    const min = 1
    const max = 20
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function formatResult(roll: number, attValue: number, modValue: number) {
    if (roll === 1) {
        return 'CRITICO'
    }
    if (roll === 20) {
        return 'FALHA CRITICA'
    }

    return roll <= attValue + modValue ? 'SUCESSO' : 'FALHA'
}

export function getColor(result: string) {
    switch (result) {
        case 'SUCESSO':
            return 0x01cbf3
        case 'CRITICO':
            return 0x00ff51
        case 'FALHA':
            return 0xf30135
        case 'FALHA CRITICA':
            return 0x000000
        default:
            return 0xffffff
    }
}

export function formatAtt(att: string) {
    switch (att) {
        case 'forca':
            return 'Força'
        case 'astucia':
            return 'Astúcia'
        case 'manha':
            return 'Manha'
        case 'ardil':
            return 'Ardil'
        case 'sanidade':
            return 'Sanidade'
    }
}

export function getHealthEmoji(pv: number, maxPv: number) {
    if (pv === maxPv) {
        return '❤️'
    }

    if (pv > 0) {
        return '❤️‍🩹'
    }

    if (pv === 0) {
        return '😵'
    }

    if (pv < 0 && pv > -10) {
        return '⚰️'
    }

    if (pv < -10) {
        return '💀'
    }
}

export function formatAprendizados(aprendizados: number): string {
    let formattedApprendizados = ''

    for (let i = 0; i < 5; i++) {
        if (aprendizados > 0) {
            formattedApprendizados += '✅'
        } else {
            formattedApprendizados += '⭕️'
        }
        aprendizados--
    }
    return formattedApprendizados
}

export function formatEstrelas(fama: number): string {
    let formattedFama = ''

    for (let i = 0; i < 5; i++) {
        if (fama > 0) {
            formattedFama += '🌟'
        } else {
            formattedFama += '🔸'
        }
        fama--
    }
    return formattedFama
}

export function formatFama(fama: number): string {
    let formattedFama = ''

    switch (fama) {
        case 0:
            return 'Ninguem'
        case 1:
            return 'Conhecidos do Bairro'
        case 2:
            return 'Conhecidos da cidade'
        case 3:
            return 'Lendas da cidade'
        case 4:
            return 'Famosos mundiais'
        case 5:
            return 'Lendas Mundiais'
    }
    return formattedFama
}

export function formatChannelName(characterName: string) {
    return `${characterName.replace(/\s+/g, '-').toLowerCase()}`
}
