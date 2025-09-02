import { model, Schema } from "mongoose";


const UserSchema=new Schema({
    email: {
      type: String, 
      require: true,
      unique: true
    },
    password: {
       type: String, 
       require: true
    },
    username: {
       type: String, 
       require: true
    }
})


export const user=model("user",UserSchema);