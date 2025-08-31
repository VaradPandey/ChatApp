import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";

export function EditGroupChat() {
    const { chatId }=useParams();
    const { user }=useAuth();
    const [chatInfo,setChatInfo]=useState(null);
    const [newGrpImage,setNewGrpImage]=useState(null);
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();

    
    const [newNameBody,setNewNameBody]=useState({
        newName: ""
    });

    const [addUsernames,setAddUsernames]=useState({
        usernames: []
    });

    const [removeUsernames,setRemoveUsernames]=useState({
        usernames: []
    });

    useEffect(()=>{
        const fetchChatInfo=async()=>{
            try{
                const res=await api.get(`/chat/${chatId}`);
                setChatInfo(res.data.data);
            }catch(err){
                console.log("FETCH CHAT INFO ERROR:",err);
            }
        };
        fetchChatInfo();
    },[chatId]);


    const handleNameChange=async()=>{
        if(!newNameBody.newName.trim()) return;
        try{
            await api.put(`/chat/${chatId}/editGrpName`,newNameBody);
            setNewNameBody({ newName: "" });
            window.location.reload();
        }catch(err){
            console.log("EDIT NAME ERROR:",err);
        }
    };

    const handleIconChange=async()=>{
        if (!newGrpImage) return alert("Select an image first");

        const formData=new FormData();
        formData.append("grpImage",newGrpImage);

        try{
            setLoading(true);
            const res=await api.post(`/chat/${chatId}/editGrpIcon`,formData,{
            headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(res.data);
            setChatInfo((prev)=>({...prev,grpImage: res.data.data.grpImage }));
            setNewGrpImage(null);
            window.location.reload();
        }catch(error){
            console.error(error);
            alert("Upload failed");
        }

        setLoading(false);
    };


    const handleAddMembers=async()=>{
        if(addUsernames.usernames.length===0) return;
        try{
            await api.post(`/chat/${chatId}/addMembers`,addUsernames);
            setAddUsernames({ usernames: [] });
            window.location.reload();
        }catch(err){
            console.log("ADD MEMBERS ERROR:",err);
        }
    };

    const handleRemoveMembers=async()=>{
        if(removeUsernames.usernames.length===0) return;

        try{
            await api.post(`/chat/${chatId}/removeMembers`,removeUsernames);
            setRemoveUsernames({ usernames: [] });
            window.location.reload();
        }catch(err){
            console.log("REMOVE MEMBERS ERROR:",err);
        }
    };

    if(!chatInfo) return <p className="text-white p-4">Loading group info...</p>;

    if(loading) return <LoadingSpinner></LoadingSpinner>

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex justify-center items-start p-6">
            <div className="w-full max-w-xl bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
                <h1 className="text-2xl font-bold text-white text-center">
                    Edit Group Settings
                </h1>

                {/* Group Icon + Name */}
                <div className="flex items-center gap-4">
                    <img
                        src={chatInfo.grpImage}
                        className="w-14 h-14 rounded-full"
                    />
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            {chatInfo.chatName}
                        </h2>
                        <p className="text-sm text-gray-400">Members: {chatInfo.participants.length}</p>
                    </div>
                </div>

                {/* Change Group Name */}
                <div>
                    <label className="block text-sm text-gray-300 mb-1">New Group Name</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter new name"
                            value={newNameBody.newName}
                            onChange={(event)=>setNewNameBody({ newName: event.target.value })}
                            className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <button
                            onClick={handleNameChange}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
                        >
                            Save
                        </button>
                    </div>
                </div>

                {/* Change Group Icon */}
                <div>
                <label className="block text-sm text-gray-300 mb-1">Upload New Group Icon</label>
                <div className="flex gap-2 items-center">
                    <input
                    type="file"
                    accept="image/*"
                    onChange={(event)=>setNewGrpImage(event.target.files[0])}
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button
                    onClick={handleIconChange}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
                    >
                    Save
                    </button>
                </div>
                </div>


                {/* Add Members */}
                <div>
                    <label className="block text-sm text-gray-300 mb-1">Add Members (comma separated usernames)</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="personA,personB"
                            onChange={(event) =>
                                setAddUsernames({
                                    usernames: event.target.value
                                        .split(",")
                                        .map((u)=>u.trim())
                                        .filter((u)=>u),
                                })
                            }
                            className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <button
                            onClick={handleAddMembers}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Remove Members */}
                <div>
                <label className="block text-sm text-gray-300 mb-1">Remove a Member</label>
                <div className="flex gap-2">
                    <select
                    value={removeUsernames.usernames[0] || ""}
                    onChange={(e)=>setRemoveUsernames({ usernames: [e.target.value] })}
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                    <option value="">Select Member</option>
                    {chatInfo.participants
                        .filter((p)=>p.username!==user.username)
                        .map((p)=>(
                        <option key={p._id} value={p.username}>
                            {p.username}
                        </option>
                        ))}
                    </select>
                    <button
                    onClick={handleRemoveMembers}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                    >
                    Remove
                    </button>
                </div>
                </div>

                {/* Back Button */}
                <button
                    onClick={()=>navigate(`/chatsection/${chatId}`)}
                    className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white mt-4"
                >
                    Back to Chat
                </button>
            </div>
        </div>
    );
}
