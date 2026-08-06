import { Router } from "express";
import { authMiddleware } from "../middlewear/auth.midddlewear.js";
import { chatController,getchats,getMessages,deleteChat } from "../controller/chat.controller.js";

const chatRouter = Router();
chatRouter.post('/message',authMiddleware,chatController);
chatRouter.get('/',authMiddleware,getchats);
chatRouter.get('/:chatid/messages',authMiddleware,getMessages);
chatRouter.delete('/delete/:chatid',authMiddleware,deleteChat);


export default chatRouter;
