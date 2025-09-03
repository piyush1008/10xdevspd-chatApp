import { WebSocketServer,WebSocket } from "ws";
import express from "express"
import { user } from "./schema/UserSchema";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import cors from "cors";
import { DB } from "./db";

const wss=new WebSocketServer({port:8080})

let usercount=0;

interface User{
    socket: WebSocket,
    roomID: string,
    username?: string
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
    socket: "socket1", room : room1, , username : username
    socket: "socket2", room : room2,
    socket: "socket1", room: room1
    ]
*/
DB();

const app=express();

app.use(express.json());
app.use(cors());


app.get("/room/:id/exists", (req, res) => {
    const roomId = req.params.id;
    const exists = allSocket.some((u) => u.roomID === roomId);
    console.log(`room exist ${exists}`)
    return res.status(200).json({ exists });
});

app.post("/signup",async (req,res)=>{
    try {
        const {username, password, email}=req.body;
        const result=await user.findOne({
            email:email        
        })
        if(result)
        {
            return res.status(401).json({
                message: "username already exist"
            })
        }
        const hashpassword=await bcrypt.hash(password,10);
        const newUser = await user.create({
            username, 
            password:hashpassword, 
            email
        })

        // const token = jwt.sign({_id: newUser._id}, "mysecretjson");

        return res.status(200).json({
            mesage: "sinup done successfully",
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        })

    } catch (error:any) {
        return res.status(500).json({
            error: error.message
        })
    }
})

app.post("/signin",async (req,res)=>{
    try {
        const {password, email}=req.body;
        console.log(`email is ${email} and password is ${password}`)
        const result=await user.findOne({
            email:email
        })
        if(!result)
        {
            return res.status(401).json({
                message: "Please sign up first"
            })
        }
         const passwordCompare=await bcrypt.compare(password, result.password as string)

        if(!passwordCompare) {
            return res.status(401).json({
                mesage: "password incorrect"
            })
        }

        const token= jwt.sign({_id:result._id},"mysecretjson");
        console.log(token)

        return res.status(200).json({
            mesage: "signin  done successfully",
            token,
            user: {
                _id: result._id,
                username: result.username,
                email: result.email
            }
        })

    } catch (error:any) {
        return res.status(500).json({
            message: error.mesage
        })
    }
})



app.post("/me",async (req,res)=>{
    const token=req.body.token;
    if(!token)
    {
        return res.status(401).json({
            message: "please login first"
        })
    }
    
    try {
        const decoded = jwt.verify(token, "mysecretjson") as {_id: string};
        const userData = await user.findById(decoded._id);
        
        if (!userData) {
            return res.status(401).json({
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            message: "user is already logged in",
            user: {
                _id: userData._id,
                username: userData.username,
                email: userData.email
            }
        });
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
})

app.post("/logout",(req,res)=>{
    const token=req.body.token;
    if(!token)
    {
        return res.status(401).json({
            message: "please login first"
        })
    }

    
    return res.status(200).json({
        message: "user is already logged in"
    })
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
            allSocket.push({socket, roomID:msg.payload.roomID, username: msg.payload.username})
        }


        if(msg.type === "chat")
        {
            //if the user is sending a text or chat , then find the currentRoom of that user, now 
            //send that text or chat to all the user which are currently present in that room 
            // const currentUserRoom=allSocket.find((x)=> x.socket===socket);
            // console.log( `currentUserRoom is ${JSON.stringify(currentUserRoom)}`)

            let currentUserRoom=null;
            let currentUsername=null;
            for (let i=0;i<allSocket.length;i++)
            {
                if(allSocket[i].socket=== socket)
                {
                    currentUserRoom=allSocket[i].roomID
                    currentUsername=allSocket[i].username
                }
            }

            console.log(`user joined room ${msg.payload.message}`)
            console.log(`current user room is ${currentUserRoom}`)

            const messageWithUsername = {
                message: msg.payload.message,
                username: currentUsername,
                timestamp: new Date().toISOString()
            };

            for(let i=0;i<allSocket.length;i++)
            {
                if(allSocket[i].roomID == currentUserRoom)
                {
                    // currentUserRoom?.socket.send(msg.payload.message)
                    allSocket[i].socket.send(JSON.stringify(messageWithUsername))
                }
            }
            
        }
    })


})


app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})


