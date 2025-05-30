
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Loader2, ArrowUp, ArrowDown, Download } from "lucide-react";
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
import { 
  getDisplayName, 
  getOriginalName, 
  parsePercentage,
  getColumnType,
  downloadAsCSV 
} from "@/utils/columnNameMapping";
import { useColumnVisibility } from "@/hooks/useColumnVisibility";

interface PaginatedDataTableProps {
  isLoading: boolean;
  data: any[];
  filteredData: any[];
  visibleColumns?: string[];
  tab?: string;
}

const PaginatedDataTable: React.FC<PaginatedDataTableProps> = ({ 
  isLoading, 
  data, 
  filteredData,
  visibleColumns,
  tab = "market-lines"
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortedData, setSortedData] = useState<any[]>([]);
  const { isColumnVisible, loading: visibilityLoading } = useColumnVisibility(tab);
  
  const rowsPerPage = 100;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  
  // Apply sorting
  useEffect(() => {
    let result = [...filteredData];
    
    if (sortField) {
      result.sort((a, b) => {
        const aValue = a[sortField] ?? "";
        const bValue = b[sortField] ?? "";
        
        const columnType = getColumnType(sortField);
        
        if (columnType === "percentage") {
          const aNum = parsePercentage(aValue);
          const bNum = parsePercentage(bValue);
          return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
        }
        else if (columnType === "number" || (!isNaN(Number(aValue)) && !isNaN(Number(bValue)))) {
          const aNum = Number(aValue);
          const bNum = Number(bValue);
          return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
        } 
        else {
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
    
    setSortedData(result);
  }, [filteredData, sortField, sortDirection]);
  
  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  };
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      const leftBoundary = Math.max(2, currentPage - 1);
      const rightBoundary = Math.min(totalPages - 1, currentPage + 1);
      
      if (leftBoundary > 2) {
        pages.push(-1);
      }
      
      for (let i = leftBoundary; i <= rightBoundary; i++) {
        pages.push(i);
      }
      
      if (rightBoundary < totalPages - 1) {
        pages.push(-2);
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const handleDownload = () => {
    downloadAsCSV(filteredData, 'table-data.csv', visibleColumns);
  };
  
  if (isLoading || visibilityLoading) {
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
  const allHeaders = Object.keys(data[0] || {});
  
  // Apply column visibility settings
  let headers = allHeaders;
  
  // First apply user's visible columns filter if provided
  if (visibleColumns && visibleColumns.length > 0) {
    headers = headers.filter(header => visibleColumns.includes(header));
  }
  
  // Then apply role-based column visibility settings
  headers = headers.filter(header => {
    const visible = isColumnVisible(header);
    console.log(`Filtering header ${header}: ${visible ? 'keeping' : 'removing'}`);
    return visible;
  });

  console.log("Final headers after filtering:", headers);

  const startRecord = (currentPage - 1) * rowsPerPage + 1;
  const endRecord = Math.min(currentPage * rowsPerPage, sortedData.length);

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <div className="text-sm text-gray-500">
          Showing {startRecord}-{endRecord} of {sortedData.length} records
          {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
        </div>
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
                    {getDisplayName(header)}
                    {sortField === header ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ArrowDown className="ml-1 h-4 w-4" />
                      )
                    ) : (
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
