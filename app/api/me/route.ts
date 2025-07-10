import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${process.env.USER_SERVICE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  // Return null for 404s instead of an error
  if (res.status === 404) {
    return NextResponse.json(null);
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data.user);
}
