
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-klh-light to-white py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                KLH Campus Finds
                <span className="block text-klh-primary">Lost & Found System</span>
              </h1>
              <p className="text-lg text-gray-600">
                Lost something on campus? Found something that isn't yours? 
                Our platform connects the KLH community to help everyone find their belongings.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="font-medium">
                  <Link to="/auth">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="order-first lg:order-last">
              <img 
                src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="KLH Campus" 
                className="rounded-lg shadow-xl w-full h-auto object-cover max-h-[400px]" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to report, find, and claim lost items on campus.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="bg-klh-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-klh-primary">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Report Items</h3>
              <p className="text-gray-600">
                Report lost items or register items you've found on campus.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="bg-klh-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-klh-primary">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search & Browse</h3>
              <p className="text-gray-600">
                Search through the database of lost and found items on campus.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="bg-klh-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-klh-primary">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Claim & Return</h3>
              <p className="text-gray-600">
                Claim your lost items or help return items to their owners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-klh-muted">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Making a Difference</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join the KLH community in helping each other recover lost items.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-4xl font-bold text-klh-primary mb-2">150+</h3>
              <p className="text-gray-600">Items Found</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-4xl font-bold text-klh-primary mb-2">98%</h3>
              <p className="text-gray-600">Return Rate</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-4xl font-bold text-klh-primary mb-2">500+</h3>
              <p className="text-gray-600">Community Members</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-4xl font-bold text-klh-primary mb-2">24h</h3>
              <p className="text-gray-600">Avg. Claim Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-klh-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Join KLH Campus Finds Today</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Create an account now to start reporting lost items or help others find their belongings.
          </p>
          <Button asChild size="lg" variant="secondary" className="font-medium">
            <Link to="/auth">Sign Up Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
