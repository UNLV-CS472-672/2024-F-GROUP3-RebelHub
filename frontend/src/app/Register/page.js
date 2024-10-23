"use client"
import Form from "../components/RegisterForms"

 function Register(){
    localStorage.clear()
    return <Form route="users/register/"/>
}
export default Register