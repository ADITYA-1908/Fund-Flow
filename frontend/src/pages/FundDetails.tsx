import axios from "axios";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";

interface FundData {
  fund_house: string;
  scheme_type: string;
  scheme_category: string;
  scheme_code: number;
  scheme_name: string;
  isin_growth: string;
  isin_div_reinvestment: string;
  data: Array<{
    date: string;
    nav: string;
  }>;
}

const FundDetails: React.FC = () => {
  const { schemeCode } = useParams<{ schemeCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [fundData, setFundData] = useState<FundData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (schemeCode) {
      fetchFundData();
      if (user) {
        checkIfSaved();
      }
    }
  }, [schemeCode, user]);

  const fetchFundData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/proxy/mf/${schemeCode}`
      );

      // const response = await axios.get(`https://api.mfapi.in/mf/${schemeCode}`);
      const { meta, data } = response.data;

      setFundData({
        ...meta,
        data,
      });
    } catch (error) {
      console.error("Error fetching fund data:", error);
      toast.error("Failed to load fund details");
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const response = await axios.get("/api/funds/saved");
      const savedFunds = response.data;
      setIsSaved(
        savedFunds.some((fund: any) => fund.schemeCode === schemeCode)
      );
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Please login to save funds");
      navigate("/login");
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await axios.delete(`/api/funds/saved/${schemeCode}`);
        setIsSaved(false);
        toast.success("Fund removed from saved list");
      } else {
        await axios.post("/api/funds/save", {
          schemeCode,
          schemeName: fundData?.scheme_name,
        });
        setIsSaved(true);
        toast.success("Fund saved successfully");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save fund");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!fundData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Fund not found
          </h2>
          <button onClick={() => navigate("/")} className="btn-primary">
            Go back to search
          </button>
        </div>
      </div>
    );
  }

  const latestNav = fundData.data[0];
  const previousNav = fundData.data[1];
  const navChange = previousNav
    ? parseFloat(latestNav.nav) - parseFloat(previousNav.nav)
    : 0;
  const navChangePercent = previousNav
    ? (navChange / parseFloat(previousNav.nav)) * 100
    : 0;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>

          {user && (
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isSaved
                  ? "bg-success-100 text-success-700 hover:bg-success-200"
                  : "bg-primary-600 text-white hover:bg-primary-700"
              }`}
            >
              {saving ? (
                <LoadingSpinner size="sm" />
              ) : isSaved ? (
                <BookmarkCheck className="h-5 w-5" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
              <span>{isSaved ? "Saved" : "Save Fund"}</span>
            </button>
          )}
        </div>

        {/* Fund Info Card */}
        <div className="card p-8 mb-8 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {fundData.scheme_name}
            </h1>
            <p className="text-gray-600">
              {fundData.fund_house} • {fundData.scheme_category}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-5 w-5 text-primary-600" />
                <span className="text-sm font-medium text-gray-600">
                  Current NAV
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{latestNav.nav}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp
                  className={`h-4 w-4 ${
                    navChange >= 0 ? "text-success-600" : "text-red-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    navChange >= 0 ? "text-success-600" : "text-red-600"
                  }`}
                >
                  {navChange >= 0 ? "+" : ""}₹{navChange.toFixed(2)} (
                  {navChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5 text-primary-600" />
                <span className="text-sm font-medium text-gray-600">
                  Last Updated
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(latestNav.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                <span className="text-sm font-medium text-gray-600">
                  Scheme Type
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {fundData.scheme_type}
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Fund Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Scheme Code:</span>
                <span className="ml-2 text-gray-900">
                  {fundData.scheme_code}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Category:</span>
                <span className="ml-2 text-gray-900">
                  {fundData.scheme_category}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Fund House:</span>
                <span className="ml-2 text-gray-900">
                  {fundData.fund_house}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Type:</span>
                <span className="ml-2 text-gray-900">
                  {fundData.scheme_type}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent NAV History */}
        <div
          className="card p-8 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Recent NAV History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-medium text-gray-600">
                    Date
                  </th>
                  <th className="text-right py-3 font-medium text-gray-600">
                    NAV (₹)
                  </th>
                  <th className="text-right py-3 font-medium text-gray-600">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {fundData.data.slice(0, 10).map((entry, index) => {
                  const prevEntry = fundData.data[index + 1];
                  const change = prevEntry
                    ? parseFloat(entry.nav) - parseFloat(prevEntry.nav)
                    : 0;

                  return (
                    <tr
                      key={entry.date}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 text-gray-900">
                        {new Date(entry.date).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3 text-right font-medium text-gray-900">
                        ₹{entry.nav}
                      </td>
                      <td
                        className={`py-3 text-right font-medium ${
                          change > 0
                            ? "text-success-600"
                            : change < 0
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {change > 0 ? "+" : ""}₹{change.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundDetails;
