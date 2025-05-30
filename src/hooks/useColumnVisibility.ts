
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
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('column_visibility_settings')
          .select('hidden_columns')
          .eq('role', profile.role)
          .eq('tab', tab)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error("Error fetching column visibility:", error);
          return;
        }

        setHiddenColumns(data?.hidden_columns || []);
      } catch (error) {
        console.error("Error fetching column visibility:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColumnVisibility();
  }, [tab, profile?.role]);

  const isColumnVisible = (columnName: string) => {
    return !hiddenColumns.includes(columnName);
  };

  return {
    hiddenColumns,
    isColumnVisible,
    loading
  };
};
