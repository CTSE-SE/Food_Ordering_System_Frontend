import { useMemo, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiPackage,
  FiSearch,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiShoppingBag,
} from "react-icons/fi";

type BookingStatus = "Delivered" | "Processing" | "Cancelled" | "On The Way";

interface BookingItem {
  id: string;
  orderNumber: string;
  restaurantName: string;
  date: string;
  time: string;
  address: string;
  total: number;
  itemCount: number;
  status: BookingStatus;
}

const sampleBookings: BookingItem[] = [
  {
    id: "1",
    orderNumber: "ORD-10245",
    restaurantName: "Burger Hub",
    date: "2026-04-10",
    time: "07:30 PM",
    address: "Puhulwella, Sri Lanka",
    total: 2450,
    itemCount: 3,
    status: "Delivered",
  },
  {
    id: "2",
    orderNumber: "ORD-10246",
    restaurantName: "Pizza Palace",
    date: "2026-04-11",
    time: "08:15 PM",
    address: "Walawwatta, Kirinda",
    total: 3200,
    itemCount: 2,
    status: "On The Way",
  },
  {
    id: "3",
    orderNumber: "ORD-10247",
    restaurantName: "Spicy Kitchen",
    date: "2026-04-12",
    time: "01:10 PM",
    address: "Matara Road, Galle",
    total: 1850,
    itemCount: 4,
    status: "Processing",
  },
  {
    id: "4",
    orderNumber: "ORD-10248",
    restaurantName: "Taco House",
    date: "2026-04-12",
    time: "09:05 PM",
    address: "Akuressa, Sri Lanka",
    total: 1400,
    itemCount: 1,
    status: "Cancelled",
  },
];

const statusStyles: Record<
  BookingStatus,
  { bg: string; text: string; icon: JSX.Element }
> = {
  Delivered: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: <FiCheckCircle />,
  },
  Processing: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    icon: <FiClock />,
  },
  Cancelled: {
    bg: "bg-red-100",
    text: "text-red-700",
    icon: <FiXCircle />,
  },
  "On The Way": {
    bg: "bg-blue-100",
    text: "text-blue-700",
    icon: <FiTruck />,
  },
};

const formatCurrency = (amount: number) => {
  return `Rs. ${amount.toLocaleString()}`;
};

const MyBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "All" | BookingStatus
  >("All");

  const filteredBookings = useMemo(() => {
    return sampleBookings.filter((booking) => {
      const matchesSearch =
        booking.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.restaurantName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || booking.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

  const totalOrders = sampleBookings.length;
  const deliveredOrders = sampleBookings.filter(
    (booking) => booking.status === "Delivered"
  ).length;
  const processingOrders = sampleBookings.filter(
    (booking) =>
      booking.status === "Processing" || booking.status === "On The Way"
  ).length;

  return (
    <div className="px-2 md:px-0 font-Mainfront">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-3xl bg-white border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.06)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Orders</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">
                  {totalOrders}
                </h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl">
                <FiShoppingBag />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.06)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Delivered</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">
                  {deliveredOrders}
                </h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl">
                <FiCheckCircle />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.06)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Orders</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">
                  {processingOrders}
                </h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl">
                <FiTruck />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-3xl bg-white border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.06)] p-5">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by order number, restaurant, or address"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-slate-50 pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {["All", "Delivered", "Processing", "On The Way", "Cancelled"].map(
                (status) => {
                  const isActive = selectedStatus === status;
                  return (
                    <button
                      key={status}
                      onClick={() =>
                        setSelectedStatus(status as "All" | BookingStatus)
                      }
                      className={`px-4 py-2 rounded-2xl text-sm font-semibold transition ${
                        isActive
                          ? "bg-gradient-to-r from-[#EE1133] to-red-500 text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {status}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Booking Cards */}
        {filteredBookings.length === 0 ? (
          <div className="rounded-3xl bg-white border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.06)] p-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-3xl mb-4">
              <FiPackage />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">No bookings found</h3>
            <p className="text-slate-500 mt-2">
              Try changing the search text or status filter.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredBookings.map((booking) => {
              const statusStyle = statusStyles[booking.status];

              return (
                <div
                  key={booking.id}
                  className="rounded-3xl bg-white border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.06)] p-6 hover:shadow-[0_14px_40px_rgba(0,0,0,0.08)] transition"
                >
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                    {/* Left */}
                    <div className="space-y-4 flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-sm text-slate-500">Order Number</p>
                          <h3 className="text-2xl font-bold text-slate-800">
                            {booking.orderNumber}
                          </h3>
                        </div>

                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold w-fit ${statusStyle.bg} ${statusStyle.text}`}
                        >
                          {statusStyle.icon}
                          {booking.status}
                        </div>
                      </div>

                      <div>
                        <p className="text-lg font-semibold text-slate-800">
                          {booking.restaurantName}
                        </p>
                        <p className="text-slate-500 mt-1">
                          {booking.itemCount} item{booking.itemCount > 1 ? "s" : ""} ordered
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                            <FiCalendar />
                            Date
                          </div>
                          <p className="font-semibold text-slate-800">{booking.date}</p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                            <FiClock />
                            Time
                          </div>
                          <p className="font-semibold text-slate-800">{booking.time}</p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                            <FiPackage />
                            Total
                          </div>
                          <p className="font-semibold text-slate-800">
                            {formatCurrency(booking.total)}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                          <FiMapPin />
                          Delivery Address
                        </div>
                        <p className="font-semibold text-slate-800 break-words">
                          {booking.address}
                        </p>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="xl:w-[220px] flex xl:flex-col gap-3">
                      <button className="flex-1 xl:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#38bdf8] text-white font-semibold shadow-md hover:opacity-95 transition">
                        View Details
                      </button>

                      {booking.status !== "Cancelled" &&
                        booking.status !== "Delivered" && (
                          <button className="flex-1 xl:flex-none px-5 py-3 rounded-2xl border border-gray-300 text-slate-700 font-semibold hover:bg-slate-50 transition">
                            Track Order
                          </button>
                        )}

                      {booking.status === "Delivered" && (
                        <button className="flex-1 xl:flex-none px-5 py-3 rounded-2xl border border-gray-300 text-slate-700 font-semibold hover:bg-slate-50 transition">
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;