import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useSweets } from "../../../contexts/SweetContext";
import Button from "../../common/Button/Button";
interface SweetCardProps {
  sweet: any;
  onViewDetails?: () => void;
}

const SweetCard: React.FC<SweetCardProps> = ({ 
  sweet, 
  onViewDetails
}) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { purchaseSweet } = useSweets();

  const handlePurchase = async () => {
    try {
      await purchaseSweet(sweet.id, 1);
    } catch (error) {
      // Error handled in context
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img
          src={sweet.imageUrl || "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000"}
          alt={sweet.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 truncate">{sweet.name}</h3>
          <span className="text-2xl font-bold text-primary-600">
            ${sweet.price.toFixed(2)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {sweet.description || "Delicious sweet treat!"}
        </p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${sweet.quantity > 10 ? "bg-green-500" : sweet.quantity > 0 ? "bg-yellow-500" : "bg-red-500"}`} />
            <span className="text-sm font-medium text-gray-700">
              {sweet.quantity} in stock
            </span>
          </div>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
            {sweet.category}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {isAuthenticated && sweet.quantity > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={handlePurchase}
              disabled={sweet.quantity === 0}
              className="flex-1"
            >
              Purchase
            </Button>
          )}

          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              className="flex-1"
            >
              Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
