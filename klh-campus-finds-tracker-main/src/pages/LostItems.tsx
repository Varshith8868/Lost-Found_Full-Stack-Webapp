
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ItemGrid from "@/components/items/ItemGrid";
import { Item } from "@/types";
import { getLostItems } from "@/utils/supabaseUtil";
import { useQuery } from "@tanstack/react-query";

const LostItems = () => {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['lostItems'],
    queryFn: getLostItems,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-10">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-8">Lost Items</h1>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <ItemGrid items={items} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LostItems;
