
/**
 * This file contains utilities for mapping column names to more user-friendly display names
 */

// Column name mapping to display friendly names
export const columnDisplayNames: Record<string, string> = {
  // Original column name -> Display name
  "Primary_line": "Primary",
  "Priority_Weight": "Weight",
  "demand_partner": "SSP",
  "demand_market_division": "Division",
  // Add more mappings as needed
};

// Define column types for proper sorting
export const columnTypes: Record<string, 'string' | 'number' | 'percentage'> = {
  "Priority_Weight": "percentage",
  // Add more type definitions as needed
};

/**
 * Gets the display name for a column, or returns the original name if no mapping exists
 */
export const getDisplayName = (columnName: string): string => {
  return columnDisplayNames[columnName] || columnName;
};

/**
 * Gets the original column name from a display name, or returns the display name if no mapping exists
 */
export const getOriginalName = (displayName: string): string => {
  const entry = Object.entries(columnDisplayNames).find(([_, value]) => value === displayName);
  return entry ? entry[0] : displayName;
};

/**
 * Maps an array of column names to their display names
 */
export const mapColumnsToDisplayNames = (columns: string[]): string[] => {
  return columns.map(col => getDisplayName(col));
};

/**
 * Parse percentage strings to numbers for sorting
 * Converts strings like "80%" to 80 as a number
 */
export const parsePercentage = (value: string | number): number => {
  if (typeof value === 'number') return value;
  
  if (typeof value === 'string' && value.endsWith('%')) {
    const numericValue = parseFloat(value.replace('%', ''));
    return isNaN(numericValue) ? 0 : numericValue;
  }
  
  const numericValue = parseFloat(String(value));
  return isNaN(numericValue) ? 0 : numericValue;
};

/**
 * Gets the column type
 */
export const getColumnType = (columnName: string): 'string' | 'number' | 'percentage' => {
  return columnTypes[columnName] || 'string';
};

