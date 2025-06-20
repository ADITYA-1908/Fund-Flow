import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} FundFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
