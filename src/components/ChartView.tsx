
import React, { useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartViewProps {
  data: any[];
}

const ChartView: React.FC<ChartViewProps> = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // If data is in array format (from CSV), transform it to objects
    if (Array.isArray(data[0])) {
      const headers = data[0];
      const revIndex = headers.findIndex((h: string) => h === 'REV');
      const sspIndex = headers.findIndex((h: string) => h === 'SSP');
      
      if (revIndex === -1 || sspIndex === -1) return [];
      
      return data.slice(1).map((row: any[]) => ({
        SSP: row[sspIndex],
        REV: Number(row[revIndex]) || 0
      }));
    }
    
    // If data is already in object format
    return data.map(row => ({
      SSP: row.SSP,
      REV: Number(row.REV) || 0
    }));
  }, [data]);

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
    <Card>
      <CardHeader>
        <CardTitle>Revenue by SSP</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
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
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="REV"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartView;
