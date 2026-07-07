import {CircularProgress, Fade} from "@mui/material";
import React from "react";


export const PageLoader = () => {

    return <Fade in timeout={300}>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80px'
        }}>
            <CircularProgress/>
        </div>
    </Fade>
}