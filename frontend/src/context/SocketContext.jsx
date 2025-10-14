import { createContext,useContext,useState,useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext=createContext();

export function SocketProvider({children}){

    const [socket,setSocket]=useState(null);

    const socketURI=import.meta.VITE_BACKEND_URL||'http://localhost:8000'

    useEffect(()=>{
        const newSocket=io(socketURI,{withCredentials: true});

        setSocket(newSocket);

        return ()=>newSocket.close();
    },[]);

    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket=()=>{
    return useContext(SocketContext)
}