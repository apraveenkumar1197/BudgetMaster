import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../functionalities/RoutePath";
import LocalStorage from "../providers/LocalStorage";
import LoginAPI from '../repo/Login';

export const Index = (props) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (LocalStorage.accessToken() === null) {
            navigate(RoutePath.Login, { replace: true })
        }
        LoginAPI.checkAuth()
            .then((res) => {
                if (res.data.status) {
                    let isRegistered = LocalStorage.get('is_registration_completed') === 'true'
                    if (!isRegistered) {
                        navigate(RoutePath.Register, { replace: true })
                        return;
                    }
                    navigate(RoutePath.Dashi, { replace: true })
                } else {
                    navigate(RoutePath.Login, { replace: true })
                }
            })
            .catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
            });
    });
}