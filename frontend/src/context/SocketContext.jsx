import { createContext,useContext,useState,useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext=createContext();

export function SocketProvider({children}){

    const [socket,setSocket]=useState(null);

    useEffect(()=>{
        const newSocket=io("http://localhost:3000",{withCredentials: true});

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