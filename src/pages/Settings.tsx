
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Save } from "lucide-react";

interface ColumnVisibilitySettings {
  id?: string;
  role: string;
  tab: string;
  hidden_columns: string[];
}

const Settings = () => {
  const [marketLinesColumns, setMarketLinesColumns] = useState<string[]>([]);
  const [libraryColumns, setLibraryColumns] = useState<string[]>([]);
  const [viewerSettings, setViewerSettings] = useState<ColumnVisibilitySettings[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Sample columns for Market Lines (these would normally come from actual data)
  const sampleMarketLinesColumns = [
     "Line", "Key","BU","Score","Score","Priority_Weight","Revenue","OMP_rev","PMP_rev","RES_rev","Revenue_all",
    "BidOpp","OMP_bidopp","PMP_bidopp","RES_bidopp","BidOpp_all","RPMO","Primary_Line","SELLER DOMAIN","SELLER NAME","SELLER TYPE"];

  // Sample columns for Library (these would normally come from actual data)
  const sampleLibraryColumns = [
    "Line", "Type", "Primary_Line", "Priority_Weight", "Account", 
    "demand_partner", "demand_market_division", "ID", "SELLER DOMAIN", "SELLER NAME","SELLER TYPE"];

  useEffect(() => {
    setMarketLinesColumns(sampleMarketLinesColumns);
    setLibraryColumns(sampleLibraryColumns);
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('column_visibility_settings' as any)
        .select('*')
        .eq('role', 'viewer');

      if (error) {
        console.error("Error fetching settings:", error);
        return;
      }

      setViewerSettings((data as any) || []);
    } catch (error: any) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getHiddenColumns = (tab: string): string[] => {
    const setting = viewerSettings.find(s => s.tab === tab);
    return setting?.hidden_columns || [];
  };

  const updateColumnVisibility = (tab: string, column: string, isHidden: boolean) => {
    const existingSettingIndex = viewerSettings.findIndex(s => s.tab === tab);
    
    if (existingSettingIndex >= 0) {
      const updatedSettings = [...viewerSettings];
      const hiddenColumns = updatedSettings[existingSettingIndex].hidden_columns;
      
      if (isHidden) {
        if (!hiddenColumns.includes(column)) {
          hiddenColumns.push(column);
        }
      } else {
        const index = hiddenColumns.indexOf(column);
        if (index > -1) {
          hiddenColumns.splice(index, 1);
        }
      }
      
      setViewerSettings(updatedSettings);
    } else {
      // Create new setting
      const newSetting: ColumnVisibilitySettings = {
        role: 'viewer',
        tab: tab,
        hidden_columns: isHidden ? [column] : []
      };
      setViewerSettings([...viewerSettings, newSetting]);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      
      // Delete existing settings for viewer role
      await supabase
        .from('column_visibility_settings' as any)
        .delete()
        .eq('role', 'viewer');

      // Insert new settings
      const settingsToInsert = viewerSettings.map(setting => ({
        role: setting.role,
        tab: setting.tab,
        hidden_columns: setting.hidden_columns
      }));

      if (settingsToInsert.length > 0) {
        const { error } = await supabase
          .from('column_visibility_settings' as any)
          .insert(settingsToInsert);

        if (error) {
          throw error;
        }
      }

      toast({
        title: "Settings saved",
        description: "Column visibility settings have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderColumnToggles = (columns: string[], tab: string) => {
    const hiddenColumns = getHiddenColumns(tab);
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {columns.map((column) => (
          <div key={column} className="flex items-center space-x-2">
            <Switch
              id={`${tab}-${column}`}
              checked={hiddenColumns.includes(column)}
              onCheckedChange={(checked) => updateColumnVisibility(tab, column, checked)}
            />
            <Label htmlFor={`${tab}-${column}`} className="text-sm">
              Hide "{column}"
            </Label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Column Visibility Settings for Viewer Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Configure which columns should be hidden for users with the "viewer" role in different tabs.
              </p>
              
              <Tabs defaultValue="market-lines" className="w-full">
                <TabsList>
                  <TabsTrigger value="market-lines">Market Lines</TabsTrigger>
                  <TabsTrigger value="library">Library</TabsTrigger>
                </TabsList>
                
                <TabsContent value="market-lines" className="space-y-4">
                  <h3 className="text-lg font-medium">Market Lines Tab Columns</h3>
                  {renderColumnToggles(marketLinesColumns, 'market-lines')}
                </TabsContent>
                
                <TabsContent value="library" className="space-y-4">
                  <h3 className="text-lg font-medium">Library Tab Columns</h3>
                  {renderColumnToggles(libraryColumns, 'library')}
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end pt-4">
                <Button onClick={saveSettings} disabled={loading} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
