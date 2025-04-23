
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const NavBar = () => {
  const location = useLocation();
  const { user, profile, signOut, isAdmin } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            OMP Test
          </Link>
          
          {/* Freeze tabs as a navigation menu */}
          {user && (
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <Link to="/" legacyBehavior passHref>
                    <NavigationMenuLink 
                      className={navigationMenuTriggerStyle({ className: isActive("/") ? "bg-accent" : "" })}
                    >
                      Main
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/library" legacyBehavior passHref>
                    <NavigationMenuLink 
                      className={navigationMenuTriggerStyle({ className: isActive("/library") ? "bg-accent" : "" })}
                    >
                      Library
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contact" legacyBehavior passHref>
                    <NavigationMenuLink 
                      className={navigationMenuTriggerStyle({ className: isActive("/contact") ? "bg-accent" : "" })}
                    >
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {isAdmin && (
                  <NavigationMenuItem>
                    <Link to="/admin" legacyBehavior passHref>
                      <NavigationMenuLink 
                        className={navigationMenuTriggerStyle({ className: isActive("/admin") ? "bg-accent" : "" })}
                      >
                        Admin
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-medium">{profile?.full_name || profile?.email}</span>
                {profile?.role && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {profile.role}
                  </span>
                )}
              </div>
              <Button onClick={signOut} variant="outline" size="sm">
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
