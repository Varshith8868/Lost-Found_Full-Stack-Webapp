
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ItemForm from "@/components/items/ItemForm";

const ReportFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-10">
        <div className="container-custom">
          <ItemForm type="found" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportFound;
