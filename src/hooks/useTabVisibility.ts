
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useTabVisibility = () => {
  const [hiddenTabs, setHiddenTabs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchTabVisibility = async () => {
      if (!profile?.role) {
        console.log("No profile role found, setting loading to false");
        setLoading(false);
        return;
      }

      console.log("Fetching tab visibility for role:", profile.role);

      try {
        const { data, error } = await supabase
          .from('tab_visibility_settings')
          .select('hidden_tabs')
          .eq('role', profile.role)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error("Error fetching tab visibility:", error);
          setHiddenTabs([]); // Default to no hidden tabs on error
          setLoading(false);
          return;
        }

        console.log("Tab visibility data:", data);
        const tabsToHide = data?.hidden_tabs || [];
        console.log("Setting hidden tabs:", tabsToHide);
        setHiddenTabs(tabsToHide);
      } catch (error) {
        console.error("Error fetching tab visibility:", error);
        setHiddenTabs([]); // Default to no hidden tabs on error
      } finally {
        setLoading(false);
      }
    };

    fetchTabVisibility();
  }, [profile?.role]);

  const isTabVisible = (tabId: string) => {
    // If we're still loading, assume tab is visible
    if (loading) return true;
    
    const visible = !hiddenTabs.includes(tabId);
    console.log(`Tab ${tabId} is ${visible ? 'visible' : 'hidden'} for role ${profile?.role}`);
    return visible;
  };

  return {
    hiddenTabs,
    isTabVisible,
    loading
  };
};
