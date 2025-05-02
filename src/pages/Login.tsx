
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Download, Loader2, Table, Book, TestTube } from "lucide-react";
import { fetchPublicSheetData, parseSheetId } from "@/utils/googleApi";
import { transformSheetData } from "@/utils/sheetTransform";
import { Table as UITable, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const Login = () => {
  const [activeTab, setActiveTab] = useState("line");
  const [isTabsCollapsed, setIsTabsCollapsed] = useState(false);
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [sheetTabs, setSheetTabs] = useState<string[]>([]);
  const [selectedSheetTab, setSelectedSheetTab] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Google Sheet URL from the user's request
  const sheetUrl = "https://docs.google.com/spreadsheets/d/1z2NQ13FS_eVrgRd-b49_tsGKtemXpi1v/edit?gid=916740284#gid=916740284";
  
  useEffect(() => {
    if (activeTab === "line") {
      loadSheetTabs();
    }
  }, [activeTab]);

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
      
      // For fetching sheet tabs, we need to use Google Sheets API
      // Since we can't directly call the API in this prototype, we'll simulate
      // fetching the tabs by looking at the sheet URL and docs
      const actualSheetTabs = ["GLOBAL", "DE", "GLOBAL1"];
      setSheetTabs(actualSheetTabs);
      
      // Set the first tab as selected by default
      if (actualSheetTabs.length > 0 && !selectedSheetTab) {
        setSelectedSheetTab(actualSheetTabs[0]);
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
  
  const toggleTabs = () => {
    setIsTabsCollapsed(!isTabsCollapsed);
  };

  // Helper function to render table based on sheet data
  const renderTableData = () => {
    if (!sheetData || sheetData.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No data available</p>
        </div>
      );
    }
    
    const headers = Object.keys(sheetData[0]);
    
    return (
      <div className="overflow-auto max-h-[500px]">
        <UITable>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sheetData.map((row, index) => (
              <TableRow key={index}>
                {headers.map((header) => (
                  <TableCell key={`${index}-${header}`}>{row[header]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </UITable>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Freezable Tabs Section */}
      <Collapsible
        open={!isTabsCollapsed}
        className="w-full border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            <h1 className="text-xl font-bold">Data Explorer</h1>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" onClick={toggleTabs}>
                {isTabsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                {isTabsCollapsed ? "Show Tabs" : "Hide Tabs"}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full py-2">
              <TabsList className="w-full justify-start border-b">
                <TabsTrigger value="line" className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  Line
                </TabsTrigger>
                <TabsTrigger value="library" className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  Library
                </TabsTrigger>
                <TabsTrigger value="test" className="flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  Test
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === "line" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Line Data</h2>
                <div className="flex items-center gap-2">
                  {isLoading ? (
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </Button>
                  ) : (
                    <Button onClick={() => loadSheetData(selectedSheetTab)}>
                      <Loader2 className="mr-2 h-4 w-4" />
                      Refresh Data
                    </Button>
                  )}
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
              
              {sheetTabs.length > 0 && (
                <div className="border-b">
                  <div className="flex overflow-x-auto">
                    {sheetTabs.map((tab) => (
                      <Button
                        key={tab}
                        variant={selectedSheetTab === tab ? "default" : "ghost"}
                        className="rounded-none"
                        onClick={() => setSelectedSheetTab(tab)}
                      >
                        {tab}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                renderTableData()
              )}
            </div>
          )}
          
          {activeTab === "library" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Library</h2>
              <p className="text-muted-foreground">
                Access your saved sheets and templates in the library tab.
              </p>
            </div>
          )}
          
          {activeTab === "test" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Test</h2>
              <p className="text-muted-foreground">
                Run tests and view test results in the test tab.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
