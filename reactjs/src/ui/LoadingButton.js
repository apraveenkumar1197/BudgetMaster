import {Button, CircularProgress, Fade} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";

export const LoadingButton = (props) => {
    return <Box sx={{m: 1, position: 'relative', display: 'inline-block'}}>
        <Button variant="contained" disabled={props.disabled} onClick={props.onClick}>{props.children}</Button>
        <Fade in={!!props.disabled} unmountOnExit>
            <CircularProgress
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                }}
                size={24}/>
        </Fade>
    </Box>
}