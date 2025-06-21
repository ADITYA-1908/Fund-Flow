import axios from "axios";
import { ArrowLeft, Bookmark } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import FundCard from "../components/FundCard";
import LoadingSpinner from "../components/LoadingSpinner";

interface SavedFund {
  _id: string;
  schemeCode: string;
  schemeName: string;
  savedAt: string;
}

const SavedFunds: React.FC = () => {
  const [savedFunds, setSavedFunds] = useState<SavedFund[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchSavedFunds();
  }, []);

  const fetchSavedFunds = async () => {
    try {
      const response = await axios.get("/api/funds/saved");
      setSavedFunds(response.data);
    } catch (error) {
      console.error("Error fetching saved funds:", error);
      toast.error("Failed to load saved funds");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (schemeCode: string) => {
    try {
      await axios.delete(`/api/funds/saved/${schemeCode}`);
      setSavedFunds(
        savedFunds.filter((fund) => fund.schemeCode !== schemeCode)
      );
      toast.success("Fund removed from saved list");
    } catch (error) {
      console.error("Error removing fund:", error);
      toast.error("Failed to remove fund");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Bookmark className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Saved Funds
          </h1>
          <p className="text-gray-600">
            {savedFunds.length > 0
              ? `You have ${savedFunds.length} saved fund${
                  savedFunds.length > 1 ? "s" : ""
                }`
              : "You haven't saved any funds yet"}
          </p>
        </div>

        {savedFunds.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedFunds.map((fund) => (
              <div key={fund._id} className="animate-fade-in">
                <FundCard
                  fund={{
                    schemeCode: fund.schemeCode,
                    schemeName: fund.schemeName,
                  }}
                  showRemove
                  onRemove={handleRemove}
                />
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Saved on {new Date(fund.savedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <Bookmark className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No saved funds yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start exploring mutual funds and save your favorites to track them
              easily.
            </p>
            <a href="/" className="btn-primary">
              Explore Funds
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedFunds;
