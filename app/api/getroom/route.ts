import { db } from "@/utils/db";
import { NextResponse, NextRequest } from "next/server";

async function getRandomServerWithCapacity(capacity: number) {
  const servers = await db.server.findMany({
    where: {
      capacity: capacity,
    },
  });

  if (servers.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * servers.length);
  return servers[randomIndex];
}



export async function GET(req: NextRequest) {
  try {
    let server = await getRandomServerWithCapacity(1);

    if (!server) {
      server = await getRandomServerWithCapacity(0);
    }

    if (server) {
      console.log(`Got an server ${server.name}`);
      return new NextResponse(JSON.stringify({ server, success: true }), {
        status: 200,
      });
    } else {
      return new NextResponse(
        JSON.stringify({ message: "No available server found." }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, room, capacity } = await request.json();
    console.log(`FPUT details ${id} ${room} ${capacity}`);
    const server = await db.server.findUnique({
      where: {
        id: room
      }})
    if (server) {
      let updatedCapacity = server.capacity + capacity;
      if (updatedCapacity < 0) updatedCapacity = 0; // Ensure capacity doesn't go negative
      if(capacity >2) updatedCapacity = 2
      // Update server capacity
      const updatedServer = await db.server.update({
        where: {
          id: room,
        },
        data: {
          capacity: updatedCapacity,
        },
      });
    }
    console.log(`now servernumber ${server?.name}`)
    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
