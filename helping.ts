import { NextRequest, NextResponse } from "next/server";
import { db } from "./utils/db";

export async function POST(req: NextRequest) {
    const serversData = [
      {
        name: "Server 1",
        capacity: 0,
      },
      {
        name: "Server 2",
        capacity: 0,
      },
      {
        name: "Server 3",
        capacity: 0,
      },
      {
        name: "Server 4",
        capacity: 0,
      },
      {
        name: "Server 5",
        capacity: 0,
      },
      {
        name: "Server 6",
        capacity: 0,
      },
      {
        name: "Server 7",
        capacity: 0,
      },
      {
        name: "Server 8",
        capacity: 0,
      },
      {
        name: "Server 9",
        capacity: 0,
      },
      {
        name: "Server 10",
        capacity: 0,
      },
      {
        name: "Server 11",
        capacity: 0,
      },
      {
        name: "Server 12",
        capacity: 0,
      },
      {
        name: "Server 13",
        capacity: 0,
      },
      {
        name: "Server 14",
        capacity: 0,
      },
      {
        name: "Server 15",
        capacity: 0,
      },
      {
        name: "Server 16",
        capacity: 0,
      },
      {
        name: "Server 17",
        capacity: 0,
      },
      {
        name: "Server 18",
        capacity: 0,
      },
      {
        name: "Server 19",
        capacity: 0,
      },
      {
        name: "Server 20",
        capacity: 0,
      },
    ];
    try {
      await db.server.createMany({ data: serversData });
      // console.log(`Server "${serverData.name}" created successfully.`);
  
      console.log("All servers pushed to the database successfully.");
      return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      console.error("Error:", error);
      return new NextResponse(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500 }
      );
    }
  }