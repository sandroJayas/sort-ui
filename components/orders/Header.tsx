import React from "react";
import { Search } from "lucide-react";
import OrderWizard from "@/components/orders/OrderWizard";

const Header = ({
  boxes,
  setTimeFilter,
  setNameFilter,
}: {
  boxes: number;
  setTimeFilter: (timeFilter: string) => void;
  setNameFilter: (name: string | null) => void;
}) => {
  return (
    <div className="space-y-6">
      {/* Title and Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#333333] leading-tight">
          My Storage
        </h1>

        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333333] opacity-40 w-5 h-5"
            strokeWidth={1.5}
          />
          <input
            type="text"
            placeholder="Search all boxes"
            className="w-full bg-white border border-[#DADCE0] rounded-md pl-10 pr-4 py-2.5 text-base text-[#333333] placeholder-gray-400 focus:border-[#1742B1] focus:ring focus:ring-[#1742B1]/20 transition-all duration-200"
            onChange={(event) => {
              setNameFilter(
                event.target.value === "" ? null : event.target.value,
              );
            }}
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#333333]">
            <span className="font-semibold">
              {boxes} box{boxes !== 1 ? "es" : ""}
            </span>{" "}
            created in
          </span>
          <select
            className="bg-white border border-[#DADCE0] rounded-md px-4 py-2 text-sm text-[#333333] focus:border-[#1742B1] focus:ring focus:ring-[#1742B1]/20 transition-all duration-200"
            defaultValue="3months"
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="30days">last 30 days</option>
            <option value="3months">past 3 months</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        <OrderWizard />
      </div>
    </div>
  );
};

export default Header;
