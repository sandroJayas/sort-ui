import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// Handle GET (list boxes)
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STORAGE_SERVICE_URL}/boxes`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    },
  );

  const data = await res.json();
  return NextResponse.json(data);
}

// Handle POST (create box)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STORAGE_SERVICE_URL}/boxes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    },
  );

  const data = await res.json();
  return new NextResponse(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
