
import React, { useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBar, PieChart as PieChartIcon } from "lucide-react";

interface ChartViewProps {
  data: any[];
}

const COLORS = ['#5ede8e', '#33c3f0', '#9b87f5', '#f97316', '#d946ef', '#0ea5e9', '#8b5cf6'];

const ChartView: React.FC<ChartViewProps> = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // If data is in array format (from CSV), transform it to objects
    if (Array.isArray(data[0])) {
      const headers = data[0];
      
      // Log headers to troubleshoot
      console.log("Headers:", headers);
      
      // Find column indices - try multiple variations of the column names
      const revIndex = headers.findIndex((h: string) => 
        typeof h === 'string' && 
        (h.toUpperCase().includes('REV') || 
         h.toUpperCase().includes('REVENUE') ||
         h.toUpperCase() === 'AMOUNT')
      );
      
      const sspIndex = headers.findIndex((h: string) => 
        typeof h === 'string' && 
        (h.toUpperCase().includes('SSP') || 
         h.toUpperCase().includes('SUPPLIER') ||
         h.toUpperCase().includes('PARTNER'))
      );
      
      if (revIndex === -1 || sspIndex === -1) {
        console.log("Could not find REV or SSP columns. Headers:", headers);
        return [];
      }
      
      console.log("Found REV at index", revIndex, "and SSP at index", sspIndex);
      
      // Create aggregated data by SSP
      const aggregatedData: Record<string, number> = {};
      
      // Process all rows except headers
      data.slice(1).forEach((row: any[]) => {
        if (!row[sspIndex] || row.length <= revIndex) return;
        
        const ssp = row[sspIndex];
        // Convert to number and default to 0 if NaN
        const revenue = parseFloat(row[revIndex]) || 0;
        
        // Aggregate revenue by SSP
        if (!aggregatedData[ssp]) {
          aggregatedData[ssp] = 0;
        }
        aggregatedData[ssp] += revenue;
      });
      
      // Convert to array format for charts
      const result = Object.entries(aggregatedData).map(([ssp, rev]) => ({
        SSP: ssp,
        REV: rev
      }));
      
      console.log("Processed chart data:", result);
      return result;
    }
    
    // If data is already in object format
    return data.filter(row => row.SSP && row.REV)
      .map(row => ({
        SSP: row.SSP,
        REV: Number(row.REV) || 0
      }));
  }, [data]);

  const totalRev = useMemo(() => {
    if (!chartData.length) return 0;
    return chartData.reduce((sum, item) => sum + item.REV, 0);
  }, [chartData]);

  console.log("Chart data:", chartData);
  console.log("Total revenue:", totalRev);

  // Create example data if no data available
  const exampleData = useMemo(() => {
    if (chartData.length > 0) return chartData;
    
    // Return example data for demonstration
    return [
      { SSP: "Google", REV: 15000 },
      { SSP: "Amazon", REV: 12000 },
      { SSP: "Freewheel", REV: 8000 },
      { SSP: "Rubicon", REV: 6500 },
      { SSP: "Pubmatic", REV: 5000 },
      { SSP: "AppNexus", REV: 4500 },
      { SSP: "Smart", REV: 3000 }
    ];
  }, [chartData]);

  // Decide which data to use - real or example
  const displayData = chartData.length > 0 ? chartData : exampleData;
  const isExample = chartData.length === 0;

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border border-primary/10">
        <CardHeader className="border-b">
          <CardTitle className="text-xl text-primary">Revenue Analysis by SSP</CardTitle>
          {isExample && (
            <p className="text-sm text-muted-foreground">
              Showing example data. Please load a sheet with REV and SSP columns to see your actual data.
            </p>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="bar" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="bar" className="flex items-center gap-2">
                <ChartBar className="h-4 w-4" />
                Bar Chart
              </TabsTrigger>
              <TabsTrigger value="pie" className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4" />
                Pie Chart
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bar" className="pt-2">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={displayData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 40,
                      bottom: 60
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="SSP"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fill: 'hsl(var(--foreground))' }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--foreground))' }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="REV"
                      name="Revenue"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="pie" className="pt-2">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={displayData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={140}
                      fill="#8884d8"
                      dataKey="REV"
                      nameKey="SSP"
                    >
                      {displayData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Revenue:</span>
              <span className="text-xl font-bold text-primary">
                ${(isExample ? displayData.reduce((sum, item) => sum + item.REV, 0) : totalRev).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartView;
