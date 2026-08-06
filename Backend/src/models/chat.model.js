import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        title:{
            type:String,
            required:true,
            default:"New Chat",
            trim:true
        }
},
{ timestamps: true}
);
const chatmodel = mongoose.model("chat",chatSchema);
export default chatmodel;
