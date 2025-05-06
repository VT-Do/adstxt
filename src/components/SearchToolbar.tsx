
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, RefreshCw, Loader2, Filter, Columns } from "lucide-react";
import FilterPopover from "@/components/FilterPopover";
import { Checkbox } from "@/components/ui/checkbox";
import { getDisplayName } from "@/utils/columnNameMapping";

interface SearchToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  data: any[];
  columns?: string[];
  visibleColumns?: string[];
  onColumnVisibilityChange?: (columns: string[]) => void;
}

const SearchToolbar: React.FC<SearchToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  isLoading,
  data = [],
  columns = [],
  visibleColumns = [],
  onColumnVisibilityChange = () => {},
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract column names from the first data item if not provided
  const tableColumns = columns.length > 0 
    ? columns 
    : data.length > 0 
      ? Object.keys(data[0]) 
      : [];
      
  // Create a grid of columns for the two-column layout
  const leftColumns = tableColumns.filter((_, index) => index % 2 === 0);
  const rightColumns = tableColumns.filter((_, index) => index % 2 === 1);

  return (
    <div className="p-4 flex flex-wrap justify-between items-center gap-3 border-b">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search data..."
          className="pl-10 border-gray-300"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        {/* Filter Button with Popover */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-4">
            <FilterPopover 
              data={data}
              isOpen={isFilterOpen}
              setIsOpen={setIsFilterOpen} 
            />
          </PopoverContent>
        </Popover>

        {/* Column Visibility Toggle with Popover for better UX */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Columns className="h-4 w-4" />
              <span className="hidden sm:inline">Columns</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-4">
            <div>
              <h3 className="font-medium mb-3 text-base">Toggle Columns</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div className="space-y-3">
                  {leftColumns.map((column) => (
                    <div key={column} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`column-${column}`}
                        checked={visibleColumns.includes(column)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onColumnVisibilityChange([...visibleColumns, column]);
                          } else {
                            onColumnVisibilityChange(
                              visibleColumns.filter((col) => col !== column)
                            );
                          }
                        }}
                      />
                      <label 
                        htmlFor={`column-${column}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {getDisplayName(column)}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {rightColumns.map((column) => (
                    <div key={column} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`column-${column}`}
                        checked={visibleColumns.includes(column)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onColumnVisibilityChange([...visibleColumns, column]);
                          } else {
                            onColumnVisibilityChange(
                              visibleColumns.filter((col) => col !== column)
                            );
                          }
                        }}
                      />
                      <label 
                        htmlFor={`column-${column}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {getDisplayName(column)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Refresh Button */}
        <Button
          onClick={onRefresh}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Refresh Data</span>
        </Button>
      </div>
    </div>
  );
};

export default SearchToolbar;
