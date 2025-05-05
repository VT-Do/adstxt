
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginatedDataTableProps {
  isLoading: boolean;
  data: any[];
  filteredData: any[];
  visibleColumns?: string[];
}

const PaginatedDataTable: React.FC<PaginatedDataTableProps> = ({ 
  isLoading, 
  data, 
  filteredData,
  visibleColumns 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortedData, setSortedData] = useState<any[]>([]);
  
  const rowsPerPage = 100;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  
  // Apply sorting
  useEffect(() => {
    let result = [...filteredData];
    
    if (sortField) {
      result.sort((a, b) => {
        const aValue = a[sortField] ?? "";
        const bValue = b[sortField] ?? "";
        
        // Handle numeric values
        if (!isNaN(aValue) && !isNaN(bValue)) {
          return sortDirection === "asc" 
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue);
        }
        
        // Handle string values
        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        
        if (sortDirection === "asc") {
          return aString.localeCompare(bString);
        } else {
          return bString.localeCompare(aString);
        }
      });
    }
    
    setSortedData(result);
  }, [filteredData, sortField, sortDirection]);
  
  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);
  
  // Handle column header click for sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and reset to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  };
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Display all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Show pages around current page
      const leftBoundary = Math.max(2, currentPage - 1);
      const rightBoundary = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis if needed
      if (leftBoundary > 2) {
        pages.push(-1); // -1 indicates ellipsis
      }
      
      // Add pages around current page
      for (let i = leftBoundary; i <= rightBoundary; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (rightBoundary < totalPages - 1) {
        pages.push(-2); // -2 indicates ellipsis
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available for this tab</p>
      </div>
    );
  }

  const currentPageData = getCurrentPageData();
  // Get all available headers
  const allHeaders = Object.keys(data[0] || {});
  // If visibleColumns is provided and has values, use it, otherwise show all columns
  const headers = visibleColumns && visibleColumns.length > 0
    ? allHeaders.filter(header => visibleColumns.includes(header))
    : allHeaders;

  // Calculate the range of records being shown
  const startRecord = Math.min((currentPage - 1) * rowsPerPage + 1, sortedData.length);
  const endRecord = Math.min(currentPage * rowsPerPage, sortedData.length);

  return (
    <>
      <div className="text-sm text-gray-500 p-4">
        Showing {startRecord}-{endRecord} of {sortedData.length} records
        {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header} className="font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(header)}
                    className="flex items-center gap-1 h-auto p-0 hover:bg-transparent"
                  >
                    {header}
                    {sortField === header && (
                      sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ArrowDown className="ml-1 h-4 w-4" />
                      )
                    )}
                    {sortField !== header && (
                      <span className="ml-1 h-4 w-4 opacity-0"></span>
                    )}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageData.map((row, index) => (
              <TableRow key={index}>
                {headers.map((header, cellIndex) => (
                  <TableCell key={`${index}-${cellIndex}`}>
                    {row[header] !== null && row[header] !== undefined ? String(row[header]) : ""}
                  </TableCell>
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
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {getPageNumbers().map((pageNum, index) => (
              pageNum < 0 ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    isActive={currentPage === pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default PaginatedDataTable;
