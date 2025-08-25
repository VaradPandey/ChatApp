import { useEffect,useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios.js";

export function ChatList(){
    const [chats,setChats]=useState([]);
    const [loading,setLoading]=useState(true);
    const {user}=useAuth();

    useEffect(()=>{
        const fetchChats=async()=>{
            try{
                const res=await api.get('/chat/inbox');
                setChats(res.data.data);
            }catch(error){
                console.log("Error Fetching Chats || Catch Block",error);
            }finally{
                setLoading(false);
            }
        };

        fetchChats();
    },[]);

    useEffect(()=>{
        console.log(chats);
    },[chats]);

    if (loading) return <p>Loading Chats...</p>;

    return (
        <div>
            {
                chats.map((chat,index)=>{
                    return(
                        <div key={index}>
                            {chat.chatName}
                        </div>
                    )
                })
            }
        </div>
    );
}
