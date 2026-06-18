import axios from "axios";
import Base from './Base'


class LoginAPI {
    static getOtp = (email) => {
        return Base.post('auth/otp/get',{email: email},false)
    }
    static verifyOtp = (email,otp) => {
        return Base.post('auth/otp/verify',{email: email, otp: otp},false)
    }
    static checkAuth = () => {
        return Base.post('auth/check',{})
    }
    static logout = () => {
        return Base.post('auth/logout',{})
    }
}

export default LoginAPI