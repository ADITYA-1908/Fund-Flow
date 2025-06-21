import { BarChart3, Search, Shield } from "lucide-react";
import React from "react";

const Dashboard: React.FC = () => {


  return (
    <div className="min-h-screen py-16 px-6 bg-gradient-to-br from-gray-50 to-blue-100">
      <div className="max-w-6xl mx-auto text-center">
  
        {/* Description Block */}
        <div className="animate-fade-in mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to Your
            <span className="text-primary-600 block">
              Mutual Fund Dashboard
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Effortlessly manage your mutual fund investments. Search funds in
            real time, view comprehensive analytics, and track your favorite
            schemes—all from one secure, personalized dashboard. Built to
            empower smart financial decisions.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-8 text-center bg-white shadow-lg rounded-xl animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <Search className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Smart Search</h3>
            <p className="text-gray-600">
              Find funds instantly with our powerful search engine powered by
              real-time data.
            </p>
          </div>

          <div
            className="card p-8 text-center bg-white shadow-lg rounded-xl animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mb-6">
              <BarChart3 className="h-8 w-8 text-success-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Detailed Analytics</h3>
            <p className="text-gray-600">
              Access comprehensive fund data, NAV trends, and performance
              metrics.
            </p>
          </div>

          <div
            className="card p-8 text-center bg-white shadow-lg rounded-xl animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Save & Track</h3>
            <p className="text-gray-600">
              Save your favorite funds and track their performance in your
              personal dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
