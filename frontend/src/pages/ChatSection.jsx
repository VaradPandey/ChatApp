import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import { UserMessage } from "../components/UserMessage.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { OtherUserMessage } from "../components/OtherUserMessage.jsx";

export function ChatSection(){
    const {chatId}=useParams();
    const [messages,setMessages]=useState([]);
    const [loading,setLoading]=useState(true);
    const {user}=useAuth();

    useEffect(()=>{
        const fetchMessages=async()=>{
            try{
                const res=await api.get(`/message/msgHistory/${chatId}`);
                setMessages(res.data.data);
                console.log(res.data.data); 
            }
            catch(error){
                console.log('CATCH BLOCK ERROR: ',error);
            }
            finally{
                setLoading(false);
            }
        }
        fetchMessages();
    },[chatId]);

    if (loading) return <p>Loading Chat Messages....</p>

    return(
        <div>
            {
                messages.map((message,index)=>{
                    return(
                            (message.sender.username===user.username)?
                            <UserMessage key={index} message={message} index={index}/>:
                            <OtherUserMessage key={index} message={message} index={index}/>
                    )
                })
            }
        </div>
    )
}