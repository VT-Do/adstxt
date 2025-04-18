
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SheetViewer from "@/components/SheetViewer";
import ChartView from "@/components/ChartView";
import { FileText, ChartBar, Table2, PieChart } from "lucide-react";

const Index = () => {
  const [data, setData] = React.useState([]);

  const handleDataLoaded = (loadedData) => {
    setData(loadedData);
  };

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <div className="inline-block mb-4 p-3 bg-primary/10 rounded-full">
            <Table2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight">
            OMP Test
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            View, filter, and visualize GS files
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
                <TabsContent value="table">
                  <SheetViewer onDataLoaded={handleDataLoaded} />
                </TabsContent>
                <TabsContent value="chart">
                  <ChartView data={data} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
