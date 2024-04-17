import { db } from "@/utils/db";
import { NextResponse, NextRequest } from "next/server";

async function getRandomServerWithCapacity(capacity: number) {
    // Find all servers with the specified capacity
    const servers = await db.server.findMany({
        where: {
            capacity: capacity
        }
    });

    if (servers.length === 0) {
        // If no servers with the specified capacity are found, return null
        return null;
    }

    // Generate a random index within the range of the servers array
    const randomIndex = Math.floor(Math.random() * servers.length);

    // Return the server at the random index
    return servers[randomIndex];
}

export async function GET(req: NextRequest) {
    try {
        let server = await getRandomServerWithCapacity(1);

        if (!server) {
            server = await getRandomServerWithCapacity(0);
        }

        if (server) {
            return new NextResponse(JSON.stringify({server,success:true}),{status:200});
        } else {
            return new NextResponse(JSON.stringify({ message: "No available server found." }), { status: 404 });
        }
    } catch (error) {
        console.error("Error:", error);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
