import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Util from '../../functionalities/Util';

export const DashiPieChart = (props) => {
    const formatter = Util.numberFormatter();
    const [chartData, setChartData] = React.useState([]);

    React.useEffect(() => {
        if (props.list && props.list.length > 0) {
            const data = props.list.map((item, index) => ({
                id: index,
                value: item.amount,
                label: item.category
            }));
            setChartData(data);
        }
    }, [props.list]);

    return (
        <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                    {props.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                    {chartData.length > 0 ? (
                        <PieChart
                            series={[
                                {
                                    data: chartData,
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    //faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                    //innerRadius: 20,
                                    //outerRadius: 100,
                                    //paddingAngle: 0,
                                    //cornerRadius: 5,
                                    //startAngle: -90,
                                    //endAngle: 180,
                                    //cx: 150,
                                    //cy: 150,
                                },
                            ]}
                            width={400}
                            height={300}
                            slotProps={{
                                legend: { hidden: true },
                            }}
                        />
                    ) : (
                        <Typography color="text.secondary">No data available</Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};
