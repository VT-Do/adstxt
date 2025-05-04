
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Plus, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FilterPopoverProps {
  data: any[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({ 
  data, 
  isOpen, 
  setIsOpen 
}) => {
  const [activeFilters, setActiveFilters] = useState<Array<{
    id: number;
    column: string;
    operator: string;
    value: string;
  }>>([]);

  // Get columns from the data
  const columns = data.length > 0 ? Object.keys(data[0] || {}) : [];

  const addFilter = () => {
    setActiveFilters([
      ...activeFilters,
      { id: Date.now(), column: columns[0] || "", operator: "equals", value: "" }
    ]);
  };

  const removeFilter = (id: number) => {
    setActiveFilters(activeFilters.filter(filter => filter.id !== id));
  };

  const updateFilter = (id: number, field: string, value: string) => {
    setActiveFilters(
      activeFilters.map(filter => 
        filter.id === id ? { ...filter, [field]: value } : filter
      )
    );
  };

  const applyFilters = () => {
    // In a real implementation, this would apply the filters to the data
    console.log("Applying filters:", activeFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
            {activeFilters.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filter Data</h4>
              {activeFilters.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="h-8 px-2 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>
            
            {activeFilters.length === 0 ? (
              <div className="text-center py-2 text-sm text-gray-500">
                No filters applied. Click "Add Filter" to create one.
              </div>
            ) : (
              <div className="space-y-3">
                {activeFilters.map(filter => (
                  <div key={filter.id} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Select
                        value={filter.column}
                        onValueChange={(value) => updateFilter(filter.id, "column", value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          {columns.map(column => (
                            <SelectItem key={column} value={column}>
                              {column}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFilter(filter.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Select
                        value={filter.operator}
                        onValueChange={(value) => updateFilter(filter.id, "operator", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">equals</SelectItem>
                          <SelectItem value="contains">contains</SelectItem>
                          <SelectItem value="startsWith">starts with</SelectItem>
                          <SelectItem value="endsWith">ends with</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Input
                        placeholder="Value"
                        className="flex-1"
                        value={filter.value}
                        onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={addFilter}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Filter
              </Button>
              
              <Button
                size="sm"
                onClick={applyFilters}
                disabled={activeFilters.length === 0}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterPopover;
