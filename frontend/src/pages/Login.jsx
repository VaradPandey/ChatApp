import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext";

export function Login() {
    const {setUser}=useAuth();
    const navigate=useNavigate();

    const [form,setForm]=useState({
        username: "",
        password: "",
    });

    const handleChange=(event)=>{
        setForm(prev=>({ ...prev,[event.target.name]: event.target.value }));
    };

    const handleSubmit=async(event)=>{
        event.preventDefault();
        try{
            const res=await api.post('/user/login',form);
            setUser(res.data.data);
            console.log(res.data);
            console.log("Login Successful",res.data.data);
            navigate('/dashboard');
        }
        catch(error){
            if(error.response){
                console.log("Login Error: ",error.response.data);
            }else if(error.request){
                console.log("No response from server",error.request);
            }else{
                console.log("Error",error.message);
            }
        }
    };

    useEffect(()=>{
        const handleBackButton=(e)=>{
            e.preventDefault();
            navigate("/",{ replace: true });
        };

        window.addEventListener("popstate",handleBackButton);

        return ()=>{
            window.removeEventListener("popstate",handleBackButton);
        };
    },[navigate]);

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
            <form 
                onSubmit={handleSubmit} 
                className="bg-gray-800 bg-opacity-80 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white z-10"
            >
                <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
                
                <input type="text" name="username" value={form.username} placeholder="Username"
                    onChange={handleChange} required
                    className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />

                <input
                    type="password" name="password" value={form.password} placeholder="Password"
                    onChange={handleChange} required
                    className="w-full mb-6 px-4 py-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />

                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 rounded-lg shadow-md font-semibold text-white transition-all duration-300"
                >
                    Submit
                </button>
            </form>

            {/* Decorative background image */}
            <div className="absolute inset-0 z-0">
                <img src="images/stars.jpg" className="w-full h-full object-cover opacity-10" />
            </div>

        </div>
    );
}
