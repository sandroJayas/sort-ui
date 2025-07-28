import { DashboardNavbar } from "@/components/shared/Navbar";
import Sidebar from "@/components/profile/Sidebar";
import type React from "react";
import PersonalDataForm from "@/components/profile/PersonalDataForm";
import { Card } from "@/components/ui/card";
import Container from "@/components/shared/Container";

export default function PersonalInformationPage() {
  return (
    <>
      <DashboardNavbar />
      <Container>
        {/* Mobile: Stack, Desktop: Sidebar + Content */}
        <div className="flex flex-col md:flex-row md:gap-6 mt-8">
          <Sidebar tab={"personal-information"} />
          <Card className="flex-1 p-6 rounded-md min-h-[calc(100vh-8rem)] mt-6 md:mt-0">
            <h1 className="text-2xl font-semibold">Personal information</h1>
            <PersonalDataForm />
          </Card>
        </div>
      </Container>
    </>
  );
}
