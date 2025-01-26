import  LoginAPI  from '../repo/Login'
import {useNavigate} from "react-router-dom";
import LocalStorage from "../providers/LocalStorage";
import {useEffect} from "react";
import {RoutePath} from "../functionalities/RoutePath";

export const Index = (props) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (LocalStorage.accessToken() === null) {
            navigate(RoutePath.Login, {replace: true})
        }
        LoginAPI.checkAuth()
            .then((res) => {
                if (res.data.status) {
                    let isRegistered = LocalStorage.get('is_registration_completed') === 'true'
                    if(!isRegistered){
                        navigate('/register', {replace: true})
                        return;
                    }
                    navigate('/dashi', {replace: true})
                } else {
                    navigate('/login', {replace: true})
                }
            })
            .catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
            });
    });
}