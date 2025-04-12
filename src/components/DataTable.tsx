
import React, { useState, useMemo } from "react";
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
import { ArrowUpDown, Search, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataTableProps {
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  // For the prototype, if no data is provided, use sample data
  const sampleData = useMemo(() => {
    if (data && data.length > 0) return data;
    
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
  }, [data]);

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
        if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
        return 0;
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Sheet Data</CardTitle>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleExport}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
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
        <div className="border rounded-md">
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
                      {column}
                      {sortField === column ? (
                        <ArrowUpDown 
                          className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`}
                        />
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-30" />
                      )}
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={column}>{row[column]}</TableCell>
                  ))}
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
