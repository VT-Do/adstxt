
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw, Loader2, Download } from "lucide-react";
import { fetchPublicSheetData, parseSheetId } from "@/utils/googleApi";
import { transformSheetData } from "@/utils/sheetTransform";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [sheetTabs, setSheetTabs] = useState<string[]>([]);
  const [selectedSheetTab, setSelectedSheetTab] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Google Sheet URL from the user's request
  const sheetUrl = "https://docs.google.com/spreadsheets/d/1z2NQ13FS_eVrgRd-b49_tsGKtemXpi1v/edit?gid=916740284#gid=916740284";
  
  useEffect(() => {
    loadSheetTabs();
  }, []);

  useEffect(() => {
    if (selectedSheetTab) {
      loadSheetData(selectedSheetTab);
    }
  }, [selectedSheetTab]);
  
  const loadSheetTabs = async () => {
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
      
      // In a real implementation, we would fetch all tabs from the Google Sheets API
      // For this prototype, we're expanding the list to include more tabs from the sheet
      const allSheetTabs = [
        "GLOBAL", 
        "DE", 
        "GLOBAL1", 
        "US", 
        "UK", 
        "FR", 
        "ES", 
        "IT", 
        "JP", 
        "CN", 
        "BR", 
        "CA", 
        "AU",
        "NL",
        "PT",
        "SE",
        "AT",
        "IN",
        "KR",
        "MX",
        "TR"
      ];
      setSheetTabs(allSheetTabs);
      
      // Set the first tab as selected by default
      if (allSheetTabs.length > 0 && !selectedSheetTab) {
        setSelectedSheetTab(allSheetTabs[0]);
      }
    } catch (error) {
      console.error("Error loading sheet tabs:", error);
      toast({
        title: "Error",
        description: "Failed to load sheet tabs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadSheetData = async (tabName: string) => {
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
      
      // Load the sheet data for the selected tab
      const data = await fetchPublicSheetData(sheetId, tabName);
      
      if (data && data.length > 0) {
        // Transform raw data to objects with headers as keys
        const transformedData = transformSheetData(data);
        setSheetData(transformedData);
      }
    } catch (error) {
      console.error("Error loading sheet data:", error);
      toast({
        title: "Error",
        description: "Failed to load sheet data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredData = searchTerm 
    ? sheetData.filter(row => 
        Object.values(row).some(
          value => String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : sheetData;

  return (
    <div className="flex flex-col min-h-screen bg-[#0f1429]">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Lines Data</h1>
        </div>

        <div className="space-y-6">
          {/* Tabs Navigation - Horizontal scrollable list */}
          <div className="bg-white rounded-md overflow-auto">
            <div className="flex">
              {sheetTabs.map((tab) => (
                <Button
                  key={tab}
                  variant={selectedSheetTab === tab ? "default" : "ghost"}
                  className={`rounded-none px-6 py-2 h-12 ${
                    selectedSheetTab === tab 
                      ? "bg-primary text-white" 
                      : "text-gray-700 hover:text-primary"
                  }`}
                  onClick={() => setSelectedSheetTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 flex justify-between items-center border-b">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search data..."
                  className="pl-10 border-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button
                onClick={() => loadSheetData(selectedSheetTab)}
                disabled={isLoading}
                className="ml-4"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh Data
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                {sheetData.length > 0 ? (
                  <>
                    <div className="text-sm text-gray-500 p-4">
                      Showing {filteredData.length} of {sheetData.length} records
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(sheetData[0]).map((header) => (
                            <TableHead key={header} className="font-medium">
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((row, index) => (
                          <TableRow key={index}>
                            {Object.values(row).map((cell, cellIndex) => (
                              <TableCell key={`${index}-${cellIndex}`}>
                                {cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No data available for this tab</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
