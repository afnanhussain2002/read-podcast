import ForgetPasswordEmail from "@/emails/ForgetPasswordEmail";
import { resend } from "@/lib/resend";

export async function sendForgetPassword(email: string, resetPasswordLink: string) {
     try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Vido Note | Forget Password",
            react: ForgetPasswordEmail({email, resetPasswordLink})
        })
        return {success: true, message: "Reset password email has been sent."}
     } catch (error) {
        return {success: false, message: error as string}
     }
}