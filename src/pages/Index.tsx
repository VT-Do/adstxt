
import React from "react";
import { Table2, Target, Search, Filter, Eye, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <div className="inline-block mb-6 p-4 bg-green-500/20 rounded-full">
            <Table2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-green-500 to-green-300 bg-clip-text text-transparent">
            Welcome to Ads.txt Management
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your comprehensive platform for managing, analyzing, and optimizing ads.txt lines with powerful filtering and visualization tools
            {profile?.role === 'admin' && (
              <span className="block mt-2 text-green-400 font-medium">(Administrator Access)</span>
            )}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Goals Section */}
          <div className="bg-gray-900/90 backdrop-blur-sm border border-green-500/20 shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Target className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Our Goals</h2>
            </div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Streamline ads.txt management across multiple domains
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Provide real-time data visualization and analytics
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Enable efficient filtering and search capabilities
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Optimize revenue performance monitoring
              </li>
            </ul>
          </div>

          {/* Features Section */}
          <div className="bg-gray-900/90 backdrop-blur-sm border border-green-500/20 shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Search className="h-8 w-8 text-green-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Key Features</h2>
            </div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <Filter className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                Advanced filtering and search functionality
              </li>
              <li className="flex items-start">
                <Table2 className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                Interactive data tables with sorting capabilities
              </li>
              <li className="flex items-start">
                <Eye className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                Column visibility controls for customized views
              </li>
              <li className="flex items-start">
                <Settings className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                Role-based access control and permissions
              </li>
            </ul>
          </div>

          {/* Instructions Section */}
          <div className="bg-gray-900/90 backdrop-blur-sm border border-green-500/20 shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-green-300 rounded-full flex items-center justify-center mr-3">
                <span className="text-black font-bold text-sm">?</span>
              </div>
              <h2 className="text-2xl font-semibold text-white">How to Use</h2>
            </div>
            <ol className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">1</span>
                Navigate to different tabs using the top navigation
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">2</span>
                Use search and filter tools to find specific data
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">3</span>
                Click column headers to sort data ascending or descending
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">4</span>
                Customize your view with column visibility controls
              </li>
            </ol>
          </div>
        </div>

        {/* Available Tabs */}
        <div className="bg-gray-900/90 backdrop-blur-sm border border-green-500/20 shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-semibold text-white mb-6 text-center">Available Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 border border-green-500/30 rounded-lg hover:shadow-md hover:bg-green-500/10 transition-all">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Table2 className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Market Lines</h3>
              <p className="text-sm text-gray-400">View and analyze market line data with filtering and sorting capabilities</p>
            </div>
            
            <div className="text-center p-4 border border-green-500/30 rounded-lg hover:shadow-md hover:bg-green-500/10 transition-all">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Library</h3>
              <p className="text-sm text-gray-400">Access your comprehensive data library with advanced search features</p>
            </div>
            
            {profile?.role !== 'viewer' && (
              <>
                <div className="text-center p-4 border border-green-500/30 rounded-lg hover:shadow-md hover:bg-green-500/10 transition-all">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Settings className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">SH Sellers.json</h3>
                  <p className="text-sm text-gray-400">Manage and view sellers.json data for your domains</p>
                </div>
                
                <div className="text-center p-4 border border-green-500/30 rounded-lg hover:shadow-md hover:bg-green-500/10 transition-all">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Explore</h3>
                  <p className="text-sm text-gray-400">Explore regional data and analytics across different markets</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Start exploring by selecting a tab from the navigation above
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
