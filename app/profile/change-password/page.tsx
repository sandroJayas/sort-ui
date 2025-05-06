import { DashboardNavbar } from "@/components/boxes/Navbar";
import Sidebar from "@/components/profile/Sidebar";
import type React from "react";
import { Card } from "@/components/ui/card";
import Container from "@/components/shared/Container";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <>
      <DashboardNavbar />
      <Container>
        {/* Mobile: Stack, Desktop: Sidebar + Content */}
        <div className="flex flex-col md:flex-row md:gap-6 mt-8">
          <Sidebar tab={"change-password"} />
          <Card className="flex-1 p-6 rounded-md min-h-[calc(100vh-8rem)] mt-6 md:mt-0">
            <h1 className="text-2xl font-semibold">Change password</h1>
            <ChangePasswordForm />
          </Card>
        </div>
      </Container>
    </>
  );
}
