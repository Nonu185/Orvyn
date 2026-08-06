import { generateResponse,generatechatTitle } from "../services/Ai.services.js";
import chatmodel from "../models/chat.model.js";
import messageModel from "../models/message.model.js" 

//chat controller
export async function chatController(req, res) {
  try {
    //get data from the request
    const {message,chat:chatid} = req.body
   
    let title =null, chat=null;
    //if no chat id is provided then create a new chat
    if(!chatid){
     title = await generatechatTitle(message);
     chat = await chatmodel.create({
        user:req.user.id,
        title,
    })
}
//saving user message to the database
    const userMessage = await messageModel.create({
        chat:chatid || chat._id,
        content:message,
        role:"user"
    })
//finding all messages of the chat (including the user message just saved)
    const activeChatId = chatid || chat._id;
    const messages = await messageModel.find({chat: activeChatId});
    // calling ai to generate response
     const response = await generateResponse(messages);
    //saving ai response to the database
    const AIMessage = await messageModel.create({
        chat: activeChatId,
        content:response,
        role:"AI"
    })
        
  
    return res.status(201).json(
        {
            title,
            chat,
            userMessage,
            AIMessage
        });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
//get all the chats of the user
export async function getchats(req,res){
    try {
        const user = req.user;
        const chats = await chatmodel.find({user:user.id})
        return res.status(200).json({
           message:"chats retrieved successfully",
           chats
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
//get all the messages of a chat
export async function getMessages(req,res){
    const {chatid} = req.params;
     const chat = await chatmodel.findOne({_id:chatid,user:req.user.id});
    if(!chat) 
        {
         return res.status(404).json(
         {message:"chat not found"}
        );
    }
    
    const messages = await messageModel.find({chat:chatid});
    return res.status(200).json({
       message:"messages retrieved successfully",
       messages
    })
    
}
//delete chat
export async function deleteChat(req,res){
    const {chatid} = req.params;
    const chat = await chatmodel.findOneAndDelete({_id:chatid,user:req.user.id});
    await messageModel.deleteMany({chat:chatid});
    if(!chat) 
        {
         return res.status(404).json(
         {message:"chat not found"}
        );
    }
    return res.status(200).json({
       message:"chat deleted successfully"
    })
}