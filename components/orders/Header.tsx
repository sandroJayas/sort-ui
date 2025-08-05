import React, { memo, useCallback, useRef, useEffect } from "react";
import { Search, Calendar } from "lucide-react";
import OrderWizard from "@/components/orders/OrderWizard";

interface HeaderProps {
  setTimeFilter: (timeFilter: string) => void;
  setNameFilter: (name: string | null) => void;
}

const TIME_FILTERS = [
  { value: "30days", label: "Last 30 days", icon: "📅" },
  { value: "3months", label: "Past 3 months", icon: "📆" },
  { value: "2025", label: "2025", icon: "🗓️" },
  { value: "2024", label: "2024", icon: "🗓️" },
] as const;

const Header: React.FC<HeaderProps> = memo(
  ({ setTimeFilter, setNameFilter }) => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

    // Debounced search handler
    const handleSearchChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }

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

    return (
      <header className="space-y-6">
        {/* Title and Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Storage Overview
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track your stored items
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <OrderWizard />
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <label htmlFor="search-boxes" className="sr-only">
              Search all boxes
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              id="search-boxes"
              type="text"
              placeholder="Search orders by ID, type, or status..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1742B1]/20 focus:border-[#1742B1] transition-all duration-200"
              onChange={handleSearchChange}
              aria-label="Search boxes"
              autoComplete="off"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <label htmlFor="time-filter" className="sr-only">
                Filter by time period
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="time-filter"
                className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1742B1]/20 focus:border-[#1742B1] transition-all duration-200 cursor-pointer"
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
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  },
);

Header.displayName = "Header";

export default Header;
