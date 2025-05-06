import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StoreBoxWizard from "@/components/boxes/StoreBoxWizard";

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
    <>
      <div className="grid md:flex md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">My Boxes</h1>

        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10 pr-4 py-2 w-full md:w-80 border-gray-300 h-10 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              placeholder="Search all boxes"
              //TODO detect stop typing
              onChange={(event) => {
                setNameFilter(
                  event.target.value === "" ? null : event.target.value,
                );
              }}
            />
          </div>
        </div>
      </div>
      <div className="grid md:flex md:justify-between md:items-center gap-4 mb-4">
        <div className={"flex items-center gap-4 mb-4"}>
          <div className="text-sm font-medium">
            <span className="font-bold">{boxes} box</span> created in
          </div>

          <Select
            defaultValue="3months"
            onValueChange={(value) => {
              setTimeFilter(value);
            }}
          >
            <SelectTrigger className="w-[160px] h-9 text-sm border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">last 30 days</SelectItem>
              <SelectItem value="3months">past 3 months</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <StoreBoxWizard />
      </div>
    </>
  );
};

export default Header;
