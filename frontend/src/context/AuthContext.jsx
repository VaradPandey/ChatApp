import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/axios.js"

const AuthContext=createContext()

export function AuthProvider({children}){

    const [user,setUser]=useState(null)
    const [loading,setLoading]=useState(true)

    const logout=async()=>{
        try{
            await api.post('/user/logout')
            setUser(null)
            console.log("User Logged Out")
        }catch(error){
            console.log("Error Logging Out User | Catch Block")
        }
    }

    //check if user already logged in
    useEffect(()=>{
        api.get('/user/auth/me')
        .then((res)=>{
            setUser(res.data.data)
            console.log("AuthMe Fetched User:", res.data.data)
        })
        .catch(()=>{
            setUser(null)
            console.log("No User Found || No AuthMe")
        })
        .finally(()=>setLoading(false))
    },[])

    return (
        <AuthContext.Provider value={{user,setUser,logout,loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>{
    return useContext(AuthContext)
}