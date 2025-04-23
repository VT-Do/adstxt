
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Library = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sheet Library</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Access your saved sheets and templates.
            </p>
            {isAdmin && (
              <p className="text-sm mt-4 p-2 bg-primary/10 rounded-md">
                As an admin, you have full access to manage the sheet library.
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Sheets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Quick access to recently viewed sheets.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Pre-defined sheet templates to get started quickly.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Library;
