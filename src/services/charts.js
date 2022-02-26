import { DateTime, Interval } from "luxon";
import { formatNumber } from "./number";

export function commonChartOptions() {
    return {
        chart: {
            type: "area",
            stacked: false,
            height: 350,
            zoom: {
                zoom: {
                    type: "x",
                    enabled: true,
                    autoScaleYaxis: true,
                },
                toolbar: {
                    autoSelected: "zoom",
                },
            },
        },
        xaxis: {
            labels: {
                formatter(val) {
                    return DateTime.fromMillis(val)
                        .toFormat("MMM d ha")
                        .toLowerCase();
                },
            },
          type: "datetime",
        },
        yaxis: {
            forceNiceScale: true,
            labels: {
                formatter(val) {
                  return formatNumber(val)
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        _colors: ['#00b3c8', '#df7d46', '#CED4DC'],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 100],
            },
        },
        legend: {
            horizontalAlign: "left",
            labels: {
                color: ["#fff"],
            },
            show: true,
        },
        theme: {
            palette: "palette4",
        },
        background: "transparent",
        grid: {
            show: true,
            borderColor: "#ffffff11",
        },
    }
}

export function commonChartSeries(items, { timeUnit, timeSize, numCandles, onEmpty, onData }) {
    if (items.length === 0) return [];

    timeUnit = timeUnit || "hour";
    timeSize = timeSize || 1;
    numCandles = numCandles || 24 * 7;

    const rightBound = Interval.fromISO(
        items[items.length - 1].interval
    ).start;

    const leftBound = DateTime.max(
        rightBound.minus({ [timeUnit]: numCandles }),
        Interval.fromISO(items[0].interval).start
    );

    let data = [];
    let step = leftBound;
    let candleIndex = 0;
    let lastCandle;

    while (step <= rightBound && candleIndex < items.length) {
        const candle = items[candleIndex];
        const candleStart = Interval.fromISO(candle.interval).start;

        let skip = false;

        if (step.valueOf() < candleStart.valueOf()) {
            if (lastCandle) {
                const d = onEmpty(step, lastCandle)
                data.push(d);
            }

            step = step.plus({ [timeUnit]: timeSize });
            skip = true;
        }

        if (step.valueOf() > candleStart.valueOf()) {
            candleIndex++;
            skip = true;
        }

        if (skip) continue;

        const d = onData(step, candle)
        data.push(d);
        lastCandle = candle;

        step = step.plus({ [timeUnit]: timeSize });
        candleIndex++;
    }

    return data
}
