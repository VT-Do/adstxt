
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SheetAuth from "@/components/SheetAuth";
import SheetViewer from "@/components/SheetViewer";
import { useToast } from "@/components/ui/use-toast";
import { FileSpreadsheet, FileText, ChartBar } from "lucide-react";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSheet, setActiveSheet] = useState(null);
  const { toast } = useToast();

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    toast({
      title: "Successfully connected to Google Sheets",
      description: "You can now view and manage your sheets",
      duration: 3000,
    });
  };

  const handleSheetSelect = (sheet) => {
    setActiveSheet(sheet);
    toast({
      title: "Sheet loaded",
      description: `Now viewing: ${sheet.properties.title}`,
      duration: 2000,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          SheetCanvas
        </h1>
        <p className="text-gray-600">
          View, filter, and visualize your Google Sheets data
        </p>
      </header>

      {!isAuthenticated ? (
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <FileSpreadsheet className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Connect to Google Sheets</h2>
            <p className="text-gray-600">
              Authorize access to view and manage your spreadsheets
            </p>
          </div>
          <SheetAuth onAuthSuccess={handleAuthSuccess} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <Tabs defaultValue="table" className="w-full">
            <div className="border-b px-4">
              <TabsList className="h-16">
                <TabsTrigger value="table" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Table View
                </TabsTrigger>
                <TabsTrigger value="chart" className="flex items-center gap-2">
                  <ChartBar className="h-4 w-4" />
                  Chart View
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4">
              <SheetViewer 
                activeSheet={activeSheet} 
                onSheetSelect={handleSheetSelect} 
              />
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Index;
