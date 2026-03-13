import { useState, useEffect } from "react";
import { getMyRestaurant, Restaurant } from "../../../api/restaurant.api";
import {
  FiInfo,
  FiCheckCircle,
  FiDollarSign,
  FiActivity,
} from "react-icons/fi";
import { BounceLoader } from "react-spinners";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

function Overview() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [monthlyIncome] = useState([
    { month: "Jan", income: 42500 },
    { month: "Feb", income: 38700 },
    { month: "Mar", income: 55400 },
    { month: "Apr", income: 47800 },
    { month: "May", income: 63200 },
    { month: "Jun", income: 75400 },
    { month: "Jul", income: 72100 },
    { month: "Aug", income: 84500 },
    { month: "Sep", income: 67900 },
    { month: "Oct", income: 73600 },
    { month: "Nov", income: 88200 },
    { month: "Dec", income: 95400 },
  ]);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setFetchError(null);
        console.log("Fetching restaurant data...");
        const response = await getMyRestaurant();
        console.log("Restaurant API response:", response);
        if (response.success && response.data) {
          console.log("Setting restaurant state with:", response.data);
          setRestaurant(response.data);
        } else {
          console.warn("Restaurant fetch unsuccessful:", response.message);
          setFetchError(response.message || "Failed to load restaurant profile");
        }
      } catch (error: any) {
        console.error("Failed to fetch restaurant details:", error);
        setFetchError(error.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("LKR", "Rs");
  };

  const yearlyTotal = monthlyIncome.reduce(
    (total, month) => total + month.income,
    0
  );

  if (isLoading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-20 backdrop-blur-md">
        <BounceLoader size={50} color="#EE1133" />
      </div>
    );

  return (
    <div className="p-6">
      {fetchError && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 shadow-sm">
          <p className="font-bold flex items-center">
            <FiInfo className="mr-2" /> Connection Error
          </p>
          <p className="text-sm">{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-xs underline font-semibold hover:text-red-900"
          >
            Try Refreshing
          </button>
        </div>
      )}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{restaurant?.restaurantName || "My Restaurant"}</h1>
          <p className="text-gray-500 mt-1">{restaurant?.cuisineType} • {restaurant?.city}, {restaurant?.state}</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <div className={`px-4 py-2 rounded-full font-semibold flex items-center ${restaurant?.status === 'approved' ? 'bg-green-100 text-green-800' :
            restaurant?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
            <FiInfo className="mr-2" />
            <span className="capitalize">Status: {restaurant?.status || 'Unknown'}</span>
          </div>
          <div className={`px-4 py-2 rounded-full font-semibold flex items-center ${restaurant?.availability ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
            <FiActivity className="mr-2" />
            <span>{restaurant?.availability ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-event-red to-red-700 p-6 rounded-lg shadow-sm text-white transform hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium opacity-80">Annual Revenue (Est.)</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(yearlyTotal)}</p>
            </div>
            <FiDollarSign className="w-10 h-10 text-white opacity-40" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-event-red transform hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Delivery Radius</p>
              <p className="text-3xl font-bold text-event-navy mt-2">{restaurant?.deliveryRadius}</p>
            </div>
            <FiCheckCircle className="w-10 h-10 text-event-navy opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-event-red transform hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Operating Hours</p>
              <p className="text-xl font-bold text-event-navy mt-2">{restaurant?.operatingHours}</p>
            </div>
            <FiActivity className="w-10 h-10 text-event-navy opacity-20" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Monthly Performance</h2>
          <span className="text-sm text-gray-400">Values are shown in Rs (thousands)</span>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyIncome} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [formatCurrency(value as number), "Income"]}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#EE1133"
                fill="#EE1133"
                fillOpacity={0.1}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Overview;
