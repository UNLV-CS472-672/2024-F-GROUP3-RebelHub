"use client"
import Form from "../../components/Accounts/RegisterForms"

 function Register(){
    localStorage.clear()
    return <Form route="api/users/register/"/>
}
export default Register