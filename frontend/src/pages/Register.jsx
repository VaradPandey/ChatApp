import { useState } from "react"
import api from "../api/axios.js"
import { useNavigate } from "react-router-dom";

export function Register(){
    const navigate=useNavigate();

    const [form,setForm]=useState({
        username: "",
        email: "",
        password: "",
    });

    const handleSubmit=async (event)=>{
        event.preventDefault();
        try{
            await api.post('/user/register',form)
            navigate('/login');
        }catch(error){
            console.log('Registeration Error Catch Block: ',error)
            navigate('/');
        }
    }

    const handleChange=(event)=>{
        setForm((form)=>({...form,[event.target.name]:event.target.value}))
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" value={form.username} placeholder="Username"
            onChange={handleChange} required/>
            <input type="text" name="email" value={form.email} placeholder="Email"
            onChange={handleChange} required/>
            <input type="text" name="password" value={form.password} placeholder="Password"
            onChange={handleChange} required/>

            <button type="submit">Register</button>
        </form>
    )
}