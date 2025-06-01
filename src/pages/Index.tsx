
import React, { useState } from "react";
import { Table2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSheetData } from "@/hooks/useSheetData";
import SheetTabsList from "@/components/SheetTabsList";
import SearchToolbar from "@/components/SearchToolbar";
import PaginatedDataTable from "@/components/PaginatedDataTable";

const Index = () => {
  const { profile } = useAuth();
  
  // Google Sheet URL from the user's request - same as in Login page
  const sheetUrl = "https://docs.google.com/spreadsheets/d/1z2NQ13FS_eVrgRd-b49_tsGKtemXpi1v/edit?gid=916740284#gid=916740284";
  // Google Sheet URL for the Open Sheet button
  const openSheetUrl = "https://docs.google.com/spreadsheets/d/1z2NQ13FS_eVrgRd-b49_tsGKtemXpi1v/";
  
  const {
    sheetData,
    sheetTabs,
    selectedSheetTab,
    isLoading,
    searchTerm,
    filteredData,
    activeFilters,
    setSelectedSheetTab,
    setSearchTerm,
    loadSheetData,
    handleApplyFilters
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
    <div className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <div className="inline-block mb-4 p-3 bg-primary/10 rounded-full">
            <Table2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            Ads.txt Management
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            View, filter, and visualize ads.txt lines
            {profile?.role === 'admin' && (
              <span className="ml-2 text-primary font-medium">(Admin Access)</span>
            )}
          </p>
        </header>

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
              filteredData={filteredData}
              onApplyFilters={handleApplyFilters}
              sheetUrl={openSheetUrl}
            />

            {/* Data Table with Pagination and Sorting */}
            <PaginatedDataTable 
              isLoading={isLoading}
              data={sheetData}
              filteredData={filteredData}
              visibleColumns={visibleColumns}
              tab="market-lines"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
