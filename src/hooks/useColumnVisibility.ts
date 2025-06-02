
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useColumnVisibility = (tab: string) => {
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchColumnVisibility = async () => {
      if (!profile?.role) {
        console.log("No profile role found, setting loading to false");
        setLoading(false);
        return;
      }

      console.log("Fetching column visibility for role:", profile.role, "tab:", tab);

      try {
        // Using raw query until types are regenerated
        const { data, error } = await supabase
          .rpc('exec_sql', {
            sql: `SELECT hidden_columns FROM column_visibility_settings WHERE role = $1 AND tab = $2`,
            params: [profile.role, tab]
          })
          .catch(async () => {
            // Fallback to direct query if RPC doesn't work
            const response = await supabase
              .from('column_visibility_settings' as any)
              .select('hidden_columns')
              .eq('role', profile.role)
              .eq('tab', tab)
              .single();
            return response;
          });

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error("Error fetching column visibility:", error);
          return;
        }

        console.log("Column visibility data:", data);
        const columnsToHide = data?.hidden_columns || [];
        console.log("Setting hidden columns:", columnsToHide);
        setHiddenColumns(columnsToHide);
      } catch (error) {
        console.error("Error fetching column visibility:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColumnVisibility();
  }, [tab, profile?.role]);

  const isColumnVisible = (columnName: string) => {
    const visible = !hiddenColumns.includes(columnName);
    console.log(`Column ${columnName} is ${visible ? 'visible' : 'hidden'} for role ${profile?.role}`);
    return visible;
  };

  return {
    hiddenColumns,
    isColumnVisible,
    loading
  };
};
