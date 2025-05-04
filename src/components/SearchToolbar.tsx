
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, RefreshCw, Loader2, Filter, Columns } from "lucide-react";
import FilterPopover from "@/components/FilterPopover";

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
        <FilterPopover 
          data={data} 
          isOpen={isFilterOpen} 
          setIsOpen={setIsFilterOpen} 
        />

        {/* Column Visibility Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Columns className="h-4 w-4" />
              <span className="hidden sm:inline">Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white">
            {tableColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column}
                checked={visibleColumns.includes(column)}
                onCheckedChange={() => {
                  if (visibleColumns.includes(column)) {
                    onColumnVisibilityChange(
                      visibleColumns.filter((col) => col !== column)
                    );
                  } else {
                    onColumnVisibilityChange([...visibleColumns, column]);
                  }
                }}
              >
                {column}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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
