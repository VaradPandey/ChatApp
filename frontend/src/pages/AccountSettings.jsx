import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import socket from "../api/socket.js";

export function AccountSettings() {
    const { user,logout,setUser }=useAuth();
    const navigate=useNavigate();

    const [newAvatar,setNewAvatar]=useState(null);
    const [newUsername,setNewUsername]=useState("");
    const [newEmail,setNewEmail]=useState("");
    const [newPassword,setNewPassword]=useState("");
    const [loading,setLoading]=useState(false);

    useEffect(()=>{
        const handleUserUpdate=(updatedUser)=>{
            if(updatedUser._id===user._id){
                setUser(prev=>({...prev,...updatedUser }));
            }
        };

        socket.on("userUpdateFromBackend", handleUserUpdate);
        return ()=>{
            socket.off("userUpdateFromBackend", handleUserUpdate);
        }
    },[user._id]);

    const handleAvatarChange=async()=>{
        if (!newAvatar) return alert("Select an image first");

        const formData=new FormData();
        formData.append("avatar",newAvatar);

        try{
            setLoading(true);
            const res=await api.post(`/user/changeAvatar`,formData,{
                headers: { "Content-Type": "multipart/form-data" },
            });
            socket.emit("userUpdateFromFrontend",res.data.data);
            setNewAvatar(null);
        }catch(error){
            console.error("CHANGE AVATAR ERROR:",err);
            alert("Failed to change avatar");
        }
        setLoading(false);
    };

    const handleDetailsChange=async()=>{
        if (!newUsername.trim() && !newEmail.trim()) return alert("Enter username or email to update");

        try{
            setLoading(true);
            const res=await api.post(`/user/editProfile`,{
                username: newUsername.trim() || undefined,
                email: newEmail.trim() || undefined,
            });
            socket.emit("userUpdateFromFrontend",res.data.data);
            setNewUsername("");
            setNewEmail("");
        }catch(error){
            console.error("CHANGE DETAILS ERROR:",err);
            alert("Failed to update details");
        }
        setLoading(false);
    };

    const handlePasswordChange=async()=>{
        if (!newPassword.trim()) return alert("Enter a new password");

        try{
            setLoading(true);
            await api.post(`/user/changePassword`,{ password: newPassword });
            alert("Password updated successfully");
            setNewPassword("");
        }catch(error){
            console.error("CHANGE PASSWORD ERROR:",err);
            alert("Failed to change password");
        }
        setLoading(false);
    };

    const handleDeleteAccount=async()=>{
        if (!window.confirm("Are you sure you want to delete your account?")) return;

        try{
            setLoading(true);
            await api.post(`/user/deleteUser`);
            logout();
            navigate("/");
        }catch(error){
            console.error("DELETE USER ERROR:",err);
            alert("Failed to delete account");
        }
        setLoading(false);
    };

    useEffect(()=>{
        const handleBackButton=(e)=>{
            e.preventDefault();
            navigate("/dashboard",{ replace: true });
        };

        window.addEventListener("popstate",handleBackButton);

        return ()=>{
            window.removeEventListener("popstate",handleBackButton);
        };
    },[navigate]);

    if(loading) return <LoadingSpinner></LoadingSpinner>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex justify-center items-start p-6">
            <div className="w-full max-w-xl bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6 z-10">
                <h1 className="text-2xl font-bold text-white text-center">
                    Account Settings
                </h1>

                {/* User Info */}
                <div className="flex items-center gap-4">
                    <img
                        src={user.avatar}
                        className="w-14 h-14 rounded-full border border-gray-600"
                    />
                    <div>
                        <h2 className="text-lg font-semibold text-white">{user.username}</h2>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                </div>

                {/* Change Avatar */}
                <div>
                    <label className="block text-sm text-gray-300 mb-1">Upload New Avatar</label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e)=>setNewAvatar(e.target.files[0])}
                            className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <button
                            onClick={handleAvatarChange}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
                        >
                            Save
                        </button>
                    </div>
                </div>

                {/* Change Username / Email */}
                <div>
                    <label className="block text-sm text-gray-300 mb-1">Update Details</label>
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            placeholder="New Username"
                            value={newUsername}
                            onChange={(e)=>setNewUsername(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <input
                            type="email"
                            placeholder="New Email"
                            value={newEmail}
                            onChange={(e)=>setNewEmail(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <button
                            onClick={handleDetailsChange}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
                        >
                            Save
                        </button>
                    </div>
                </div>

                {/* Change Password */}
                <div>
                    <label className="block text-sm text-gray-300 mb-1">New Password</label>
                    <div className="flex gap-2">
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e)=>setNewPassword(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <button
                            onClick={handlePasswordChange}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
                        >
                            Save
                        </button>
                    </div>
                </div>

                {/* Delete Account */}
                <div>
                    <label className="block text-sm text-gray-300 mb-1">Danger Zone</label>
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                    >
                        Delete Account
                    </button>
                </div>

                {/* Back */}
                <button
                    onClick={()=>navigate("/dashboard")}
                    className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white mt-4"
                >
                    Back to Dashboard
                </button>
            </div>

            {/* Decorative background image */}
            <div className="absolute inset-0 z-0">
                <img src="images/stars.jpg" className="w-full h-full object-cover opacity-10" />
            </div>
        </div>
    );
}
