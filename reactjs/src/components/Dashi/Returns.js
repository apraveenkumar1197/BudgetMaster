import {Button, Card, CardContent, Link, Stack, Typography} from "@mui/material";
import React from "react";
import {RoutePath} from "../../functionalities/RoutePath";
import Util from "../../functionalities/Util";

export const Returns = (props) => {
    const formatter = Util.numberFormatter()

    if(props.returns === null || props.returns === {})
        return <div></div>;

    return <Card sx={{ minWidth: 0 }}>
        <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
                <Link href={RoutePath.Returns} underline="hover" color="inherit">Returns</Link>
            </Typography>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={1.5}>
                <Stack direction="row" alignItems="baseline" spacing={1} flexWrap="wrap">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{props.returns.reason}</Typography>
                    <Typography variant="body2" color="text.secondary">{props.returns.count}</Typography>
                </Stack>
                <Button variant="contained" size="large" sx={{ whiteSpace: 'nowrap' }}>
                    Rs {formatter.format(props.returns.amount)}
                </Button>
            </Stack>
        </CardContent>
    </Card>
}