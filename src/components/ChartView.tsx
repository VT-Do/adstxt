
import React, { useState, useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, PieChart as PieChartIcon } from "lucide-react";

interface ChartViewProps {
  data: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed'];

const ChartView: React.FC<ChartViewProps> = ({ data }) => {
  // Using sample data for prototype
  const sampleData = useMemo(() => {
    if (data && data.length > 0) return data;
    
    return [
      { id: 1, product: "Laptop", category: "Electronics", price: 1299, stock: 45 },
      { id: 2, product: "Smartphone", category: "Electronics", price: 899, stock: 120 },
      { id: 3, product: "Desk Chair", category: "Furniture", price: 249, stock: 28 },
      { id: 4, product: "Coffee Maker", category: "Appliances", price: 89, stock: 52 },
      { id: 5, product: "Headphones", category: "Electronics", price: 199, stock: 78 },
      { id: 6, product: "Monitor", category: "Electronics", price: 349, stock: 32 },
      { id: 7, product: "Desk", category: "Furniture", price: 199, stock: 15 },
      { id: 8, product: "Keyboard", category: "Electronics", price: 79, stock: 65 },
    ];
  }, [data]);

  const columns = useMemo(() => {
    if (sampleData.length === 0) return [];
    return Object.keys(sampleData[0]).filter(key => 
      typeof sampleData[0][key] === 'number' || 
      typeof sampleData[0][key] === 'string'
    );
  }, [sampleData]);

  const categoryColumns = useMemo(() => 
    columns.filter(col => typeof sampleData[0][col] === 'string'),
    [columns, sampleData]
  );

  const numericColumns = useMemo(() => 
    columns.filter(col => typeof sampleData[0][col] === 'number'),
    [columns, sampleData]
  );

  const [chartType, setChartType] = useState("bar");
  const [xAxisField, setXAxisField] = useState(categoryColumns[0] || '');
  const [yAxisField, setYAxisField] = useState(numericColumns[0] || '');

  // For pie chart data, group by the selected category
  const pieData = useMemo(() => {
    if (!xAxisField || !yAxisField || sampleData.length === 0) return [];

    const groupedData = sampleData.reduce((acc, item) => {
      const key = item[xAxisField];
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += Number(item[yAxisField]) || 0;
      return acc;
    }, {});

    return Object.entries(groupedData).map(([name, value]) => ({
      name,
      value
    }));
  }, [sampleData, xAxisField, yAxisField]);

  if (columns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chart View</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 my-12">
            No data available for visualization
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium block mb-2">
              Chart Type
            </label>
            <Tabs defaultValue="bar" value={chartType} onValueChange={setChartType} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bar" className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  Bar Chart
                </TabsTrigger>
                <TabsTrigger value="pie" className="flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Pie Chart
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              Category (X-Axis)
            </label>
            <Select
              value={xAxisField}
              onValueChange={setXAxisField}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select X-Axis field" />
              </SelectTrigger>
              <SelectContent>
                {categoryColumns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              Value (Y-Axis)
            </label>
            <Select
              value={yAxisField}
              onValueChange={setYAxisField}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Y-Axis field" />
              </SelectTrigger>
              <SelectContent>
                {numericColumns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full h-[400px]">
          {chartType === "bar" ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sampleData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={xAxisField} 
                  angle={-45} 
                  textAnchor="end" 
                  tick={{ fontSize: 12 }}
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={yAxisField} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartView;
