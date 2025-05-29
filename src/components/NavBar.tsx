
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Library, Book, Mail, Home, LogOut } from "lucide-react";

const NavBar = () => {
  const location = useLocation();
  const { user, profile, signOut, isAdmin } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Check if user is viewer (should not see SH Sellers.json tab)
  const isViewer = profile?.role === 'viewer';

  return (
    <header className="border-b sticky top-0 z-40 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            ADS.TXT DATA
          </Link>
          
          {/* Primary Navigation Links */}
          <nav className="flex items-center space-x-1">
            <Link to="/login">
              <Button 
                variant={isActive("/login") ? "default" : "ghost"} 
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Market Lines
              </Button>
            </Link>
            <Link to="/library">
              <Button 
                variant={isActive("/library") ? "default" : "ghost"}
                className="gap-2"
              >
                <Library className="h-4 w-4" />
                Library
              </Button>
            </Link>
            {/* Only show SH Sellers.json tab if user is NOT a viewer */}
            {!isViewer && (
              <Link to="/my-library">
                <Button 
                  variant={isActive("/my-library") ? "default" : "ghost"}
                  className="gap-2"
                >
                  <Book className="h-4 w-4" />
                  SH Sellers.json
                </Button>
              </Link>
            )}
            <Link to="/contact">
              <Button 
                variant={isActive("/contact") ? "default" : "ghost"} 
                className="gap-2"
              >
                <Mail className="h-4 w-4" />
                Contact
              </Button>
            </Link>
          </nav>
          
          {/* Secondary Navigation (only visible when logged in) */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              <Link to="/login">
                <Button 
                  variant={isActive("/") ? "default" : "ghost"} 
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Main - Test
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button 
                    variant={isActive("/admin") ? "default" : "ghost"}
                    className="gap-2"
                  >
                    Admin
                  </Button>
                </Link>
              )}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-medium">{profile?.email}</span>
                {profile?.role && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {profile.role}
                  </span>
                )}
              </div>
              <Button onClick={signOut} variant="ghost" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Log in</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
