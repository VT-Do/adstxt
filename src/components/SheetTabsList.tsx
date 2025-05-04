import React from "react";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="bg-white rounded-md overflow-x-auto">
      <div
        className={`grid grid-cols-${tabs.length} min-w-full`}
        style={{ minWidth: `${tabs.length * 100}px` }} // fallback for very small screens
      >
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={selectedTab === tab ? "default" : "ghost"}
            className={`rounded-none w-full h-12 text-sm ${
              selectedTab === tab
                ? "bg-primary text-white"
                : "text-gray-700 hover:text-primary"
            }`}
            onClick={() => onSelectTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SheetTabsList;
