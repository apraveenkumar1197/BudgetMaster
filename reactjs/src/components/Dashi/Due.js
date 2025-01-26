import {Container, Button, Card, CardActions, CardContent, Grid, Link, Typography} from "@mui/material";
import React from "react";
import {RoutePath} from "../../functionalities/RoutePath";
import {Label} from "@mui/icons-material";
import Util from "../../functionalities/Util";

export const Due = (props) => {
    const formatter = Util.numberFormatter()

    if(props.dues === null || props.dues === {})
        return <div></div>;

    return <Card sx={{ minWidth: 275 }}>
        <CardContent>
            <Container>
                <Grid container spacing={1}>
                    <h2><Link href={RoutePath.Dues} style={{ textDecoration: 'none' }}>Due</Link></h2>
                </Grid>
                <Grid container>
                    <Grid item xs={9} md={9}>
                        <Grid container spacing={1}>
                            <h2>{props.dues.reason}</h2><h5 style={{paddingLeft: 5}}> {props.dues.count}</h5>
                        </Grid>
                    </Grid>
                    <Grid item xs={3} md={3}>
                        <Grid container spacing={1}>
                            <Button  variant="contained" size="large"><h1>Rs {formatter.format(props.dues.amount)}</h1></Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </CardContent>
    </Card>
}