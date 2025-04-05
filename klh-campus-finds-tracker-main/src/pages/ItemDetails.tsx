
import ItemDetail from "@/components/items/ItemDetail";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ItemDetails = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <ItemDetail />
      </main>
      
      <Footer />
    </div>
  );
};

export default ItemDetails;
