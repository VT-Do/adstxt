
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Bug } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [email, setEmail] = useState("van.tiep.do@showheroes-group.com");
  const [password, setPassword] = useState("Test12345@");
  const { signIn, isLoading } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (debugMode) {
        console.log("Attempting login with:", { email, password: "********" });
        
        // Try to get session first to check if we're already logged in
        const { data: sessionData } = await supabase.auth.getSession();
        console.log("Current session status:", sessionData.session ? "Active session" : "No active session");
        
        // Try sign-in directly with supabase client
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (signInError) {
          console.error("Direct login error:", signInError);
          setError(`Login error: ${signInError.message}`);
          return;
        }
        
        console.log("Direct login success:", data);
        toast({
          title: "Login successful via debug mode",
          description: "Redirecting...",
        });
        
        window.location.href = "/";
        return;
      }
      
      // Regular login through AuthContext
      await signIn(email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error?.message || "Invalid login credentials");
    }
  };

  const createTestUser = async () => {
    try {
      // Try to create a test user directly
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: "Test Admin",
          },
        }
      });
      
      if (error) {
        setError(`Failed to create test user: ${error.message}`);
        return;
      }
      
      console.log("Test user creation response:", data);
      toast({
        title: "Test user created",
        description: "Please check your email for verification or try logging in now.",
      });
    } catch (err: any) {
      setError(`Error creating test user: ${err.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/",
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Google login error:", error);
      setError(error?.message || "Google login failed");
      toast({
        title: "Login failed",
        description: error?.message || "Google login failed",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
          <div className="flex items-center justify-center">
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => setDebugMode(!debugMode)}
              className="text-xs text-gray-500"
            >
              <Bug className="h-3 w-3 mr-1" />
              {debugMode ? "Disable Debug Mode" : "Enable Debug Mode"}
            </Button>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            
            {debugMode && (
              <Button 
                type="button"
                variant="outline" 
                onClick={createTestUser}
                className="w-full"
              >
                Create Test User
              </Button>
            )}
            
            <div className="relative">
              <div className="flex items-center justify-center">
                <span className="w-full border-t" />
                <span className="px-2 text-xs text-muted-foreground bg-white z-10">or</span>
                <span className="w-full border-t" />
              </div>
            </div>
            
            <Button 
              type="button" 
              onClick={handleGoogleLogin}
              className="w-full"
              variant="outline"
              disabled={googleLoading}
            >
              <LogIn className="h-4 w-4 mr-2" />
              {googleLoading ? "Redirecting..." : "Sign in with Google"}
            </Button>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-green-500 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
