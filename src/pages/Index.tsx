
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SheetViewer from "@/components/SheetViewer";
import { FileText, ChartBar, Table2, PieChart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <div className="inline-block mb-4 p-3 bg-primary/10 rounded-full">
            <Table2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight">
            SheetCanvas
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            View, filter, and visualize your Google Sheets data with ease
          </p>
        </header>

        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-xl shadow-xl overflow-hidden">
            <Tabs defaultValue="table" className="w-full">
              <div className="bg-card/50 border-b px-6">
                <TabsList className="h-16">
                  <TabsTrigger value="table" className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4" />
                    Table View
                  </TabsTrigger>
                  <TabsTrigger value="chart" className="flex items-center gap-2 text-base">
                    <PieChart className="h-4 w-4" />
                    Chart View
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <SheetViewer />
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
