"use client"
 import ProtectedRoute from "@/app/components/ProtectedRoutes";
import api from "../api";
import {  useState,useEffect } from "react";
import { useRouter } from 'next/navigation';
function Home(){
    const[message,setMessage]= useState("")
    const[title,setTitle]= useState("")
    const router=useRouter()



     const createPosts=(e) =>{
        e.preventDefault()
         console.log(title)
         console.log(message)
        api.post(("/posts/create/"),{title,message})
        .then((res) => {
        if(res.status==201) alert ("Post Created")
        else alert("Failed to make post")
         })
         .catch((err)=> alert(err))


     }
     const handleLogout= () => {
        localStorage.clear()
         router.push("/Login")
     }
    return <div>
        <button onClick={handleLogout} style={{
                position: 'absolute', // Position it absolutely
                top: '10px',         // 10 pixels from the top
                right: '10px'}}>
            Logout
        </button>
        <h1>Create a Post</h1>
        <form onSubmit={createPosts}>
            <label htmlFor="title">Title:</label>
            <br/>
            <input
                type="text"
                id="title"
                name="title"
                required
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
            <label htmlFor="message">Message:</label>
            <br/>
            <textarea
                id="message"
                name="message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <br/>
            <input type="submit" value="Submit"></input>
        </form>
    </div>

}


function ProtectedHome() {
    return (
        <ProtectedRoute>
            <Home/>
        </ProtectedRoute>
    );
}

export default ProtectedHome
