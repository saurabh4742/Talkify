import { NextResponse,NextRequest } from "next/server";
import { db } from "@/utils/db";
export async function POST(req:NextRequest) {
    try {
        const {id}=await req.json();
        const existingUser=await db.user.update({where:{
            id
        },data:{
                banned:true
        }})
            return NextResponse.json({message:"user banned"},{status:201})
    } catch (error) {
        console.log("error from user creation")
        return NextResponse.json({error},{status:501})
    }
}