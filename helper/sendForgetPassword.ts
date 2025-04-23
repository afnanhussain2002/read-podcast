import ForgetPasswordEmail from "@/emails/ForgetPasswordEmail";
import { resend } from "@/lib/resend";

export async function sendForgetPassword(email: string,) {
     try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Vido Note | Forget Password",
            react: ForgetPasswordEmail({email})
        })
        return {success: true, message: "Email sent successfully"}
     } catch (error) {
        return {success: false, message: error as string}
     }
}