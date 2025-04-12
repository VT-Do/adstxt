
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Filter, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FilterControlsProps {
  sheetData: any[];
}

const FilterControls: React.FC<FilterControlsProps> = ({ sheetData = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  // Get columns from the sheet data
  const columns = sheetData.length > 0 
    ? Object.keys(sheetData[0] || {}) 
    : ['product', 'category', 'price', 'stock']; // Sample columns for prototype

  const addFilter = () => {
    setActiveFilters([
      ...activeFilters,
      { id: Date.now(), column: columns[0], operator: "equals", value: "" }
    ]);
  };

  const removeFilter = (id) => {
    setActiveFilters(activeFilters.filter(filter => filter.id !== id));
  };

  const updateFilter = (id, field, value) => {
    setActiveFilters(
      activeFilters.map(filter => 
        filter.id === id ? { ...filter, [field]: value } : filter
      )
    );
  };

  const applyFilters = () => {
    // In a real implementation, this would apply the filters to the data
    console.log("Applying filters:", activeFilters);
    // Close the filter panel after applying
    setIsOpen(false);
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {activeFilters.length > 0 && !isOpen && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(filter => (
                <Badge 
                  key={filter.id} 
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {filter.column} {filter.operator} {filter.value}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => removeFilter(filter.id)}
                  />
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-6 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1"
        >
          <Filter className="h-4 w-4" />
          {isOpen ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {isOpen && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filter Data</CardTitle>
            <CardDescription>
              Add conditions to filter the sheet data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeFilters.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No filters applied. Click "Add Filter" to create one.
              </div>
            ) : (
              <div className="space-y-4">
                {activeFilters.map(filter => (
                  <div key={filter.id} className="flex items-center gap-2">
                    <Select
                      value={filter.column}
                      onValueChange={(value) => updateFilter(filter.id, "column", value)}
                    >
                      <SelectTrigger className="w-[180px]">
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

                    <Select
                      value={filter.operator}
                      onValueChange={(value) => updateFilter(filter.id, "operator", value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">equals</SelectItem>
                        <SelectItem value="contains">contains</SelectItem>
                        <SelectItem value="greater">greater than</SelectItem>
                        <SelectItem value="less">less than</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="Value"
                      className="flex-1"
                      value={filter.value}
                      onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFilter(filter.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button
              variant="outline"
              onClick={addFilter}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Filter
            </Button>
            <Button
              onClick={applyFilters}
              disabled={activeFilters.length === 0}
            >
              Apply Filters
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default FilterControls;
