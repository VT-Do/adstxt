
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, LogIn } from "lucide-react";
import { authenticateWithGoogle } from "@/utils/googleApi";

interface SheetAuthProps {
  onAuthSuccess: () => void;
}

const SheetAuth: React.FC<SheetAuthProps> = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async () => {
    try {
      setLoading(true);
      setError("");
      
      // In a real app, we'd authenticate with Google's OAuth
      // For this prototype, we'll simulate authentication
      const success = await authenticateWithGoogle(apiKey);
      
      if (success) {
        onAuthSuccess();
      } else {
        setError("Authentication failed. Please check your API key.");
      }
    } catch (err) {
      setError("An error occurred during authentication.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Google Sheets Authentication</CardTitle>
        <CardDescription>
          Enter your Google API key or authorize with your Google account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium">
            Google API Key
          </label>
          <div className="flex gap-2">
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Google API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          onClick={handleAuth} 
          className="w-full" 
          disabled={loading}
        >
          <KeyRound className="h-4 w-4 mr-2" />
          {loading ? "Authenticating..." : "Connect with API Key"}
        </Button>
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">or</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={handleAuth} 
          className="w-full"
          disabled={loading}
        >
          <LogIn className="h-4 w-4 mr-2" />
          Sign in with Google
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SheetAuth;
