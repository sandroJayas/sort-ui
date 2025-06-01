import { DashboardNavbar } from "@/components/boxes/Navbar";
import React from "react";
import Container from "@/components/shared/Container";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  console.log(session);

  return (
    <>
      <DashboardNavbar />
      <Container>something</Container>
    </>
  );
}
