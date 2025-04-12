
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import DataTable from "@/components/DataTable";
import FilterControls from "@/components/FilterControls";
import ChartView from "@/components/ChartView";
import { fetchPublicSheetData, parseSheetId, parseSheetName } from "@/utils/googleApi";
import { RefreshCw, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const SheetViewer = () => {
  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState("table");
  const [publicSheetUrl, setPublicSheetUrl] = useState("https://docs.google.com/spreadsheets/d/18BriA-gtmtxV8aL47vOpAWL-kFp2aQkxv_4-kbRJF-w/edit?gid=0#gid=0");
  const [activeSheet, setActiveSheet] = useState(null);
  const { toast } = useToast();

  // Load the public sheet data when the component mounts
  useEffect(() => {
    loadPublicSheetData();
  }, []);

  const loadPublicSheetData = async () => {
    try {
      setLoading(true);
      
      const sheetId = parseSheetId(publicSheetUrl);
      const sheetName = parseSheetName(publicSheetUrl);
      
      if (!sheetId) {
        toast({
          title: "Error",
          description: "Invalid Google Sheet URL",
          variant: "destructive",
        });
        return;
      }
      
      const data = await fetchPublicSheetData(sheetId, sheetName);
      
      // Create a dummy activeSheet object for the public sheet
      const publicSheetInfo = {
        properties: {
          sheetId: sheetId,
          title: sheetName || "Public Sheet"
        }
      };
      setActiveSheet(publicSheetInfo);
      
      if (data && data.length > 0) {
        setSheetData(data);
        toast({
          title: "Sheet loaded successfully",
          description: `Now viewing: ${sheetName || "Public Sheet"}`,
          className: "bg-primary/20 border-primary text-foreground",
        });
      }
    } catch (error) {
      console.error("Error loading public sheet data:", error);
      toast({
        title: "Error",
        description: "Failed to load sheet data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50 border border-primary/10">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="publicSheetUrl" className="text-base font-medium">
              Public Google Sheet URL
            </Label>
            <div className="flex gap-3">
              <Input 
                id="publicSheetUrl"
                value={publicSheetUrl} 
                onChange={(e) => setPublicSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="flex-1 border-primary/20 focus-visible:ring-primary"
              />
              <Button 
                onClick={loadPublicSheetData}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Link className="h-4 w-4 mr-2" />
                )}
                {loading ? "Loading..." : "Load Sheet"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {loading && (
        <div className="py-8 space-y-4">
          <Progress value={45} className="h-2 w-full bg-secondary" />
          <p className="text-center text-muted-foreground">Loading sheet data...</p>
        </div>
      )}

      {activeSheet && sheetData.length > 0 && !loading && (
        <div className="space-y-6 fade-in">
          <FilterControls sheetData={sheetData} />
          
          <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
            <TabsContent value="table" className="pt-2">
              <Card className="bg-card/50 border border-primary/10">
                <DataTable data={sheetData} />
              </Card>
            </TabsContent>
            <TabsContent value="chart" className="pt-2">
              <Card className="bg-card/50 border border-primary/10 p-4">
                <ChartView data={sheetData} />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {!loading && (!activeSheet || sheetData.length === 0) && (
        <div className="text-center py-12">
          <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
            <Link className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">No Data Loaded</h3>
          <p className="text-muted-foreground mb-4">
            Enter a public Google Sheet URL and click "Load Sheet" to visualize your data
          </p>
        </div>
      )}
    </div>
  );
};

export default SheetViewer;
