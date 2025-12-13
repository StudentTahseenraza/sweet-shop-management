import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-display font-bold gradient-text">Sweet Shop</h2>
            <p className="text-gray-400 mt-2">Delicious treats made with love</p>
          </div>
          <div className="flex space-x-6">
            <a href="/about" className="text-gray-400 hover:text-white transition-colors">
              About
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Sweet Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
