
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Item } from "@/types";
import { useAuth } from "@/components/auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getLostItems, getFoundItems, getUserItems } from "@/utils/supabaseUtil";

const Dashboard = () => {
  const { user } = useAuth();
  
  const { data: lostItems = [] } = useQuery({
    queryKey: ['lostItems'],
    queryFn: getLostItems,
  });
  
  const { data: foundItems = [] } = useQuery({
    queryKey: ['foundItems'],
    queryFn: getFoundItems,
  });
  
  const { data: userItems = [] } = useQuery({
    queryKey: ['userItems', user?.id],
    queryFn: () => user ? getUserItems(user.id) : Promise.resolve([]),
    enabled: !!user,
  });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Dashboard Header */}
        <section className="bg-white border-b">
          <div className="container-custom py-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="default">
                  <Link to="/report-lost">Report Lost Item</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/report-found">Report Found Item</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Dashboard Summary */}
        <section className="bg-gray-50">
          <div className="container-custom py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium mb-1">Lost Items</h3>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-klh-primary">{lostItems.length}</p>
                  <Link to="/lost-items" className="text-sm text-klh-primary hover:underline">View all</Link>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium mb-1">Found Items</h3>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-klh-secondary">{foundItems.length}</p>
                  <Link to="/found-items" className="text-sm text-klh-primary hover:underline">View all</Link>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium mb-1">My Reports</h3>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-klh-accent">
                    {userItems.length}
                  </p>
                  <Link to="/my-items" className="text-sm text-klh-primary hover:underline">View all</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Recently Lost Items */}
        <section className="py-10">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recently Lost Items</h2>
              <Link to="/lost-items" className="text-klh-primary hover:underline">View All</Link>
            </div>
            
            {lostItems.length === 0 ? (
              <div className="bg-white border rounded-lg p-6 text-center">
                <p className="text-gray-500">No lost items reported yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {lostItems.slice(0, 4).map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Recently Found Items */}
        <section className="py-10 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recently Found Items</h2>
              <Link to="/found-items" className="text-klh-primary hover:underline">View All</Link>
            </div>
            
            {foundItems.length === 0 ? (
              <div className="bg-white border rounded-lg p-6 text-center">
                <p className="text-gray-500">No found items reported yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {foundItems.slice(0, 4).map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

// Simple ItemCard component for dashboard
const ItemCard = ({ item }: { item: Item }) => {
  return (
    <Link to={`/item/${item.id}`} className="card-item block">
      <div className="aspect-video relative overflow-hidden bg-gray-100 mb-2 rounded-md">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-klh-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}
      </div>
      <h3 className="font-medium line-clamp-1">{item.title}</h3>
      <p className="text-sm text-gray-500 line-clamp-1">{item.location}</p>
    </Link>
  );
};

export default Dashboard;
