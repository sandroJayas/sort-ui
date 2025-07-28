import { DashboardNavbar } from "@/components/shared/Navbar";
import Sidebar from "@/components/profile/Sidebar";
import type React from "react";
import { Card } from "@/components/ui/card";
import Container from "@/components/shared/Container";
import SecuritySettingsPage from "@/components/profile/SecurityForm";

export default function ChangePasswordPage() {
  return (
    <>
      <DashboardNavbar />
      <Container>
        {/* Mobile: Stack, Desktop: Sidebar + Content */}
        <div className="flex flex-col md:flex-row md:gap-6 mt-8">
          <Sidebar tab={"security"} />
          <Card className="flex-1 p-6 rounded-md min-h-[calc(100vh-8rem)] mt-6 md:mt-0">
            <div>
              <h1 className="text-3xl font-bold">Security Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your account security and authentication methods
              </p>
            </div>
            <SecuritySettingsPage />
          </Card>
        </div>
      </Container>
    </>
  );
}
