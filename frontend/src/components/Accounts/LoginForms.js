import React, {useState} from "react";
import {redirect} from "next/navigation"
import api from "../../utils/api";
import { useRouter } from 'next/navigation';
import register from "../../app/styles/register.css"
import {ACCESS_TOKEN, REFRESH_TOKEN} from "@/utils/constants";
import { getTokenUserUrl } from "@/utils/url-segments";
import axios from "axios";

function Form() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const router=useRouter()
    const[passwordReset,setShowPasswordReset]=useState(false);
    const forgotPasswordButtonClick = () => {
    setShowPasswordReset(!passwordReset)};
    const backButtonClick=(e)=>{
       e.preventDefault()
        setShowPasswordReset(false)
    }
    const registerButtonClick=()=>{
        router.push('/users/register')
    }

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            console.log(getTokenUserUrl())
            const request = await api.post(getTokenUserUrl(), {username, password});
            localStorage.setItem(ACCESS_TOKEN, request.data.access);
            localStorage.setItem(REFRESH_TOKEN, request.data.refresh);
            router.push('/')
            router.refresh()

        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }

    }
    const handleForgotPasswordSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            const api = axios.create({
  baseURL:"http://127.0.0.1:8000",
             });
            const request= await api.post('api/users/resetPassword',{email})
            alert("You have been sent a request to reset your password if an account exists with that email")
            console.log(request)

        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }

    }

    return (
            <form onSubmit={passwordReset?handleForgotPasswordSubmit:handleSubmit} className="form-container">
                <img
                            width={250}
                            height={100}
                            src="/UNLV.png"
                            className='logo'
                />
                <br></br>
                {passwordReset ? (
                <div>

                    <h1>Forgot Password</h1>
                    <input
                        className={"form-input"}
                        type={"email"}
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="login-button" type="submit">
                        {"Submit"}
                    </button>
                    <button className="back-button" type="button" onClick={backButtonClick}>
                        {"Back"}
                    </button>
                </div>
            ) : (
                <div>
                    <h1>Login</h1>

                    <input
                        className={"form-input"}
                        type={"username"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                    <input
                        className={"form-input"}
                        type={"password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button className="login-button" type="submit">
                        {"Login"}
                    </button>
                    <button className="forgot-password" type="button" onClick={forgotPasswordButtonClick}>
                        {"Forgot Password"}
                    </button>
                    <br></br>
                    <button className="register" type="button" onClick={registerButtonClick}>
                        {"Register"}
                    </button>
                </div>

            )}
            </form>
    )


}


export default Form