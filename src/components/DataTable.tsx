
import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Search, Download, Plus, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transformSheetData } from "@/utils/sheetTransform";
import { getDisplayName, getColumnType, parsePercentage } from "@/utils/columnNameMapping";

interface DataTableProps {
  data: any[];
  isAdmin?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ data, isAdmin = false }) => {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [localData, setLocalData] = useState<any[]>([]);
  const pageSize = 10;

  // Initialize local data from props
  useEffect(() => {
    if (data && data.length > 0) {
      setLocalData(data);
    }
  }, [data]);

  // Transform raw data to use headers properly
  const processedData = useMemo(() => {
    if (!localData || localData.length === 0) return [];
    
    // If data comes from a CSV, the first row should be headers
    if (Array.isArray(localData[0])) {
      return transformSheetData(localData);
    }
    
    // If data is already in object format, return as is
    return localData;
  }, [localData]);

  // For the prototype, if no data is provided, use sample data
  const sampleData = useMemo(() => {
    if (processedData && processedData.length > 0) return processedData;
    
    return [
      { id: 1, product: "Laptop", category: "Electronics", price: 1299, stock: 45 },
      { id: 2, product: "Smartphone", category: "Electronics", price: 899, stock: 120 },
      { id: 3, product: "Desk Chair", category: "Furniture", price: 249, stock: 28 },
      { id: 4, product: "Coffee Maker", category: "Appliances", price: 89, stock: 52 },
      { id: 5, product: "Headphones", category: "Electronics", price: 199, stock: 78 },
      { id: 6, product: "Monitor", category: "Electronics", price: 349, stock: 32 },
      { id: 7, product: "Desk", category: "Furniture", price: 199, stock: 15 },
      { id: 8, product: "Keyboard", category: "Electronics", price: 79, stock: 65 },
      { id: 9, product: "Mouse", category: "Electronics", price: 49, stock: 82 },
      { id: 10, product: "Tablet", category: "Electronics", price: 499, stock: 28 },
      { id: 11, product: "Bookshelf", category: "Furniture", price: 129, stock: 13 },
      { id: 12, product: "Toaster", category: "Appliances", price: 59, stock: 41 },
    ];
  }, [processedData]);

  const columns = useMemo(() => {
    if (sampleData.length === 0) return [];
    return Object.keys(sampleData[0]);
  }, [sampleData]);

  // Apply sorting and filtering
  const sortedAndFilteredData = useMemo(() => {
    let processed = [...sampleData];

    // Apply search filter if there's a search term
    if (searchTerm) {
      processed = processed.filter((row) => {
        return columns.some((column) => {
          const value = row[column]?.toString().toLowerCase();
          return value && value.includes(searchTerm.toLowerCase());
        });
      });
    }

    // Apply sorting if there's a sort field
    if (sortField) {
      processed.sort((a, b) => {
        const aValue = a[sortField] ?? "";
        const bValue = b[sortField] ?? "";
        
        // Get column type for proper sorting
        const columnType = getColumnType(sortField);
        
        // Handle different column types
        if (columnType === "percentage") {
          const aNum = parsePercentage(aValue);
          const bNum = parsePercentage(bValue);
          return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
        }
        else if (columnType === "number" || (!isNaN(Number(aValue)) && !isNaN(Number(bValue)))) {
          // Regular numeric sorting
          const aNum = Number(aValue);
          const bNum = Number(bValue);
          return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
        } 
        else {
          // String sorting
          const aString = String(aValue).toLowerCase();
          const bString = String(bValue).toLowerCase();
          
          if (sortDirection === "asc") {
            return aString.localeCompare(bString);
          } else {
            return bString.localeCompare(aString);
          }
        }
      });
    }

    return processed;
  }, [sampleData, searchTerm, sortField, sortDirection, columns]);

  // Get current page data
  const currentPageData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return sortedAndFilteredData.slice(startIndex, startIndex + pageSize);
  }, [sortedAndFilteredData, page, pageSize]);

  const totalPages = Math.ceil(sortedAndFilteredData.length / pageSize);

  const handleSort = (column) => {
    if (sortField === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(column);
      setSortDirection("asc");
    }
  };

  const handleExport = () => {
    // In a real app, we'd implement CSV export functionality
    console.log("Exporting data...");
    alert("This would export the current view as a CSV file");
  };

  const addRow = () => {
    if (!isAdmin) return;
    
    const newRow = {};
    columns.forEach(column => {
      newRow[column] = "";
    });
    
    const newData = [...localData, newRow];
    setLocalData(newData);
  };

  const deleteRow = (index) => {
    if (!isAdmin) return;
    
    const newData = [...localData];
    newData.splice((page - 1) * pageSize + index, 1);
    setLocalData(newData);
  };

  const handleCellChange = (rowIndex, columnName, value) => {
    if (!isAdmin) return;
    
    const newData = [...localData];
    const dataIndex = (page - 1) * pageSize + rowIndex;
    newData[dataIndex] = {
      ...newData[dataIndex],
      [columnName]: value
    };
    setLocalData(newData);
  };

  if (columns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No data available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 my-8">
            Select a spreadsheet and sheet to view data
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate the range of records being shown
  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, sortedAndFilteredData.length);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Sheet Data</CardTitle>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleExport}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            {isAdmin && (
              <Button 
                size="sm" 
                onClick={addRow}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Row
              </Button>
            )}
          </div>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border rounded-md overflow-auto">
          <div className="text-sm text-gray-500 p-4">
            Showing {startRecord}-{endRecord} of {sortedAndFilteredData.length} records
            {totalPages > 1 && ` • Page ${page} of ${totalPages}`}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column)}
                      className="flex items-center gap-1 hover:bg-transparent px-2 py-1 h-auto"
                    >
                      {getDisplayName(column)}
                      {sortField === column ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <span className="h-4 w-4 opacity-0"></span>
                      )}
                    </Button>
                  </TableHead>
                ))}
                {isAdmin && <TableHead className="w-[70px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      {isAdmin ? (
                        <Input
                          value={row[column] || ''}
                          onChange={(e) => handleCellChange(i, column, e.target.value)}
                          className="h-8 px-2 py-1"
                        />
                      ) : (
                        row[column]
                      )}
                    </TableCell>
                  ))}
                  {isAdmin && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteRow(i)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination className="my-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                let pageNumber;
                
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (page <= 3) {
                  pageNumber = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = page - 2 + i;
                }
                
                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setPage(pageNumber)}
                      isActive={page === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              {totalPages > 5 && page < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTable;
