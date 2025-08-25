import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import { UserMessage } from "../components/messages/UserMessage.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { OtherUserMessage } from "../components/messages/OtherUserMessage.jsx";

export function ChatSection(){
    const {chatId}=useParams();
    const [messages,setMessages]=useState([]);
    const [loading,setLoading]=useState(true);
    const {user}=useAuth();

    const [newContent,setNewContent]=useState({
        content: "",
        messageType: "text",
        chatId
    });

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
    },[]);

    const handleChange=(event)=>{
        setNewContent(prev=>({...prev,[event.target.name]:event.target.value}))
    }

    const handleSubmitContent=async(event)=>{
        event.preventDefault();
        if(!newContent.content.trim()) return;

        try{
            const res=await api.post('/message/createMessage',newContent);
            setMessages(prev=>[...prev,res.data.data]);
            setNewContent({content: "",messageType: "text",chatId});
            console.log(res.data.data);
        }catch(error){
            console.log('CATCH BLOCK ERROR: ',error);
        }
    }

    if (loading) return <p>Loading Chat Messages....</p>

    return(
        <>
            {
                messages.map((message,index)=>{
                    return(
                            (message.sender.username===user.username)?
                            <UserMessage key={index} message={message} index={index}/>:
                            <OtherUserMessage key={index} message={message} index={index}/>
                    )
                })
            }

            <div>
                <input type="text"
                    placeholder="Type Message Here..."
                    name="content"
                    value={newContent.content}
                    onChange={handleChange}
                    className="border border-gray-400 rounded-md p-2 mb-2 bg-gray-50 mr-5"
                /> 
                
                <button
                    onClick={handleSubmitContent}
                    className="border border-gray-400 rounded-md p-2 mb-2 bg-purple-100"
                >
                    Send
                </button> 
            </div>
        </>
    )
}