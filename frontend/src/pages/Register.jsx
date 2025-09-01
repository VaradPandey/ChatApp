import { useState } from "react";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";

export function Register() {
    const navigate=useNavigate();

    const [form,setForm]=useState({
        username: "",
        email: "",
        password: "",
    });

    const handleSubmit=async(event)=>{
        event.preventDefault();
        try{
            await api.post('/user/register',form);
            navigate('/login');
        }
        catch(error){
            console.log('Registration Error Catch Block: ',error);
            navigate('/');
        }
    };

    const handleChange=(event)=>{
        setForm((form)=>({ ...form,[event.target.name]: event.target.value }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 bg-opacity-80 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white z-10"
            >
                <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

                <input
                    type="text" name="username" value={form.username} placeholder="Username"
                    onChange={handleChange} required
                    className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />

                <input
                    type="text" name="email" value={form.email} placeholder="Email"
                    onChange={handleChange} required
                    className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <input
                    type="password" name="password" value={form.password} placeholder="Password"
                    onChange={handleChange} required
                    className="w-full mb-6 px-4 py-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />

                <button
                    type="submit"
                    className="w-full py-3 bg-purple-700 hover:bg-purple-800 rounded-lg shadow-md font-semibold text-white transition-all duration-300"
                >
                    Register
                </button>
            </form>

            {/* Decorative background image */}
            <div className="absolute inset-0 z-0">
                <img src="/images/stars.jpg" className="w-full h-full object-cover opacity-10" />
            </div>
        </div>
    );
}
