import {app} from "./app.js";
import {connectDb} from "./db/mongodb.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

dotenv.config({
    path: './.env'
});
const port=process.env.PORT || 8000;

//create http server using express app
const server=http.createServer(app);

// attach socket.io
const io=new Server(server,{
    cors:{
        origin: process.env.CORS_ORIGIN,
        methods: ["GET","POST","PUT","DELETE"],
        credentials: true
    }
})

io.on("connection",(socket)=>{
    console.log("User Connected: ",socket.id);

    socket.on("msgFromFrontend",(data)=>{
        io.emit("msgFromBackend",data)
    })

    socket.on("editMsgFromFrontend",(data)=>{
        io.emit("editMsgFromBackend",data)
    });

    socket.on("deleteMsgFromFrontend",(data)=>{
        io.emit("deleteMsgFromBackend",data)
    });

    socket.on("exitGrpFromFrontend",(data)=>{
        io.emit("exitGrpFromBackend",data)
    });

    socket.on("newChatFromFrontend",(data)=>{
        io.emit("newChatFromBackend",data)
    })

    socket.on("disconnect",()=>{
        console.log("User disconnected:",socket.id);
    });
})

connectDb()
.then(
    server.listen(port,()=>{
        console.log(`Listening at port ${port}`);
    })
)
.catch((err)=>{
    console.log(err);
});

