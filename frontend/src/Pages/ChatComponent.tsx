

import { useEffect, useRef, useState } from 'react'

function ChatComponent() {
  const [socket,setSocket]=useState<WebSocket | null>(null);
  const [roomId, setRoomId]=useState("");
  const inputRef=useRef("");

  function generateRandomString() {
    return Math.random().toString(36).substring(2, 7);
  }
  


  const [messages, setMessage]=useState<String[]>([]);

  useEffect(()=>{
    const ws=new WebSocket("ws://localhost:8080");

    const rmid= generateRandomString();
    console.log(rmid)

    

    ws.onopen=()=>{
      console.log("connection established");
      
      ws.send(JSON.stringify({
        type:"join",
        payload:{
          roomID:rmid
        }
      }));

    }

    setRoomId(rmid)

    ws.onmessage=(message)=>{
      console.log( `Message received -> ${message.data}`)
      setMessage(m => [...m, message.data]);
    }



    setSocket(ws);

    // return ()=>{
    //   ws?.close();
    // }
  },[])


  return (

    <div className='min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50'>
      <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
        <div className='max-w-3xl mx-auto space-y-3'>
          {messages.map((msg, idx)=> (
            <div key={idx} className={`flex ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <span className={`${idx % 2 === 0 ? 'bg-white text-gray-800' : 'bg-green-500 text-white'} rounded-2xl px-4 py-2 shadow-md max-w-[80%] break-words`}>
                {msg}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className='fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-gray-200'>
        <div className='max-w-3xl mx-auto p-3 sm:p-4 flex items-center gap-2'>
          <input ref={inputRef} className='flex-1 outline-none bg-white border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition' type="text" placeholder="Enter your message..." />
          <button onClick={()=>{
            console.log("button clicked");
            const message=inputRef.current?.value || "";
            if (!message.trim()) return;
            console.log(message);
            socket?.send(JSON.stringify({
              type:"chat",
              payload:{
                "message":message
              }
            }));
            if (inputRef.current) inputRef.current.value="";
          }} className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl shadow-md transition cursor-pointer'>Send</button> 
          <div>
             {roomId}
          </div>
        </div>
        
      </div>
    </div>
    
  )
}

export default ChatComponent
