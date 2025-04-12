import axios from 'axios';

// Mock data for spreadsheets
const mockSpreadsheets = [
  { id: 'sheet1', name: 'Sales Report 2023' },
  { id: 'sheet2', name: 'Inventory Tracking' },
  { id: 'sheet3', name: 'Customer Database' },
  { id: 'sheet4', name: 'Q1 Financial Report' },
];

// Mock data for sheets within a spreadsheet
const mockSheets = {
  'sheet1': [
    { properties: { sheetId: '1a', title: 'Monthly Sales' } },
    { properties: { sheetId: '1b', title: 'Quarterly Summary' } },
  ],
  'sheet2': [
    { properties: { sheetId: '2a', title: 'Current Inventory' } },
    { properties: { sheetId: '2b', title: 'Order History' } },
  ],
  'sheet3': [
    { properties: { sheetId: '3a', title: 'Customer Info' } },
    { properties: { sheetId: '3b', title: 'Support Tickets' } },
  ],
};

// Mock sheet data
const mockSheetData = {
  '1a': [
    { id: 1, product: "Laptop", category: "Electronics", price: 1299, stock: 45, sales: 12 },
    { id: 2, product: "Smartphone", category: "Electronics", price: 899, stock: 120, sales: 28 },
    { id: 3, product: "Desk Chair", category: "Furniture", price: 249, stock: 28, sales: 5 },
    { id: 4, product: "Coffee Maker", category: "Appliances", price: 89, stock: 52, sales: 10 },
    { id: 5, product: "Headphones", category: "Electronics", price: 199, stock: 78, sales: 15 },
  ],
  '2a': [
    { id: 1, item: "Laptop", location: "Warehouse A", quantity: 45, reorderLevel: 10 },
    { id: 2, item: "Smartphone", location: "Warehouse B", quantity: 120, reorderLevel: 20 },
    { id: 3, item: "Desk Chair", location: "Warehouse A", quantity: 28, reorderLevel: 5 },
    { id: 4, item: "Coffee Maker", location: "Warehouse C", quantity: 52, reorderLevel: 8 },
    { id: 5, item: "Headphones", location: "Warehouse B", quantity: 78, reorderLevel: 15 },
  ],
  '3a': [
    { id: 1, name: "John Smith", email: "john@example.com", status: "Active", purchases: 5 },
    { id: 2, name: "Jane Doe", email: "jane@example.com", status: "Active", purchases: 3 },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Inactive", purchases: 1 },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", status: "Active", purchases: 8 },
    { id: 5, name: "Mike Brown", email: "mike@example.com", status: "Active", purchases: 4 },
  ],
};

/**
 * Mock function for authenticating with Google
 */
export const authenticateWithGoogle = async (apiKey: string): Promise<boolean> => {
  // Simulate API authentication
  return new Promise((resolve) => {
    setTimeout(() => {
      // For prototype, any non-empty API key will succeed
      resolve(!!apiKey);
    }, 1000);
  });
};

/**
 * Mock function for fetching user's spreadsheets
 */
export const fetchSpreadsheets = async (): Promise<{ files: any[] }> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ files: mockSpreadsheets });
    }, 800);
  });
};

/**
 * Mock function for fetching sheets in a spreadsheet
 */
export const fetchSheets = async (spreadsheetId: string): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSheets[spreadsheetId] || []);
    }, 600);
  });
};

// Add this function to fetch data from a public sheet
export const fetchPublicSheetData = async (sheetId: string, range?: string) => {
  try {
    // Construct the URL for the public sheet
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range || 'Sheet1'}`;
    
    const response = await axios.get(apiUrl, {
      params: {
        key: 'YOUR_PUBLIC_API_KEY' // Replace with your actual public API key
      }
    });
    
    return response.data.values;
  } catch (error) {
    console.error('Error fetching public sheet:', error);
    throw error;
  }
};

/**
 * Mock function for fetching data from a specific sheet
 */
export const fetchSheetData = async (spreadsheetId: string, sheetId: string): Promise<any[]> => {
  // For mock implementation, keep existing logic
  // In a real app, you'd add logic to handle public sheets
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSheetData[sheetId] || []);
    }, 700);
  });
};
