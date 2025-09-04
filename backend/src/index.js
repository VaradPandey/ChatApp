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
        methods: ["GET","POST","PUT"],
        credentials: true
    }
})

io.on("connection",(socket)=>{
    console.log("User Connected: ",socket.id);

    socket.on("msgFromReact",(msg)=>{
        console.log("Message Recieved From Frontend: ",msg);

        io.emit("msgForReact",msg)
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

