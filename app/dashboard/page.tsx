import { DashboardNavbar } from "@/components/shared/Navbar";
import React from "react";
import Container from "@/components/shared/Container";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <DashboardNavbar />
      <Container>
        <p>{session?.user.email}</p> <p>{session?.accessToken}</p>
      </Container>
    </>
  );
}
