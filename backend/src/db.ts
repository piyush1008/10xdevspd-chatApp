import mongoose from "mongoose";



export async function DB(){
   await mongoose.connect("mongodb+srv://piyushsunnyst:piyushsunnyst@cluster0.uravwxx.mongodb.net/chatapp").then(()=>{
    console.log("DB connected successfully")
   }).catch((err:any)=>{
    console.log("DB connection failed",err)
   })
}