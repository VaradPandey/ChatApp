import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { ChatList } from "./ChatList"

//Protected Page
export function Dashboard(){
    const {user,logout}=useAuth()
    const navigate=useNavigate()
    return(
        <div>
            <p>Name: {user.username}</p>
            <p>Email: {user.email}</p>

            <button type="Submit"
                onClick={()=>{
                    logout()
                    navigate('/login')
                }}>Logout
            </button>
            
            <button onClick={()=>{navigate('/inbox')}}>Open Chats</button>
        </div>
    )
}