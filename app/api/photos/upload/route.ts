import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the form data from the request
    const formData = await request.formData();

    // Forward the request to the storage service
    const res = await fetch(
      `${process.env.STORAGE_SERVICE_URL}/photos/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: formData,
      },
    );

    const data = await res.json();

    // Forward the response with the same status code
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Photo upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload photos" },
      { status: 500 },
    );
  }
}
