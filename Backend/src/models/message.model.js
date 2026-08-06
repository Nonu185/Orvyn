import mongoose from "mongoose";
const messageSchema = mongoose.Schema({
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat",
        required:true
    },
    role:{
        type:String,
        enum:["user","AI"],
        required:true
    },
    content:{
        type:String,
        required:true
    }
},{
    timestamps:true,
})

const messageModel = mongoose.model("message",messageSchema);
export default messageModel;