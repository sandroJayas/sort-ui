import { DashboardNavbar } from "@/components/boxes/Navbar";
import Sidebar from "@/components/profile/Sidebar";
import type React from "react";
import { Card } from "@/components/ui/card";
import Container from "@/components/shared/Container";

const AuthorizationPage = () => {
  return (
    <>
      <DashboardNavbar />
      <Container>
        {/* Mobile: Stack, Desktop: Sidebar + Content */}
        <div className="flex flex-col md:flex-row md:gap-6 mt-8">
          <Sidebar tab={"authorization"} />
          <Card className="flex-1 bg-white p-6 border rounded-md min-h-[calc(100vh-8rem)] mt-6 md:mt-0">
            <h1 className="text-2xl font-semibold">Authorization form</h1>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default AuthorizationPage;
