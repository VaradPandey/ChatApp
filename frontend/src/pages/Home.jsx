import { useNavigate } from "react-router-dom"

export function Home(){
    const navigate=useNavigate();
    return(
        <div>
            <h1>WELCOME TO CHAT APP</h1>
            <button onClick={()=>navigate('/register')}>Register</button>
            <button onClick={()=>navigate('/login')}>Login</button>
        </div>
    )
}