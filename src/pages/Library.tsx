
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { fetchPublicSheetData, parseSheetId } from "@/utils/googleApi";
import { transformSheetData } from "@/utils/sheetTransform";
import { useToast } from "@/components/ui/use-toast";
import SearchToolbar from "@/components/SearchToolbar";
import PaginatedDataTable from "@/components/PaginatedDataTable";
import { Loader2 } from "lucide-react";

const Library = () => {
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // State for column visibility
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  
  // Predefined Google Sheet URL - hardcoded but not shown to user
  const sheetUrl = "https://docs.google.com/spreadsheets/d/1o14-srgPH-3-_kFfQSXUvse9Yz-PQaHxKTbVdkroxHc/edit";

  useEffect(() => {
    // Load data when component mounts
    loadSheetData();
  }, []);

  // Initialize visible columns when data changes
  useEffect(() => {
    if (sheetData.length > 0 && visibleColumns.length === 0) {
      setVisibleColumns(Object.keys(sheetData[0]));
    }
  }, [sheetData]);

  const loadSheetData = async () => {
    try {
      setIsLoading(true);
      
      // Extract sheet ID from URL
      const sheetId = parseSheetId(sheetUrl);
      
      if (!sheetId) {
        toast({
          title: "Error",
          description: "Invalid Google Sheet URL",
          variant: "destructive",
        });
        return;
      }
      
      // Load the main sheet data
      const data = await fetchPublicSheetData(sheetId);
      
      if (data && data.length > 0) {
        // Transform raw data to objects with headers as keys
        const transformedData = transformSheetData(data);
        setSheetData(transformedData);
      }
    } catch (error) {
      console.error("Error loading sheet data:", error);
      toast({
        title: "Error",
        description: "Failed to load library data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter data based on search term
  const filteredData = searchTerm 
    ? sheetData.filter(row => 
        Object.values(row).some(
          value => String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : sheetData;

  const handleRefresh = () => {
    loadSheetData();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f1429]">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Ads.txt Library</h1>
        </div>

        <div className="space-y-6">
          {/* Card for displaying data */}
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
            {sheetData.length > 0 ? (
              <PaginatedDataTable 
                isLoading={isLoading}
                data={sheetData}
                filteredData={filteredData}
                visibleColumns={visibleColumns}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                  ) : (
                    "No data available. Click refresh to try loading data again."
                  )}
                </p>
              </div>
            )}
          </div>
          
          {/* Additional library resources */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border border-white/10">
              <div className="p-6">
                <h3 className="text-xl font-medium text-white mb-2">Sheet Library</h3>
                <p className="text-gray-300">
                  Access your saved sheets and templates.
                </p>
              </div>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border border-white/10">
              <div className="p-6">
                <h3 className="text-xl font-medium text-white mb-2">Recent Sheets</h3>
                <p className="text-gray-300">
                  Quick access to recently viewed sheets.
                </p>
              </div>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border border-white/10">
              <div className="p-6">
                <h3 className="text-xl font-medium text-white mb-2">Templates</h3>
                <p className="text-gray-300">
                  Pre-defined sheet templates to get started quickly.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
