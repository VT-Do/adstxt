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
  onSelectTab 
}) => {
  return (
    <div className="bg-white rounded-md overflow-auto">
      <div className="flex">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={selectedTab === tab ? "default" : "ghost"}
            className={`rounded-none px-5 py-2 h-12 ${
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
