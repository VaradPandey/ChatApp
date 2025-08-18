import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/axios.js";

const AuthContext=createContext()

export function AuthProvider({children}){

    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);

    //check if user already logged in
    useEffect(()=>{
        api.get('/auth/me')
        .then(res=>setUser(res.data.user))
        .catch(()=>setUser(null))
        .finally(()=>setLoading(false))
    },[]);

    return (
        <AuthContext.Provider value={{user,setUser,loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>{
    useContext(AuthContext)
}