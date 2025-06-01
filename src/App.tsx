
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Library from "./pages/Library";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SellersJson from "./pages/SellersJson";
import Explore from "./pages/Explore";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <>
      {/* Only show NavBar when user is authenticated */}
      {user && <NavBar />}
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/library" element={<Library />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected route for SH Sellers.json - only for non-viewer roles */}
          <Route path="/my-library" element={
            <ProtectedRoute requireNonViewer={true}>
              <SellersJson />
            </ProtectedRoute>
          } />
          
          {/* Protected route for Explore tab - only for non-viewer roles */}
          <Route path="/explore" element={
            <ProtectedRoute requireNonViewer={true}>
              <Explore />
            </ProtectedRoute>
          } />
          
          {/* Redirect root to Market Lines for authenticated users */}
          <Route path="/login" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute requireAdmin={true}>
              <Settings />
            </ProtectedRoute>
          } />
          
          {/* Add additional routes above the catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
