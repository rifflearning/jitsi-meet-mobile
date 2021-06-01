import { A11y, riffUtils } from '@rifflearning/riff-metrics';

const {
    Colors,
    PeerColors,
    getColorForOther,
    getColorForSelf,
    getColorMap,
    getCountOtherColors,
    rgbaColor
} = riffUtils.color;
const {
    cmpObjectProp,
    countByPropertyValue,
    groupByPropertyValue,
    mapObject,
    reverseCmp
} = riffUtils.collection;
const addA11yBrowserAlert = A11y.a11yAlert;

export {
    countByPropertyValue,
    groupByPropertyValue,
    mapObject,
    cmpObjectProp,
    reverseCmp,
    Colors,
    PeerColors,
    getColorForOther,
    getColorForSelf,
    getColorMap,
    getCountOtherColors,
    rgbaColor,
    addA11yBrowserAlert
};
