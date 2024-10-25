"use client"
 import ProtectedRoute from "@/components/Accounts/ProtectedRoutes";
import api from "../../utils/api";
import {  useState,useEffect } from "react";
import { useRouter } from 'next/navigation';
import {REFRESH_TOKEN} from "@/utils/constants";

function Update() {
    const [newUsername, setNewUserName] = useState("")
    const[userId,setUserId]=useState("")

    const handleUpdate = async () => {

        try {
            const response = api.patch(`api/users/currentUser/`, {username:newUsername})
            console.log("Username changed Successfully")
        } catch (error) {
            console.error("Error updating username")
        }
    }
    return <div>
        <h2>Update Username</h2>
        <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Enter new username"
        />
        <button onClick={handleUpdate}>Update Username</button>
    </div>
}
function ProtectedUpdate() {
    return (
        <ProtectedRoute>
            <Update/>
        </ProtectedRoute>
    );
}
export default ProtectedUpdate