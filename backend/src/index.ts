import { WebSocketServer,WebSocket } from "ws";
import express from "express"
import { user } from "./schema/UserSchema";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const wss=new WebSocketServer({port:8080})

let usercount=0;

interface User{
    socket: WebSocket,
    roomID: string
}

// let allSocke={};

// /*

//     "room1":[socket1, socket2],
//     "room2":[socket3],
//     "room3":[socket 4, socket 5, socket6]


// */

let allSocket:User[]=[];

/*
    [
    socket: "socket1", room : room1,
    socket: "socket2", room : room2,
    socket: "socket1", room: room1
    ]
*/


const app=express();

app.use(express.json());

app.get("/signup",async (req,res)=>{
    try {
        const {username, password, name}=req.body;
        const result=await user.findOne({
            username:username
        })
        if(result)
        {
            return res.status(401).json({
                message: "username already exist"
            })
        }
        const hashpassword=await bcrypt.hash(password,10);
        await user.create({
            username, 
            password:hashpassword, 
            name
        })

        return res.status(200).json({
            mesage: "sinup done successfully"
        })

    } catch (error) {
        
    }
})

app.get("/signin",async (req,res)=>{
    try {
        const {username, password, name}=req.body;
        const result=await user.findOne({
            username:username
        })
        if(!result)
        {
            return res.status(401).json({
                message: "Please sign up first"
            })
        }
         const hashpassword=await bcrypt.hash(password,10);
       const passwordCompare=await bcrypt.compare(password, hashpassword)

        if(!passwordCompare)
        {
            return res.status(401).json({
                mesage: "password incorrect"
            })
        }

        const token= jwt.sign({_id:result._id},"mysecretjson");

        return res.status(200).json({
            mesage: "sinup done successfully",
            token
        })

    } catch (error:any) {
        return res.status(500).json({
            message: error.mesage
        })
    }
})
wss.on("connection",(socket)=>{
    
    console.log("connection established");

    socket.on("message",(message)=>{
        
        console.log(message);
        const msg=JSON.parse(message as unknown as string);
        console.log(JSON.stringify(msg));
        if(msg.type==="join")
        {
            console.log(`user joined room ${msg.payload.roomID}`)
            allSocket.push({socket, roomID:msg.payload.roomID})
        }


        if(msg.type === "chat")
        {
            //if the user is sending a text or chat , then find the currentRoom of that user, now 
            //send that text or chat to all the user which are currently present in that room 
            // const currentUserRoom=allSocket.find((x)=> x.socket===socket);
            // console.log( `currentUserRoom is ${JSON.stringify(currentUserRoom)}`)

            let currentUserRoom=null;
            for (let i=0;i<allSocket.length;i++)
            {
                if(allSocket[i].socket=== socket)
                {
                    currentUserRoom=allSocket[i].roomID
                }
            }

            console.log(`user joined room ${msg.payload.message}`)
            console.log(`current user room is ${currentUserRoom}`)

            for(let i=0;i<allSocket.length;i++)
            {
                if(allSocket[i].roomID == currentUserRoom)
                {
                    // currentUserRoom?.socket.send(msg.payload.message)
                    allSocket[i].socket.send(msg.payload.message)
                }
            }
            
        }
    })


})


