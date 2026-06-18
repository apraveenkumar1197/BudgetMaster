import React from "react";
import Expense from "../repo/Expense";
import DateUtil from "../functionalities/DateUtil";
import Login from "../repo/Login";
import {useNavigate} from "react-router-dom";
import {RoutePath} from "../functionalities/RoutePath";


export const Logout = (props) => {
    const navigate = useNavigate();

    const logout = () => {
        Login.logout()
            .then((res) => {
                navigate(RoutePath.Login, {replace: true})
            }).catch((err) => {
                navigate(RoutePath.Login, {replace: true})
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    React.useEffect(() => {
        logout()
    },[]);
}