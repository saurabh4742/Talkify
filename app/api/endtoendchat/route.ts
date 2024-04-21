import { db } from "@/utils/db";
import { NextResponse, NextRequest } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { serverId, senderId, message } = await req.json();
    
    const newMessage = await db.chat.create({
      data: {
        server: { connect: { id: serverId } },
        sender: { connect: { id: senderId } },
        message,
      },
    });
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url=new URL(req.url)
    const serverId=url.searchParams.get("serverId")
    if(serverId){
      const chats = await db.chat.findMany({
        where: {
          serverId,
        },
        include: {
          server: true,
          sender: true,
        },
      });
      return new NextResponse(JSON.stringify({ chats, success: true }), {
        status: 200,
      });
    }
    else return new NextResponse(
      JSON.stringify({ error: "No data found" }),
      { status: 404 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const servers = await db.server.findMany({
      where: {
        capacity: { lt: 2 },
      },
    });

    for (const server of servers) {
      await db.chat.deleteMany({
        where: {
          serverId: server.id,
        },
      });
    }
  } catch (error) {}
}
