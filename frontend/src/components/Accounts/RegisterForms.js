import React, {useState} from "react";
import api from "../../utils/api";
import { useRouter } from 'next/navigation';
import { getRegisterUserUrl } from "@/utils/url-segments";
import register from "../../app/styles/register.css"

function Form() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")
    const router=useRouter()
    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        const allowedDomain = "unlv.nevada.edu"; // Only allow UNLV email addresses
        const emailDomain = email.split('@')[1];

        if (emailDomain !== allowedDomain) {
            setError(`Email must be from the ${allowedDomain} domain.`);
            setLoading(false);
            return;
        }
        try {
            console.log(getRegisterUserUrl())
            localStorage.clear();
            const request = await api.post(getRegisterUserUrl(), { email,username, password})
            router.push('/users/login')
            router.refresh()

        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return <form onSubmit={handleSubmit} className="form-container">
        <img
            width={250}
            height={100}
            src="/UNLV.png"
            className='logo'
        />
        <br></br>
        <div>
            <h1>Register</h1>

            <input
                className={"form-input"}
                type={"email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="UNLV Email Address"
            />
            {error && <p style={{color: 'red'}}>{error}</p>}
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
            <button className="register-button" type="submit">
                {"Register"}
            </button>
        </div>
    </form>

}

export default Form
