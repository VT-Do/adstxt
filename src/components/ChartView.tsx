
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
      const revIndex = headers.findIndex((h: string) => h.toUpperCase() === 'REV');
      const sspIndex = headers.findIndex((h: string) => h.toUpperCase() === 'SSP');
      
      if (revIndex === -1 || sspIndex === -1) return [];
      
      return data.slice(1).filter(row => row[sspIndex] && row[revIndex])
        .map((row: any[]) => ({
          SSP: row[sspIndex],
          REV: Number(row[revIndex]) || 0
        }));
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

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue by SSP</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available for visualization</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border border-primary/10">
        <CardHeader className="border-b">
          <CardTitle className="text-xl text-primary">Revenue Analysis by SSP</CardTitle>
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
                    data={chartData}
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
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={140}
                      fill="#8884d8"
                      dataKey="REV"
                      nameKey="SSP"
                    >
                      {chartData.map((entry, index) => (
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
              <span className="text-xl font-bold text-primary">${totalRev.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartView;
