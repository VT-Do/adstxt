
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
