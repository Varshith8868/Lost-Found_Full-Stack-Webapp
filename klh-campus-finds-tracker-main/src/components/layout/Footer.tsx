
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t py-8 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">KLH Campus Finds</h3>
            <p className="text-sm text-gray-600">
              Helping the KLH community reconnect with their lost items.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-klh-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/report-item" className="text-sm text-gray-600 hover:text-klh-primary">
                  Report Lost Item
                </Link>
              </li>
              <li>
                <Link to="/found-items" className="text-sm text-gray-600 hover:text-klh-primary">
                  Found Items
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm text-gray-600">
              KLH Campus Security<br />
              Main Building, Ground Floor<br />
              Email: lostfound@klh.edu<br />
              Phone: (123) 456-7890
            </p>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} KLH Campus Finds. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
