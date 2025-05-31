
/**
 * Formats a number as Euro currency with European formatting
 */
export const formatEuroValue = (value: any): string => {
  // Convert to number, handle null/undefined/empty values
  const numValue = Number(value);
  
  if (isNaN(numValue) || value === null || value === undefined || value === '') {
    return String(value || '');
  }
  
  // For values less than 10, use comma with 1 decimal place
  if (numValue < 10) {
    return numValue.toLocaleString('de-DE', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }) + ' €';
  }
  
  // For values 10 and above, round to whole number
  const roundedValue = Math.round(numValue);
  
  // Use European formatting with dots for thousands separator
  return roundedValue.toLocaleString('de-DE') + ' €';
};

/**
 * Checks if a column name contains 'rev' (case insensitive) indicating it's a revenue column
 */
export const isRevenueColumn = (columnName: string): boolean => {
  return columnName.toLowerCase().includes('rev');
};
