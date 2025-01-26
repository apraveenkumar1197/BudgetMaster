import React, {Component} from "react";
import Box from "@mui/material/Box";
import MenuIcon from '@mui/icons-material/Menu';
import {
    AppBar,
    Button, CircularProgress, Container,
    Grid, IconButton,
    Stack, Toolbar, Typography
} from "@mui/material";
import {AddExpense} from "./Expense/AddExpense";
import {Storage} from "./Dashi/Storage";
import {InvestmentList} from "./Dashi/InvestmentList";
import {Chart} from "./Dashi/Chart";
import {Returns} from "./Dashi/Returns";
import {Due} from "./Dashi/Due";
import {MyInvestments} from "./Dashi/MyInvestments";
import DashiRepo from "../repo/DashiRepo";
import {PageLoader} from "../ui/PageLoader";
import {Loans} from "./Dashi/Loans";

export const Dashi = (props) => {
    const [series, setSeries] = React.useState([]);
    const [monthData, setMonthData] = React.useState([]);
    const [dues, setDues] = React.useState({});
    const [returns, setReturns] = React.useState({});
    const [myInvestments, setMyInvestments] = React.useState(false);

    const [loading, setLoading] = React.useState(true);

    const getChartData = () => {
        setLoading(true)
        DashiRepo.data()
            .then((res) => {
                setLoading(false)
                setDues(res.data.data.dues)
                setReturns(res.data.data.returns)
                setSeries([
                    {
                        type: 'line',
                        color: 'blue',
                        yAxisKey: 'eco',
                        data: res.data.data.chart.incomes,
                    },
                    {
                        type: 'line',
                        color: '#32faf3',
                        yAxisKey: 'eco',
                        data: res.data.data.chart.closing,
                    },
                    {
                        type: 'line',
                        color: 'green',
                        yAxisKey: 'eco',
                        data: res.data.data.chart.savings,
                    },
                    {
                        type: 'line',
                        color: 'red',
                        yAxisKey: 'eco',
                        data: res.data.data.chart.expenses,
                    },
                ])
                setMonthData(res.data.data.chart.months)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    React.useEffect(() => {
        getChartData()
    }, []);


    return loading ? <PageLoader/>
        :
        <Container maxWidth={false}>
            <MyInvestments myInvestments={myInvestments} setMyInvestments={setMyInvestments}
                           setSnackbarMessage={props.setSnackbarMessage} setOpenSnackbar={props.setOpenSnackbar}/>
            <Grid container spacing={1} style={{padding: 5}}>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                    <Chart monthData={monthData} series={series} setSnackbarMessage={props.setSnackbarMessage}
                           setOpenSnackbar={props.setOpenSnackbar}/>
                    <Due dues={dues}/>
                    <Returns returns={returns}/>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={3}>
                    <Stack direction='column' spacing={1}>
                        <Storage storageTransfer={true} setSnackbarMessage={props.setSnackbarMessage}
                                 setOpenSnackbar={props.setOpenSnackbar}/>
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={3}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Stack direction='column' spacing={1}>
                            <Loans myInvestments={myInvestments} setMyInvestments={setMyInvestments}
                                   setSnackbarMessage={props.setSnackbarMessage}
                                   setOpenSnackbar={props.setOpenSnackbar}/>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Stack direction='column' spacing={1}>
                            <InvestmentList myInvestments={myInvestments} setMyInvestments={setMyInvestments}
                                            setSnackbarMessage={props.setSnackbarMessage}
                                            setOpenSnackbar={props.setOpenSnackbar}/>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
}