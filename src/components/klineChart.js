import React, { useEffect } from 'react'
import { init, dispose } from 'klinecharts'
import KlineLayout from "./structure/klineLayout";
import {ThemeContext} from "./structure/themeContext";

const fruits = [
    '🍏', '🍎', '🍐', '🍊', '🍋', '🍌',
    '🍉', '🍇', '🍓', '🍈', '🍒', '🍑',
    '🍍', '🥥', '🥝', '🥭', '🥑', '🍏'
]

// 自定义指标
const emojiTechnicalIndicator = {
    name: 'EMOJI',
    plots: [
        { key: 'emoji' }
    ],
    calcTechnicalIndicator: (kLineDataList) => {
        const result = []
        kLineDataList.forEach(kLineData => {
            result.push({ emoji: kLineData.close, text: fruits[Math.floor(Math.random() * 17)] })
        })
        return result
    },
    render: ({
                 ctx,
                 dataSource,
                 viewport,
                 xAxis,
                 yAxis
             }) => {
        ctx.font = `${viewport.barSpace}px Helvetica Neue`
        ctx.textAlign = 'center'
        for (let i = dataSource.from; i < dataSource.to; i++) {
            const data = dataSource.technicalIndicatorDataList[i]
            const x = xAxis.convertToPixel(i)
            const y = yAxis.convertToPixel(data.emoji)
            ctx.fillText(data.text, x, y)
        }
    }
}

const mainTechnicalIndicatorTypes = ['MA', 'EMA', 'SAR']
const subTechnicalIndicatorTypes = ['VOL', 'MACD', 'KDJ']

export default function KlineChart ({dataInput}) {
    let kLineChart
    let paneId
    const { theme } = React.useContext(ThemeContext);

    useEffect(() => {
        kLineChart = init('technical-indicator-k-line')
        // 将自定义技术指标添加到图表
        kLineChart.addTechnicalIndicatorTemplate(emojiTechnicalIndicator)
        // paneId = kLineChart.createTechnicalIndicator('VOL', false)
        kLineChart.applyNewData(dataInput)
        kLineChart.setStyleOptions(getThemeOptions(theme))
        return () => {
            dispose('technical-indicator-k-line')
        }
    }, [dataInput, theme])


    const textColorDark = '#929AA5'
    const gridColorDark = '#0d1117'
    const axisLineColorDark = '#333333'
    const crossTextBackgroundColorDark = '#373a40'
    const candleUpColorDark = '#dddddd'
    const candleDownColorDark = '#dddddd'
    const lastColorDark = '#777777'

    const textColorLight = '#76808F'
    const gridColorLight = '#ffffff'
    const axisLineColorLight = '#DDDDDD'
    const crossTextBackgroundColorLight = '#686d76'
    const candleUpColorLight = '#333333'
    const candleDownColorLight = '#333333'
    const lastColorLight = '#aaaaaa'

    function getThemeOptions (theme) {
        const textColor = theme === 'dark' ? textColorDark : textColorLight
        const gridColor = theme === 'dark' ? gridColorDark : gridColorLight
        const axisLineColor = theme === 'dark' ? axisLineColorDark : axisLineColorLight
        const crossLineColor = theme === 'dark' ? axisLineColorDark : axisLineColorLight
        const crossTextBackgroundColor = theme === 'dark' ? crossTextBackgroundColorDark : crossTextBackgroundColorLight
        const candleUpColor = theme === 'dark' ? candleUpColorDark : candleUpColorLight
        const candleDownColor = theme === 'dark' ? candleDownColorDark : candleDownColorLight
        const candleStyle = theme === 'dark' ? 'candle_down_stroke' : 'candle_down_stroke'
        const lastColor = theme === 'dark' ? lastColorDark : lastColorLight
        return {
            grid: {
                horizontal: {
                    color: gridColor
                },
                vertical: {
                    color: gridColor
                }
            },
            candle: {
                type: candleStyle,
                bar: {
                    upColor: candleUpColor,
                    downColor: candleDownColor,
                    noChangeColor: '#888888'
                },
                priceMark: {
                    high: {
                        color: textColor,
                        family: 'Sans-serif',
                    },
                    low: {
                        color: textColor,
                        family: 'Sans-serif',
                    },
                    last: {
                        show: true,
                        upColor: lastColor,
                        downColor: lastColor,
                        noChangeColor: lastColor,
                        text: {
                            show: true,
                            family: 'Sans-serif',
                        }
                    }
                },
                tooltip: {
                    showRule: 'none',
                    text: {
                        color: textColor,
                        family: 'Sans-serif',
                    }
                }
            },

            technicalIndicator: {
                tooltip: {
                    text: {
                        color: textColor
                    }
                }
            },
            xAxis: {
                axisLine: {
                    color: axisLineColor
                },
                tickLine: {
                    color: axisLineColor,
                },
                tickText: {
                    color: textColor,
                    family: 'Sans-serif',
                }
            },
            yAxis: {
                axisLine: {
                    color: axisLineColor
                },
                tickLine: {
                    color: axisLineColor
                },
                tickText: {
                    color: textColor,
                    family: 'Sans-serif',
                }
            },
            separator: {
                color: axisLineColor
            },
            crosshair: {
                horizontal: {
                    line: {
                        color: crossLineColor
                    },
                    text: {
                        backgroundColor: crossTextBackgroundColor
                    }
                },
                vertical: {
                    line: {
                        color: crossLineColor
                    },
                    text: {
                        backgroundColor: crossTextBackgroundColor
                    }
                }
            }
        }
    }

    return (
        <KlineLayout
            title="">
            <div id="technical-indicator-k-line" className="k-line-chart h-screen-2/3"/>
        </KlineLayout>
    )
}