import { NextResponse,NextRequest } from "next/server";
import { db } from "@/utils/db";
import bcryptjs from "bcryptjs"
export async function POST(req:NextRequest) {
    try {
        const {id,newpassword}=await req.json();
        const hashpassword=await bcryptjs.hash(newpassword,10);
        const existingUser=await db.user.update({where:{
            id
        },data:{
            password:hashpassword
        }})
        return NextResponse.json({message:`Password Reset Successfull ${existingUser.name}`},{status:200})
    } catch (error) {
        console.log("error from user creation")
        return NextResponse.json(error)
    }
}