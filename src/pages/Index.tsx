
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SheetViewer from "@/components/SheetViewer";
import { FileText, ChartBar } from "lucide-react";

const Index = () => {
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
            <SheetViewer />
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
