import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios.js"
import { useAuth } from "../context/AuthContext";

export function Login(){
    const {setUser}=useAuth();

    const navigate=useNavigate();

    const [form,setForm]=useState({
        username: "",
        password: "",
    });

    const handleChange=(event)=>{
        setForm(prev=>({...prev,[event.target.name]:event.target.value}));
    }

    const handleSubmit=async(event)=>{
        event.preventDefault();
        try{
            const res=await api.post('/user/login',form);
            setUser(res.data.data);
            console.log(res.data)
            console.log("Login Successful",res.data.data);
            navigate('/dashboard');
        }catch(error){
            if(error.response){
                console.log("Login Error: ",error.response.data);
            }else if(error.request){
                console.log("No response from server",error.request);
            }else{
                console.log("Error",error.message);
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" value={form.username} placeholder="Username"
            onChange={handleChange} required/>

            <input type="text" name="password" value={form.password} placeholder="Password"
            onChange={handleChange} required/>

            <button type="Submit">Submit</button>
        </form>
    )
}