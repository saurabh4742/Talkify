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

export async function PUT(req: NextRequest) {
    try {
        const {id,room,capacity}=await req.json();
        const server = await db.server.findUnique({
            where: {
                id: room
            }
            ,include: {
                users: true // Include the users associated with the server
            }
        });
        
        if (server && server.capacity !== undefined) {
            const updatedCapacity = server.capacity + capacity;
            const updatedUsers = [...server.users, id];
            const updatedServer = await db.server.update({
                where: {
                    id: room
                },
                data: {
                    capacity: updatedCapacity,users: {
                        set: updatedUsers // Set the entire users array to the updated array
                    }
                }
            });}
            return new NextResponse(JSON.stringify({success:true}),{status:200});
    } catch (error) {
        console.error("Error:", error);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}