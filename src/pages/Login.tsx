
import React, { useState } from "react";
import { useSheetData } from "@/hooks/useSheetData";
import SheetTabsList from "@/components/SheetTabsList";
import SearchToolbar from "@/components/SearchToolbar";
import PaginatedDataTable from "@/components/PaginatedDataTable";

const Login = () => {
  // Google Sheet URL from the user's request
  const sheetUrl = "https://docs.google.com/spreadsheets/d/1z2NQ13FS_eVrgRd-b49_tsGKtemXpi1v/edit?gid=916740284#gid=916740284";
  
  const {
    sheetData,
    sheetTabs,
    selectedSheetTab,
    isLoading,
    searchTerm,
    filteredData,
    setSelectedSheetTab,
    setSearchTerm,
    loadSheetData
  } = useSheetData(sheetUrl);
  
  // State for column visibility
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  // Initialize visible columns when data changes
  React.useEffect(() => {
    if (sheetData.length > 0 && visibleColumns.length === 0) {
      setVisibleColumns(Object.keys(sheetData[0]));
    }
  }, [sheetData]);

  const handleRefresh = () => {
    if (selectedSheetTab) {
      loadSheetData(selectedSheetTab);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f1429]">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Recommendations per Market</h1>
        </div>

        <div className="space-y-6">
          {/* Tabs Navigation */}
          <SheetTabsList 
            tabs={sheetTabs}
            selectedTab={selectedSheetTab}
            onSelectTab={setSelectedSheetTab}
          />

          <div className="bg-white rounded-lg shadow-md">
            {/* Search and Refresh Toolbar */}
            <SearchToolbar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onRefresh={handleRefresh}
              isLoading={isLoading}
              data={sheetData}
              columns={sheetData.length > 0 ? Object.keys(sheetData[0]) : []}
              visibleColumns={visibleColumns}
              onColumnVisibilityChange={setVisibleColumns}
            />

            {/* Data Table with Pagination and Sorting */}
            <PaginatedDataTable 
              isLoading={isLoading}
              data={sheetData}
              filteredData={filteredData}
              visibleColumns={visibleColumns}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
