import { model, Schema } from "mongoose";


const UserSchema=new Schema({
    username: {
      type: String, 
      require: true,
      unique: true
    },
    password: {
       type: String, 
       require: true
    },
    name: {
       type: String, 
       require: true
    }
})


export const user=model("user",UserSchema);