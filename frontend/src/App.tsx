

import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [socket,setSocket]=useState<WebSocket | null>(null);
  const inputRef=useRef("");

  const [messages, setMessage]=useState<String[]>([]);

  useEffect(()=>{
    const ws=new WebSocket("ws://localhost:8080");

    ws.onopen=()=>{
      console.log("connection established");
      
      ws.send(JSON.stringify({
        type:"join",
        payload:{
          roomID:"red"
        }
      }));

    }

    ws.onmessage=(message)=>{
      console.log( `Message received -> ${message.data}`)
      setMessage(m => [...m,message.data]);
    }



    setSocket(ws);

    // return ()=>{
    //   ws?.close();
    // }
  },[])


  return (

    <div className='h-screen bg-black'>
       <div className='h-[95vh] p-8'>
          {messages.map((msg)=> <div className='m-10'>
            <span className='bg-white text-black rounded p-4 m-4'> {msg} 
              </span>
            </div>)}
       </div>

       <div className='w-full bg-white p-4 flex justify-between'>
          <input ref={inputRef} className='flex-1 outline-none' type="text" placeholder="Enter your messages..."></input>
          <button onClick={()=>{
            console.log("button clicked");
            const message=inputRef.current.value;
            console.log(message);
            socket?.send(JSON.stringify({
              type:"chat",
              payload:{
                "message":message
              }
            }));
            inputRef.current.value=""
          }} className='bg-purple-600 text-white p-2 rounded-2xl ml-2 cursor-pointer '> Send Message</button> 

       </div>
    </div>
    
  )
}

export default App
