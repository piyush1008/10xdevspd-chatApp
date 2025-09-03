import mongoose, { model } from "mongoose";


const roomSchema=new mongoose.Schema({
    roomID:{
        type: String, 
        requied: true
    },
    username: {
        type: String, 
        require: true
    }
})

const room=model("room", roomSchema);

export default room;