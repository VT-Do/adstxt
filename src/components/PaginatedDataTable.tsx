
import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useColumnVisibility } from "@/hooks/useColumnVisibility";
import { 
  formatEuroValue, 
  formatNumericValue, 
  formatRpmoValue, 
  formatRankValue,
  isRevenueColumn, 
  isRpmoColumn, 
  isRankColumn,
  isNumericColumn 
} from "@/utils/euroFormatter";

interface PaginatedDataTableProps {
  isLoading: boolean;
  data: any[];
  filteredData: any[];
  visibleColumns: string[];
  tab: string;
}

const PaginatedDataTable: React.FC<PaginatedDataTableProps> = ({
  isLoading,
  data,
  filteredData,
  visibleColumns,
  tab
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const { isColumnVisible } = useColumnVisibility(tab);

  // Calculate pagination data
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = filteredData.slice(startIndex, endIndex);

  // Filter visible columns based on role permissions
  const displayColumns = useMemo(() => {
    return visibleColumns.filter(column => isColumnVisible(column));
  }, [visibleColumns, isColumnVisible]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const formatCellValue = (value: any, columnName: string) => {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    if (isRevenueColumn(columnName)) {
      return formatEuroValue(value);
    }
    
    if (isRpmoColumn(columnName)) {
      return formatRpmoValue(value);
    }
    
    if (isRankColumn(columnName)) {
      return formatRankValue(value);
    }
    
    if (isNumericColumn(columnName, value)) {
      return formatNumericValue(value);
    }
    
    return String(value);
  };

  const PaginationControls = () => (
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground">
        Showing {startIndex + 1}-{endIndex} of {totalItems} records • Page {currentPage} of {totalPages}
      </div>
      
      <div className="flex items-center justify-center gap-1 flex-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        {getPageNumbers().map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(pageNum)}
            className="min-w-8"
          >
            {pageNum}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows per page:</span>
        <Select value={pageSize.toString()} onValueChange={(value) => {
          setPageSize(Number(value));
          setCurrentPage(1);
        }}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="200">200</SelectItem>
            <SelectItem value="500">500</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data matches your current filters.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        {/* Top Pagination */}
        <div className="p-4 border-b">
          <PaginationControls />
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {displayColumns.map((column) => (
                  <TableHead key={column} className="whitespace-nowrap">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row, index) => (
                <TableRow key={`${startIndex + index}`}>
                  {displayColumns.map((column) => (
                    <TableCell key={column} className="whitespace-nowrap">
                      {formatCellValue(row[column], column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Bottom Pagination */}
        <div className="p-4 border-t">
          <PaginationControls />
        </div>
      </CardContent>
    </Card>
  );
};

export default PaginatedDataTable;
