import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Fund {
  schemeCode: string;
  schemeName: string;
  nav?: string;
  date?: string;
}

interface FundCardProps {
  fund: Fund;
  showRemove?: boolean;
  onRemove?: (schemeCode: string) => void;
}

const FundCard: React.FC<FundCardProps> = ({ fund, showRemove = false, onRemove }) => {
  const navValue = fund.nav ? parseFloat(fund.nav) : null;
  
  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {fund.schemeName}
          </h3>
          <p className="text-sm text-gray-600 mb-3">Code: {fund.schemeCode}</p>
        </div>
        
        {navValue && (
          <div className="flex items-center space-x-1 text-sm">
            <TrendingUp className="h-4 w-4 text-success-600" />
            <span className="font-medium text-gray-900">₹{navValue.toFixed(2)}</span>
          </div>
        )}
      </div>
      
      {fund.date && (
        <p className="text-xs text-gray-500 mb-4">
          Last updated: {new Date(fund.date).toLocaleDateString()}
        </p>
      )}
      
      <div className="flex space-x-3">
        <Link
          to={`/fund/${fund.schemeCode}`}
          className="flex-1 btn-primary text-center"
        >
          View Details
        </Link>
        
        {showRemove && onRemove && (
          <button
            onClick={() => onRemove(fund.schemeCode)}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default FundCard;