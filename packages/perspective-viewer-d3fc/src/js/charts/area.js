/******************************************************************************
 *
 * Copyright (c) 2017, the Perspective Authors.
 *
 * This file is part of the Perspective library, distributed under the terms of
 * the Apache License 2.0.  The full license can be found in the LICENSE file.
 *
 */
import * as fc from "d3fc";
import {axisFactory} from "../axis/axisFactory";
import {chartSvgFactory} from "../axis/chartFactory";
import {AXIS_TYPES} from "../axis/axisType";
import {areaSeries} from "../series/areaSeries";
import {seriesColors} from "../series/seriesColors";
import {splitAndBaseData} from "../data/splitAndBaseData";
import {colorLegend} from "../legend/legend";
import {filterData} from "../legend/filter";
import withGridLines from "../gridlines/gridlines";

import {hardLimitZeroPadding} from "../d3fc/padding/hardLimitZero";
import zoomableChart from "../zoom/zoomableChart";
import nearbyTip from "../tooltip/nearbyTip";

function areaChart(container, settings) {
    const data = splitAndBaseData(settings, filterData(settings));

    const color = seriesColors(settings);
    const legend = colorLegend()
        .settings(settings)
        .scale(color);

    const series = fc.seriesSvgRepeat().series(areaSeries(settings, color).orient("vertical"));

    const xAxis = axisFactory(settings)
        .excludeType(AXIS_TYPES.linear)
        .settingName("crossValues")
        .valueName("crossValue")(data);
    const yAxis = axisFactory(settings)
        .settingName("mainValues")
        .valueName("mainValue")
        .excludeType(AXIS_TYPES.ordinal)
        .orient("vertical")
        .include([0])
        .paddingStrategy(hardLimitZeroPadding())(data);

    const chart = chartSvgFactory(xAxis, yAxis).plotArea(withGridLines(series).orient("vertical"));

    chart.yNice && chart.yNice();

    const zoomChart = zoomableChart()
        .chart(chart)
        .settings(settings)
        .xScale(xAxis.scale);

    const toolTip = nearbyTip()
        .settings(settings)
        .xScale(xAxis.scale)
        .yScale(yAxis.scale)
        .color(color)
        .data(data);

    // render
    container.datum(data).call(zoomChart);
    container.call(toolTip);
    container.call(legend);
}
areaChart.plugin = {
    type: "d3_y_area",
    name: "[d3fc] Y Area Chart",
    max_size: 25000
};

export default areaChart;
