import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();

//setup inbuilt middlewares and imported ones
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({
    limit: "16kb",
}));
app.use(express.urlencoded({
    limit: "16kb",
    extended: true,
}));
app.use(express.static("public"));
app.use(cookieParser());


app.get('/:name',(req,res)=>{
    const {name}=req.params;
    res.send(`HI ${name}`);
});

export {app};