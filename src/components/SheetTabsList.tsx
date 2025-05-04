
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
    <div className="overflow-x-auto">
      <div className="bg-white rounded-lg shadow-md p-1">
        <div className="flex w-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onSelectTab(tab)}
              className={cn(
                "flex-1 min-w-0 px-2 sm:px-4 py-2 text-sm font-medium text-center transition-colors rounded-md",
                selectedTab === tab
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SheetTabsList;
