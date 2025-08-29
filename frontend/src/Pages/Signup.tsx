import { useState } from "react"



export default function Signup(){
    const [username, setUsername]=useState("");
    const [password, setPassword]=useState("");
    const [chatname, setChatName]=useState("")

    function onclick(){
        //save the user details to the database
        //needed user details to show in the chat for example username 
    }
    return (
        <div>
            <input type="text" onChange={(e)=>{
                setUsername(e.target.value)
            }} placeholder="Enter your username" />
            <input type="text" onChange={(e)=>{
                setPassword(e.target.value)
            }} placeholder="Password...." />

            <input type="text" onChange={(e)=>{
                setChatName(e.target.value)
            }} placeholder="Set the chat name...." />
            <button onClick={onclick}>Submit</button>
        </div>
    )
}