
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DataTable from "@/components/DataTable";
import FilterControls from "@/components/FilterControls";
import ChartView from "@/components/ChartView";
import { fetchSpreadsheets, fetchSheetData } from "@/utils/googleApi";
import { FileSpreadsheet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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

    loadSpreadsheets();
  }, []);

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

    loadSheetData();
  }, [activeSheet, selectedSpreadsheet]);

  const handleSpreadsheetChange = (value) => {
    const selected = spreadsheets.find(s => s.id === value);
    setSelectedSpreadsheet(selected);
    setActiveSheet(null);
  };

  const handleSheetChange = (value) => {
    const selected = sheets.find(s => s.properties.sheetId === value);
    onSheetSelect(selected);
  };

  if (spreadsheets.length === 0 && !loading) {
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

      {activeSheet && (
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
