const Colors = {
    black: '#000000',
    mineShaft: '#333333',
    tundora: '#4a4a4a',
    riffVioletDark: '#775e80',
    riffViolet: '#93759e',
    deepRed: '#ab0000',
    lightGrey: '#d3d3d3',
    mischka: '#e0d8e3',
    deepBlush: '#e380a1',
    darkYellow: '#f6da5c',
    purpleLight: '#F8EFFC',
    selago: '#f8effc',
    white: '#ffffff',
    scorpion: '#5a5a5a',
    doublePear: '#fcf1cd',
    iceBlue: '#eff9f9',
    zanah: '#e3f1df',
    starDust: "#8f8f8f",
    silver: '#c4c4c4',
    mercury: '#e5e5e5',
    riffVioletMedium: '#be99cb'
};

const PeerColors = [
    Colors.selago,
    Colors.riffVioletMedium,
    Colors.mercury,
    Colors.silver,
    Colors.starDust,
    Colors.scorpion,
    Colors.eggplant,
    Colors.darkFern,
    Colors.aquamarine,
];

const gradientColor = [
    
]

function getColorForSelf() {
    return PeerColors[0];
}

function getColorForOther(n) {
    const i = n % (PeerColors.length - 1) + 1;
    return PeerColors[i];
}

function getColorMap(setIds, selfId) {
    if (setIds.size > PeerColors.length) {
        // This warning may be off by one because it assumes that selfId is in setIds
        logger.warn(`getColorMap: Not enough distinct colors (${PeerColors.length}) for all ids (${setIds.size})`);
    }

    const colorMap = new Map();
    let i = 0;
    for (const id of setIds) {
        if (id === selfId) {
            colorMap.set(id, getColorForSelf());
        }
        else {
            colorMap.set(id, getColorForOther(i));
            i++;
        }
    }

    return colorMap;
}

export {
    Colors,
    PeerColors,
    getColorForSelf,
    getColorForOther,
    getColorMap,
};