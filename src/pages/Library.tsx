import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPublicSheetData, parseSheetId } from "@/utils/googleApi";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Library = () => {
  const { isAdmin } = useAuth();
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // New Google Sheet URL
  const sheetUrl = "https://docs.google.com/spreadsheets/d/1o14-srgPH-3-_kFfQSXUvse9Yz-PQaHxKTbVdkroxHc/edit?gid=0#gid=0";
  
  useEffect(() => {
    loadSheetData();
  }, []);
  
  const loadSheetData = async () => {
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
      
      // Load the main sheet data without handling multiple tabs
      const data = await fetchPublicSheetData(sheetId);
      
      if (data && data.length > 0) {
        // Transform the data to objects
        const headers = data[0];
        const rows = data.slice(1);
        
        const transformedData = rows.map(row => {
          const obj: Record<string, any> = {};
          headers.forEach((header: string, index: number) => {
            obj[header] = row[index];
          });
          return obj;
        });
        
        setSheetData(transformedData);
      }
    } catch (error) {
      console.error("Error loading sheet data:", error);
      toast({
        title: "Error",
        description: "Failed to load library data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Library</h1>
      
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Sheet Library Data</h2>
          <p className="text-sm text-gray-500 mt-1">
            Data from: {sheetUrl}
          </p>
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
                  Showing {sheetData.length} records
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
                    {sheetData.map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((cell, cellIndex) => (
                          <TableCell key={`${index}-${cellIndex}`}>
                            {cell !== null && cell !== undefined ? String(cell) : ""}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Keep the existing cards for additional library resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sheet Library</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Access your saved sheets and templates.
            </p>
            {isAdmin && (
              <p className="text-sm mt-4 p-2 bg-primary/10 rounded-md">
                As an admin, you have full access to manage the sheet library.
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Sheets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Quick access to recently viewed sheets.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Pre-defined sheet templates to get started quickly.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Library;
