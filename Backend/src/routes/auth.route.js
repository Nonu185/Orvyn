import { Router } from "express";
import {register,verifyEmail,login,getme,logout} from '../controller/auth.controler.js'
import {authMiddleware} from '../middlewear/auth.midddlewear.js'
const authRouter = Router();



authRouter.post("/register",register)
authRouter.get("/verify-email",verifyEmail)
authRouter.post("/login",login)
authRouter.post("/logout",logout)
authRouter.get("/getme",authMiddleware,getme)

 

export default authRouter;