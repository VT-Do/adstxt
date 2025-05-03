
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { fetchPublicSheetData, parseSheetId } from "@/utils/googleApi";
import { transformSheetData } from "@/utils/sheetTransform";
import { useToast } from "@/components/ui/use-toast";
import SearchToolbar from "@/components/SearchToolbar";
import DataTableView from "@/components/DataTableView";
import { Loader2 } from "lucide-react";

const Library = () => {
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Google Sheet URL - we'll let users input this when needed
  const [sheetUrl, setSheetUrl] = useState(""); 

  useEffect(() => {
    // Load data when component mounts if we have a URL
    if (sheetUrl) {
      loadSheetData();
    }
  }, [sheetUrl]);

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
        
        toast({
          title: "Library data loaded",
          description: "Sheet data loaded successfully",
        });
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
          <h1 className="text-4xl font-bold text-white mb-2">Library</h1>
          <p className="text-gray-300">Access your library data sheets</p>
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
            />

            {/* Data Table */}
            {sheetData.length > 0 ? (
              <DataTableView 
                isLoading={isLoading}
                data={sheetData}
                filteredData={filteredData}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                  ) : (
                    "Please use the input below to load a sheet"
                  )}
                </p>
                
                {/* Sheet URL input */}
                <div className="max-w-md mx-auto mt-4 p-4">
                  <input
                    type="text"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="Enter Google Sheet URL here..."
                    className="w-full rounded-md border px-4 py-2 mb-2"
                  />
                  <button
                    onClick={loadSheetData}
                    disabled={isLoading || !sheetUrl}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    Load Sheet
                  </button>
                </div>
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
