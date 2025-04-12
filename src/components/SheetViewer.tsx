
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
          title: "Sheet loaded",
          description: `Now viewing: ${sheetName || "Public Sheet"}`,
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
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="publicSheetUrl">Public Google Sheet URL</Label>
          <div className="flex gap-2">
            <Input 
              id="publicSheetUrl"
              value={publicSheetUrl} 
              onChange={(e) => setPublicSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="flex-1"
            />
            <Button 
              onClick={loadPublicSheetData}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                "Load"
              )}
            </Button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {activeSheet && sheetData.length > 0 && !loading && (
        <>
          <FilterControls sheetData={sheetData} />
          
          <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
            <TabsContent value="table" className="pt-2">
              <DataTable data={sheetData} />
            </TabsContent>
            <TabsContent value="chart" className="pt-2">
              <ChartView data={sheetData} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default SheetViewer;
