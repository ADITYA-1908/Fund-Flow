import axios from "axios";
import { Search } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import FundCard from "../components/FundCard";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
interface Fund {
  schemeCode: string;
  schemeName: string;
}

const Home: React.FC = () => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query) {
      setFunds([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `/api/mf/search?q=${encodeURIComponent(query)}`
      );
      const results = response.data || [];
      setFunds(results);
      setSearched(true);

      // ✅ Show toast after search is done
      toast.success(
        `${results.length} fund${results.length !== 1 ? "s" : ""} found`
      );
    } catch (error) {
      console.error("Search error:", error);
      setFunds([]);
      toast.error("Failed to fetch results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Your Perfect
              <span className="text-primary-600 block">Mutual Fund</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Search, analyze, and save your favorite mutual funds with
              real-time data. Make informed investment decisions with our
              comprehensive platform.
            </p>
          </div>

          {/* Search Section */}
          <div className="animate-slide-up mb-16">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>

          {/* Features */}
        </div>
      </section>

      {/* Search Results */}
      {(loading || searched) && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {loading
                ? "Searching..."
                : `Search Results (${funds.length} funds)`}
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : funds.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {funds.map((fund) => (
                  <FundCard key={fund.schemeCode} fund={fund} />
                ))}
              </div>
            ) : searched ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No funds found
                </h3>
                <p className="text-gray-600">
                  Try searching with different keywords
                </p>
              </div>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
