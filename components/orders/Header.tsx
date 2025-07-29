import React, { memo, useCallback, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import OrderWizard from "@/components/orders/OrderWizard";

interface HeaderProps {
  boxes: number;
  setTimeFilter: (timeFilter: string) => void;
  setNameFilter: (name: string | null) => void;
}

const TIME_FILTERS = [
  { value: "30days", label: "last 30 days" },
  { value: "3months", label: "past 3 months" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
] as const;

type TimeFilterValue = (typeof TIME_FILTERS)[number]["value"];

const Header: React.FC<HeaderProps> = memo(
  ({ boxes, setTimeFilter, setNameFilter }) => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

    // Debounced search handler
    const handleSearchChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        // Clear existing timeout
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for debounced search
        searchTimeoutRef.current = setTimeout(() => {
          setNameFilter(value === "" ? null : value);
        }, 300);
      },
      [setNameFilter],
    );

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }, []);

    const handleTimeFilterChange = useCallback(
      (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTimeFilter(event.target.value);
      },
      [setTimeFilter],
    );

    const boxText = boxes === 1 ? "box" : "boxes";

    return (
      <header className="space-y-6">
        {/* Title and Search Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#333333] leading-tight">
            My Storage
          </h1>

          <div className="relative w-full md:w-96">
            <label htmlFor="search-boxes" className="sr-only">
              Search all boxes
            </label>
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333333] opacity-40 w-5 h-5 pointer-events-none"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              id="search-boxes"
              type="text"
              placeholder="Search all boxes"
              className="w-full bg-white border border-[#DADCE0] rounded-md pl-10 pr-4 py-2.5 text-base text-[#333333] placeholder-gray-400 focus:border-[#1742B1] focus:ring focus:ring-[#1742B1]/20 transition-all duration-200"
              onChange={handleSearchChange}
              aria-label="Search boxes"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#333333]">
              <span className="font-semibold">
                {boxes} {boxText}
              </span>{" "}
              created in
            </span>
            <label htmlFor="time-filter" className="sr-only">
              Filter by time period
            </label>
            <select
              id="time-filter"
              className="bg-white border border-[#DADCE0] rounded-md px-4 py-2 text-sm text-[#333333] focus:border-[#1742B1] focus:ring focus:ring-[#1742B1]/20 transition-all duration-200 cursor-pointer"
              defaultValue="3months"
              onChange={handleTimeFilterChange}
              aria-label="Filter boxes by time period"
            >
              {TIME_FILTERS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <OrderWizard />
        </div>
      </header>
    );
  },
);

Header.displayName = "Header";

export default Header;
