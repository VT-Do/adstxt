
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DataTable from "@/components/DataTable";
import FilterControls from "@/components/FilterControls";
import ChartView from "@/components/ChartView";
import { fetchSpreadsheets, fetchSheetData, fetchPublicSheetData, parseSheetId, parseSheetName } from "@/utils/googleApi";
import { FileSpreadsheet, RefreshCw, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { transformSheetData } from "@/utils/sheetTransform";

interface SheetProps {
  activeSheet: any;
  onSheetSelect: (sheet: any) => void;
}

const SheetViewer: React.FC<SheetProps> = ({ activeSheet, onSheetSelect }) => {
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState("table");
  const [publicSheetUrl, setPublicSheetUrl] = useState("https://docs.google.com/spreadsheets/d/18BriA-gtmtxV8aL47vOpAWL-kFp2aQkxv_4-kbRJF-w/edit?gid=0#gid=0");
  const [isPublicSheet, setIsPublicSheet] = useState(true);

  useEffect(() => {
    const loadSpreadsheets = async () => {
      try {
        setLoading(true);
        const data = await fetchSpreadsheets();
        setSpreadsheets(data.files || []);
      } catch (error) {
        console.error("Error loading spreadsheets:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isPublicSheet) {
      loadSpreadsheets();
    }
  }, [isPublicSheet]);

  useEffect(() => {
    if (selectedSpreadsheet) {
      // In a real implementation, fetch the actual sheets
      // For this prototype, we'll simulate some sheets
      setSheets([
        { properties: { sheetId: "1", title: "Sales Data" } },
        { properties: { sheetId: "2", title: "Inventory" } },
        { properties: { sheetId: "3", title: "Customer Information" } }
      ]);
    }
  }, [selectedSpreadsheet]);

  useEffect(() => {
    const loadSheetData = async () => {
      if (activeSheet) {
        try {
          setLoading(true);
          const data = await fetchSheetData(selectedSpreadsheet, activeSheet.properties.sheetId);
          setSheetData(data);
        } catch (error) {
          console.error("Error loading sheet data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (!isPublicSheet && activeSheet) {
      loadSheetData();
    }
  }, [activeSheet, selectedSpreadsheet, isPublicSheet]);

  // Effect to automatically load the public sheet data when the component mounts
  useEffect(() => {
    if (isPublicSheet && publicSheetUrl) {
      loadPublicSheetData();
    }
  }, [publicSheetUrl, isPublicSheet]);

  const loadPublicSheetData = async () => {
    try {
      setLoading(true);
      
      const sheetId = parseSheetId(publicSheetUrl);
      const sheetName = parseSheetName(publicSheetUrl);
      
      if (!sheetId) {
        console.error("Invalid Google Sheet URL");
        return;
      }
      
      const data = await fetchPublicSheetData(sheetId, sheetName);
      
      // Transform the data if needed
      if (data && data.length > 0) {
        // Create a dummy activeSheet object for the public sheet
        const publicSheetInfo = {
          properties: {
            sheetId: sheetId,
            title: sheetName || "Public Sheet"
          }
        };
        onSheetSelect(publicSheetInfo);
        
        setSheetData(data);
      }
    } catch (error) {
      console.error("Error loading public sheet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpreadsheetChange = (value) => {
    const selected = spreadsheets.find(s => s.id === value);
    setSelectedSpreadsheet(selected);
    onSheetSelect(null);
  };

  const handleSheetChange = (value) => {
    const selected = sheets.find(s => s.properties.sheetId === value);
    onSheetSelect(selected);
  };

  if (spreadsheets.length === 0 && !loading && !isPublicSheet) {
    return (
      <div className="text-center p-8">
        <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No spreadsheets found</h3>
        <p className="text-gray-500 mb-4">
          Connect to Google Sheets to view your spreadsheets
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => fetchSpreadsheets()}
          className="mx-auto"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={isPublicSheet ? "default" : "outline"}
          onClick={() => setIsPublicSheet(true)}
          className="flex-1"
        >
          <Link className="h-4 w-4 mr-2" />
          Public Sheet
        </Button>
        <Button
          variant={!isPublicSheet ? "default" : "outline"}
          onClick={() => setIsPublicSheet(false)}
          className="flex-1"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          My Sheets
        </Button>
      </div>

      {isPublicSheet ? (
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
      ) : (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <label className="text-sm font-medium block mb-2">
              Select Spreadsheet
            </label>
            <Select
              value={selectedSpreadsheet?.id}
              onValueChange={handleSpreadsheetChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a spreadsheet" />
              </SelectTrigger>
              <SelectContent>
                {spreadsheets.map((spreadsheet) => (
                  <SelectItem key={spreadsheet.id} value={spreadsheet.id}>
                    {spreadsheet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-1/2">
            <label className="text-sm font-medium block mb-2">
              Select Sheet
            </label>
            <Select
              value={activeSheet?.properties.sheetId}
              onValueChange={handleSheetChange}
              disabled={!selectedSpreadsheet}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a sheet" />
              </SelectTrigger>
              <SelectContent>
                {sheets.map((sheet) => (
                  <SelectItem key={sheet.properties.sheetId} value={sheet.properties.sheetId}>
                    {sheet.properties.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {activeSheet && sheetData.length > 0 && !loading && (
        <>
          <FilterControls sheetData={sheetData} />
          
          <Tabs defaultValue="table" className="w-full" value={activeView} onValueChange={setActiveView}>
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
