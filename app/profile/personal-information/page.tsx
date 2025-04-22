import { DashboardNavbar } from "@/components/dashboard/Navbar";
import Sidebar from "@/components/profile/Sidebar";
import type React from "react";
import PersonalInformationForm from "@/components/profile/personal-information-form";
import { Card } from "@/components/ui/card";

export default function PersonalInformationPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <DashboardNavbar />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Mobile: Stack, Desktop: Sidebar + Content */}
        <div className="flex flex-col md:flex-row md:gap-6 mt-8">
          <Sidebar tab={"personal-information"} />
          <Card className="flex-1 bg-white p-6 border rounded-md min-h-[calc(100vh-8rem)] mt-6 md:mt-0">
            <h1 className="text-2xl font-semibold">Personal information</h1>
            <PersonalInformationForm />
          </Card>
        </div>
      </div>
    </div>
  );
}
