import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/utils/db';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req:NextRequest) {
    

  try {
    const { email } = await req.json()
    const user=await db.user.findUnique({where:{email}})
    if(user){
      const data = await resend.emails.send({
        from: `${process.env.FROM_EMAIL}`,
        to: `${email}`,
        subject: "To reset your password, please use the link that has been sent to your email.",
        html: `
        <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <p>Hello ${user?.name},</p>
        <p>To reset your password, please click on the following link:</p>
        <p><a href="${process.env.APP_URL}/auth/resetpassword/${user?.id}" style="background-color: #22C55E; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a></p>
        <p>If you didn't request this, you can ignore this email.</p>
        <p>Thanks,</p>
        <p>The ${process.env.APP_NAME} Team</p>
    </div>
</body>
    `,
    });
    return new NextResponse(JSON.stringify({message:"🔑 A password reset link has been sent."}),{status:201})
    }
    return new NextResponse(JSON.stringify({message:"gmail not exits error."}),{status:501})
    
  } catch (error) {
    return new NextResponse(JSON.stringify({message:"server error."}),{status:501})
  }
};