import { useEffect, useState } from "react";


export default function useWebSocket(){
    const [socket,setSocket]=useState<WebSocket | null>(null);
    const [messages,setMessages]=useState<String []>([]);
  

    useEffect(()=>{
        const ws=new WebSocket("ws://localhost:8080");

        ws.onopen=()=>{
            console.log("connection established");

            ws.send(JSON.stringify({
                type:"join",
                payload:{
                    roomID:"red"
                }
            }))
        }


        ws.onmessage=(message)=>{
           setMessages(prev=>[...prev, message.data])
        }   

        setSocket(ws);
    },[])

    return {
        socket,messages
    }
}