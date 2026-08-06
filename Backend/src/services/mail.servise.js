import 'dotenv/config';
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"oauth2",
        user:process.env.GOOGLE_USER,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        refreshToken:process.env.GOOGLE_REFRESH_TOKEN,
       clientId:process.env.GOOGLE_CLIENT_ID,
    }
})
transporter.verify()
.then(()=>{
    console.log("mail server is ready")
})
.catch((err)=>{
    console.error(err);
})

export async function sendEmails(to,subject,html,text){
    const mailoption={
        from:process.env.GOOGLE_USER,
        to:to,
        subject:subject,
        html:html,
        text:text,
    }
      const details =  await transporter.sendMail(mailoption);
        console.log("email send successfully",details);
   
}