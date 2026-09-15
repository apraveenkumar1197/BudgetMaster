import {Button, CircularProgress, Fade} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";

export const LoadingButton = ({children, onClick, disabled, type = 'button', ...rest}) => {
    return <Box sx={{m: 1, position: 'relative', display: 'inline-block'}}>
        <Button variant="contained" type={type} disabled={disabled} onClick={onClick} {...rest}>{children}</Button>
        <Fade in={!!disabled} unmountOnExit>
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