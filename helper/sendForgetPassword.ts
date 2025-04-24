import ForgetPasswordEmail from "@/emails/ForgetPasswordEmail";
import { resend } from "@/lib/resend";

export async function sendForgetPassword(email: string, resetPasswordLink: string) {
   try {
      await resend.emails.send({
         from: 'onboarding@resend.dev',
         to: "afnanhussain2022@gmail.com",
         subject: 'Vido Note | Reset Password',
         react: ForgetPasswordEmail({email,resetPasswordLink}) ,
       });
     return {success:true,message:"verification email send successfully"}
    } catch (emailError) {
     console.log("Error sending verification email");
     return {success:false,message:"Failed to send verification email"}
    }
 }