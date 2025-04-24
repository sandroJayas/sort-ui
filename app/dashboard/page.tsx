import { DashboardNavbar } from "@/components/dashboard/Navbar";
import BoxCard from "@/components/dashboard/BoxCard";
import Header from "@/components/dashboard/Header";

export default function DashboardPage() {
  return (
    <>
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Header />
        <BoxCard />
        <BoxCard />
        <BoxCard />
      </div>
    </>
  );
}
