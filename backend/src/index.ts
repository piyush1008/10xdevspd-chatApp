import { WebSocketServer,WebSocket } from "ws";


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


