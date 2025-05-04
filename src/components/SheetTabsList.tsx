
import React from "react";
import { cn } from "@/lib/utils";

interface SheetTabsListProps {
  tabs: string[];
  selectedTab: string;
  onSelectTab: (tab: string) => void;
}

const SheetTabsList: React.FC<SheetTabsListProps> = ({
  tabs,
  selectedTab,
  onSelectTab,
}) => {
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto bg-white rounded-t-lg p-1">
      <div className="flex min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onSelectTab(tab)}
            className={cn(
              "px-6 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
              selectedTab === tab
                ? "bg-primary text-white"
                : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SheetTabsList;
