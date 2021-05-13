import React, { useEffect, useState } from 'react';
import {
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Scatter,
    Surface,
    Symbols,
    ZAxis,
    ReferenceLine
} from 'recharts';
import moment from 'moment'
import * as d3 from 'd3-array';

const getBollingerBands = (n, k, data) => {
    if (n >= data.length) {
        return [];
    }
    const bands = []; //{ ma: 0, area:[0, 0] }
    for (let i = n - 1, len = data.length; i < len; i++) {
        const slice = data.slice(i + 1 - n, i);
        const mean = d3.mean(slice, function (d) {
            return d.classification;
        });

        const stdDev = Math.sqrt(
            d3.mean(
                slice.map(function (d) {
                    return Math.pow(d.classification - mean, 2);
                })
            )
        );
        bands.push({
            timestamp: new Date(data[i].timestamp).getTime(),
            ma: mean,
            area: [
                mean - k * stdDev,
                mean + k * stdDev
            ]
        });
    }
    return bands;
}

const getUserSpikes = (bbData, userData) => {
    //for future use
    let highSpike = [];
    let lowSpike = [];
    userData.forEach(el => {
        const date = moment(el.timestamp).format('HH:mm:ss');
        const sameTimeArr = bbData.filter(bbEl => moment(bbEl.timestamp).format('HH:mm:ss') === date);

        if (sameTimeArr.length) {
            sameTimeArr.forEach(data => {
                if (el.classification >= data.area[1]) {
                    highSpike.push({
                        timestamp: el.timestamp,
                        classification: el.classification
                    })
                } else if (el.classification <= data.area[0]) {
                    lowSpike.push({
                        timestamp: el.timestamp,
                        classification: el.classification
                    })
                }
            })
        }
    })
    return highSpike.concat(lowSpike)
}

const getMinMax = (arr) => ({ min: Math.min(...arr), max: Math.max(...arr) })

const Emoji = ({ symbol, label }) => (
    <span
        className='emotional-chart-emoji'
        role='img'
        aria-label={label ? label : ''}
        aria-hidden={label ? 'false' : 'true'}
    >
        {symbol}
    </span>
)


export default ({ data = [], participantId }) => {
    const [bandsData, setBandsData] = useState([]);
    const [currentUserData, setCurrentUserData] = useState([])
    const [spikes, setSpikes] = useState([]);
    const [domainY, setDomainY] = useState({ min: -1, max: 1 });

    const n = 20;
    const k = 2;

    const mapUserNamesToData = () => {
        // emotions data reduced by users: { [userId]: [arrayOfData] }
        const dataFormatted = data.reduce((acc, el) => {
            // for correct timeline we need time in unix format
            const elFormatted = {
                ...el,
                timestamp: new Date(el.timestamp).getTime()
            };
            if (acc[el.participant_id]) {
                acc[el.participant_id].push(elFormatted);
            } else {
                acc[el.participant_id] = [elFormatted];
            }
            return acc;
        }, {});

        const arrUids = Object.keys(dataFormatted);
        const userData = dataFormatted[participantId] || [];
        setCurrentUserData(userData);

        if (arrUids.length > 1) {
            const bollingerBandsData = getBollingerBands(n, k, data);
            const emotionSpikes = getUserSpikes(bollingerBandsData, userData);
            const bbClassificationArr = bollingerBandsData.length
                ? bollingerBandsData.reduce((acc, v) => acc = acc.concat([v.area[0]]).concat([v.area[1]]), [])
                : [];
            const classificationArr = bbClassificationArr.concat(userData.length ? userData.map(el => el.classification) : []);

            setBandsData(bollingerBandsData)
            setSpikes(emotionSpikes)
            setDomainY(getMinMax(classificationArr))
        }
    };

    useEffect(() => {
        mapUserNamesToData();
    }, [data, participantId]);

    const renderCusomizedLegend = ({ payload }) => {
        const renderedPayload = payload.filter(el => el.dataKey !== 'ma' && el.payload.data.length);

        return (
            <div className='amcharts-legend-container emotion-container'>
                {renderedPayload.map((el, i) => (
                    <span key={i} className='emotion-item'>
                        <Surface width={20} height={20}>
                            <Symbols
                                cx={10}
                                cy={10}
                                size={150}
                                fill={el.value === 'Your Emotion Area' ? 'url(#emotionLegend)' : el.color}
                                fillOpacity={el.payload.fillOpacity ? el.payload.fillOpacity : 1}
                            />
                        </Surface>
                        <div className='emotion-label' >{el.value}</div>
                    </span>
                ))}
            </div>
        )
    }

    const EmotionTick = props => {
        const emojiObj = {
            '1': <Emoji label='positive' symbol='🙂' />,
            '0': <Emoji label='neutral' symbol='😐' />,
            '-1': <Emoji label='negative' symbol='🙁' />,
        }

        return <foreignObject
            x={props.x - 25}
            y={props.y - 15}
            width={30}
            height={30}
            index={props.index}>
            {emojiObj[`${props.payload.value}`]}
        </foreignObject>
    }

    return (
        <ResponsiveContainer height={300}>
            <ComposedChart
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <defs>
                    <linearGradient id='emotionLegend' gradientTransform='rotate(90)'>
                        <stop offset='5%' stopColor='#ffdd21' />
                        <stop offset='75%' stopColor='#ff1a1a' />
                        <stop offset='100%' stopColor='#540d6e' />
                    </linearGradient>
                </defs>
                <defs>
                    <linearGradient id='emotion' x1='0%' y1='100%' x2='0%' y2='0%' gradientUnits='userSpaceOnUse'>
                        <stop offset='5%' stopColor='#540d6e' />
                        <stop offset='35%' stopColor='#983493' />
                        <stop offset='50%' stopColor='#ff1a1a' />
                        <stop offset='65%' stopColor='#ff8317' />
                        <stop offset='95%' stopColor='#ffdd21' />
                    </linearGradient>
                </defs>
                <YAxis
                    tick={<EmotionTick />}
                    padding={{ bottom: 10, top: 10 }}
                    ticks={[-1, 0, 1]}
                    domain={[domainY.min, domainY.max]}
                />
                <XAxis
                    allowDuplicatedCategory={false}
                    dataKey='timestamp'
                    domain={['minData', 'maxData']}
                    name='Time'
                    tickFormatter={(unixTime) => moment(unixTime).format('h:mm A')}
                    type='number'
                />
                {/* <Tooltip /> */}
                <Legend content={renderCusomizedLegend} />
                <Line
                    data={bandsData}
                    dataKey='ma'
                    stroke='#93759E'
                    isAnimationActive={false}
                    dot={false}
                    name='Average Emotion Line'
                />
                <Area
                    data={bandsData}
                    dataKey='area'
                    fill='#93759E'
                    stroke='#93759E'
                    fillOpacity='0.4'
                    legendType='line'
                    isAnimationActive={false}
                    dot={false}
                    name='Participants Emotion Area'
                />

                <Area
                    dataKey='classification'
                    name='Your Emotion Area'
                    data={currentUserData}
                    dot={false}
                    fill='url(#emotion)'
                    stroke='url(#emotion)'
                    strokeWidth='1px'
                    fillOpacity='0.6'
                />
                {/* for scatter size */}
                <ZAxis range={[45, 45]} />
                <Scatter
                    name='Your Emotion Spike'
                    data={spikes}
                    dataKey='classification'
                    strokeWidth={0}
                    fill='#58d0ee' />
                <ReferenceLine
                    y={0}
                    strokeWidth={1}
                    strokeDasharray='3 3'
                    stroke='#716B74' />
            </ComposedChart>
        </ResponsiveContainer>
    );
}
