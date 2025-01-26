import * as React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import {LineChart, LinePlot} from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';

import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import Investment from "../../repo/Investment";
import Util from "../../functionalities/Util";


export const Chart = (props) => {


    return (
        <LineChart
            margin={{
                left: 80,
            }}
            height={500}
            series={props.series}
            xAxis={[
                {
                    id: 'years',
                    data: props.monthData,
                    scaleType: 'band',
                    valueFormatter: (value) => value.toString(),
                },
            ]}
            yAxis={[
                {
                    id: 'eco',
                    scaleType: 'linear',
                },
                {
                    id: 'pib',
                    scaleType: 'log',
                },
            ]}
        />
    );
}