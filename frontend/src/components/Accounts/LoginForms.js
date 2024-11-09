import {useState} from "react";
import {redirect} from "next/navigation"
import api from "../../utils/api";
import { useRouter } from 'next/navigation';
import register from "../../app/styles/register.css"
import {ACCESS_TOKEN, REFRESH_TOKEN} from "@/utils/constants";
import { getTokenUserUrl } from "@/utils/url-segments";

function Form() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router=useRouter()
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

    return <form onSubmit={handleSubmit} className="form-container">
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
            <button className="form-button" type="submit">
                {"Login"}
            </button>
        </div>
    </form>



}

export default Form