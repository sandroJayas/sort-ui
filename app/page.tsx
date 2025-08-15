// app/page.tsx
"use client";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to storage
    if (status === "authenticated") {
      router.push("/storage");
    }
    // If not authenticated and not loading, trigger sign in
    else if (status === "unauthenticated") {
      signIn("auth0", { callbackUrl: "/storage" });
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return null;
};

export default Page;
