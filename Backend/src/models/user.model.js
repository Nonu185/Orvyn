import mongoose from "mongoose";
import bcrypt from "bcryptjs";
 const userSchema = mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            trim:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            lowercase:true,
        },
        password:{
            type:String,
            required:true,
            minLength:6,
        },
        verified:{
            type:Boolean,
            default:false,
        },
    },
    {timestamps:true},
)
const usermodel = mongoose.model("user",userSchema);

export default usermodel;