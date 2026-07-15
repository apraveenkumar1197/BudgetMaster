import * as React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import {LineChart, LinePlot} from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';

import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import Investment from "../../repo/Investment";
import Util from "../../functionalities/Util";
import { Card, CardContent, Box, useMediaQuery, useTheme } from "@mui/material";


export const Chart = (props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Card sx={{ minWidth: 0 }}>
            <CardContent>
                <Box sx={{ width: '100%' }}>
                    <LineChart
                        margin={{
                            left: isMobile ? 45 : 80,
                        }}
                        height={isMobile ? 300 : 500}
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
                </Box>
            </CardContent>
        </Card>
    );
}