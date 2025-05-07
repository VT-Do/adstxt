
import React, { useState } from "react";
import { Search, Download, RefreshCcw, X, Filter, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FilterPopover from "@/components/FilterPopover";
import { downloadAsCSV, getDisplayName } from "@/utils/columnNameMapping";

interface SearchToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  data: any[];
  columns: string[];
  visibleColumns: string[];
  onColumnVisibilityChange: (columns: string[]) => void;
  filteredData?: any[];
  onApplyFilters?: (filters: Array<{column: string, operator: string, value: string}>) => void;
}

const SearchToolbar: React.FC<SearchToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  isLoading,
  data,
  columns,
  visibleColumns,
  onColumnVisibilityChange,
  filteredData,
  onApplyFilters
}) => {
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [columnToggleOpen, setColumnToggleOpen] = useState(false);

  const handleClearSearch = () => {
    onSearchChange("");
  };

  const handleDownloadCSV = () => {
    // Use the filtered data if available, otherwise use all data
    const dataToDownload = filteredData || data;
    downloadAsCSV(dataToDownload, "table-data.csv", visibleColumns);
  };

  const handleColumnToggle = (column: string, isChecked: boolean) => {
    if (isChecked) {
      onColumnVisibilityChange([...visibleColumns, column]);
    } else {
      onColumnVisibilityChange(visibleColumns.filter((col) => col !== column));
    }
  };

  const handleFilterApply = (filters: Array<{column: string, operator: string, value: string}>) => {
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
  };

  const toggleAllColumns = (checked: boolean) => {
    if (checked) {
      onColumnVisibilityChange([...columns]);
    } else {
      onColumnVisibilityChange([]);
    }
  };
  
  const openInGoogleSheets = () => {
    // URL for Market Lines tab specifically
    const marketLinesSheetUrl = "https://docs.google.com/spreadsheets/d/1IebVuhDeUO71KruSIzcoRwabpDPGrG83RekXjpFyjUY/edit#gid=0";
    window.open(marketLinesSheetUrl, '_blank');
    
    // Display a toast notification about opening the original sheet
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '15px';
    toast.style.backgroundColor = '#4CAF50';
    toast.style.color = 'white';
    toast.style.borderRadius = '4px';
    toast.style.zIndex = '1000';
    toast.innerHTML = `
      <div>
        <p><strong>Opening Market Lines tab in original Google Sheet</strong></p>
      </div>
    `;
    document.body.appendChild(toast);
    
    // Remove the toast after 5 seconds
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 5000);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b gap-3">
      <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-2 py-0"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {/* Reordered buttons: Filters, Columns, Download, Open Sheet */}
        <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <FilterPopover 
              data={data} 
              isOpen={filterPopoverOpen} 
              setIsOpen={setFilterPopoverOpen}
              onApplyFilters={handleFilterApply}
            />
          </PopoverContent>
        </Popover>

        <DropdownMenu open={columnToggleOpen} onOpenChange={setColumnToggleOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2">
              <div className="mb-2 flex items-center">
                <Checkbox 
                  id="toggle-all-columns" 
                  checked={visibleColumns.length === columns.length} 
                  onCheckedChange={(checked) => toggleAllColumns(!!checked)}
                  className="mr-2"
                />
                <label htmlFor="toggle-all-columns" className="text-sm cursor-pointer">
                  Toggle All
                </label>
              </div>
              <div className="max-h-60 overflow-y-auto grid grid-cols-2 gap-1">
                {columns.map((column) => (
                  <div key={column} className="flex items-center">
                    <Checkbox
                      id={`column-${column}`}
                      checked={visibleColumns.includes(column)}
                      onCheckedChange={(checked) => handleColumnToggle(column, !!checked)}
                      className="mr-2"
                    />
                    <label 
                      htmlFor={`column-${column}`}
                      className="text-sm cursor-pointer truncate"
                      title={getDisplayName(column)}
                    >
                      {getDisplayName(column)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadCSV}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={openInGoogleSheets}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Sheet
        </Button>

        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCcw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchToolbar;
