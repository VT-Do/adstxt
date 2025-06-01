
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import SearchToolbar from "@/components/SearchToolbar";
import PaginatedDataTable from "@/components/PaginatedDataTable";

interface PlayData {
  [key: string]: any;
}

const Play = () => {
  const [playData, setPlayData] = useState<PlayData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Array<{column: string, operator: string, value: string}>>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const { toast } = useToast();
  
  // URL for the Open button - linking to the Google Cloud Function
  const openUrl = "https://europe-west3-showheroes-bi.cloudfunctions.net/test-2";

  useEffect(() => {
    // Load data when component mounts
    fetchPlayData();
  }, []);

  // Initialize visible columns when data changes
  useEffect(() => {
    if (playData.length > 0 && visibleColumns.length === 0) {
      setVisibleColumns(Object.keys(playData[0]));
    }
  }, [playData]);

  const fetchPlayData = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('https://europe-west3-showheroes-bi.cloudfunctions.net/test-2');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract data from the response
      if (data && data.status === 'success' && data.data && Array.isArray(data.data)) {
        // Flatten the data if it's nested
        const flattenedData = data.data.flat();
        setPlayData(flattenedData);
        console.log(`Loaded ${flattenedData.length} records from Play API`);
      } else {
        setPlayData([]);
        toast({
          title: "Error",
          description: "The data format received was not as expected",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading Play data:", error);
      toast({
        title: "Error",
        description: "Failed to load Play data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters to data
  const applyFilters = (data: any[]) => {
    if (!activeFilters.length) return data;
    
    return data.filter(item => {
      return activeFilters.every(filter => {
        const value = String(item[filter.column] || '').toLowerCase();
        const filterValue = filter.value.toLowerCase();
        
        switch(filter.operator) {
          case 'equals':
            return value === filterValue;
          case 'not-equals':
            return value !== filterValue;
          case 'contains':
            return value.includes(filterValue);
          case 'greater-than':
            return Number(value) > Number(filterValue);
          case 'less-than':
            return Number(value) < Number(filterValue);
          default:
            return true;
        }
      });
    });
  };

  // Filter data based on search term and active filters
  const filteredData = applyFilters(
    searchTerm 
      ? playData.filter(row => 
          Object.values(row).some(
            value => String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      : playData
  );

  const handleRefresh = () => {
    fetchPlayData();
  };

  const handleApplyFilters = (filters: Array<{column: string, operator: string, value: string}>) => {
    setActiveFilters(filters);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f1429]">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Play</h1>
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
              data={playData}
              columns={playData.length > 0 ? Object.keys(playData[0]) : []}
              visibleColumns={visibleColumns}
              onColumnVisibilityChange={setVisibleColumns}
              filteredData={filteredData}
              onApplyFilters={handleApplyFilters}
              sheetUrl={openUrl}
            />

            {/* Data Table with Pagination and Sorting */}
            {playData.length > 0 ? (
              <PaginatedDataTable 
                isLoading={isLoading}
                data={playData}
                filteredData={filteredData}
                visibleColumns={visibleColumns}
                tab="play"
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
        </div>
      </div>
    </div>
  );
};

export default Play;
