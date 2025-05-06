
import React, { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getDisplayName } from "@/utils/columnNameMapping";

interface FilterPopoverProps {
  data: any[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({ 
  data, 
  isOpen, 
  setIsOpen 
}) => {
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<{column: string, value: string}[]>([]);

  // Get unique column names from the data
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const handleAddFilter = () => {
    if (selectedColumn && filterValue) {
      setActiveFilters([...activeFilters, { column: selectedColumn, value: filterValue }]);
      setSelectedColumn("");
      setFilterValue("");
    }
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = [...activeFilters];
    newFilters.splice(index, 1);
    setActiveFilters(newFilters);
  };

  const handleApplyFilters = () => {
    // Apply filters to data (this would be implemented in the parent component)
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Filter Data</h3>
      
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="column-select" className="text-sm font-medium">
            Select Column
          </label>
          <Select
            value={selectedColumn}
            onValueChange={setSelectedColumn}
          >
            <SelectTrigger id="column-select" className="w-full">
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              {columns.map((column) => (
                <SelectItem key={column} value={column}>
                  {getDisplayName(column)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="filter-value" className="text-sm font-medium">
            Filter Value
          </label>
          <div className="flex gap-2">
            <Input
              id="filter-value"
              placeholder="Enter value"
              className="w-full"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <Button variant="outline" onClick={handleAddFilter} type="button">
              Add
            </Button>
          </div>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Active Filters</h4>
          <div className="space-y-2">
            {activeFilters.map((filter, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                <span className="text-sm">
                  {getDisplayName(filter.column)}: {filter.value}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleRemoveFilter(index)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
          <Button className="w-full" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterPopover;
