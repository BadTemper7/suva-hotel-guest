// src/pages/guest/Rooms.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRoomStore } from "../stores/roomStore";
import { useGuestStore } from "../stores/guestStore";

export default function GuestRooms() {
  const navigate = useNavigate();
  const { rooms, loading, error, fetchRooms } = useRoomStore();
  const { isAuthenticated, checkAuth, initialize, initialized } =
    useGuestStore();
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");

  useEffect(() => {
    document.title = "Suva's Place Resort - Rooms";
    // Fetch rooms - now works without authentication
    fetchRooms({ status: "active" });
  }, [fetchRooms]);

  // Filter rooms when rooms data changes or filters change
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      let filtered = rooms.filter((room) => room.category === "room");

      // Search by room number or type
      if (searchTerm) {
        filtered = filtered.filter(
          (room) =>
            room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.roomType?.name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()),
        );
      }

      // Filter by capacity
      if (selectedCapacity) {
        filtered = filtered.filter(
          (room) => room.capacity >= parseInt(selectedCapacity),
        );
      }

      // Filter by price range
      if (selectedPriceRange) {
        const [min, max] = selectedPriceRange.split("-").map(Number);
        if (max) {
          filtered = filtered.filter(
            (room) => room.rate >= min && room.rate <= max,
          );
        } else {
          filtered = filtered.filter((room) => room.rate >= min);
        }
      }

      setFilteredRooms(filtered);
    }
  }, [rooms, searchTerm, selectedCapacity, selectedPriceRange]);

  // Verify auth on component mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        if (!initialized) {
          initialize();
        }
        await checkAuth();
      } catch (error) {
        console.error("Auth verification error:", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyAuth();
  }, [checkAuth, initialize, initialized]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCapacity("");
    setSelectedPriceRange("");
  };

  // Show loading while checking auth
  if (checkingAuth || !initialized) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse"
            >
              <div className="h-64 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Error loading rooms: {error}</p>
          <button
            onClick={() => fetchRooms({ status: "active" })}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Rooms</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience comfort and luxury in our beautifully appointed rooms,
          designed for the perfect stay.
        </p>
        {!isAuthenticated && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg inline-block">
            <p className="text-sm text-blue-800">
              🔐{" "}
              <Link to="/login" className="font-semibold underline">
                Login
              </Link>{" "}
              or{" "}
              <Link to="/register" className="font-semibold underline">
                Register
              </Link>{" "}
              to make a reservation
            </p>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Room
            </label>
            <input
              type="text"
              placeholder="Room number or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Capacity
            </label>
            <select
              value={selectedCapacity}
              onChange={(e) => setSelectedCapacity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any</option>
              <option value="2">2+ guests</option>
              <option value="4">4+ guests</option>
              <option value="6">6+ guests</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Prices</option>
              <option value="0-1000">Under ₱1,000</option>
              <option value="1000-2000">₱1,000 - ₱2,000</option>
              <option value="2000-3000">₱2,000 - ₱3,000</option>
              <option value="3000-5000">₱3,000 - ₱5,000</option>
              <option value="5000-999999">₱5,000+</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-gray-600">
        Found {filteredRooms.length} room(s)
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No rooms match your search criteria.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Room Image */}
              <div className="relative h-64 overflow-hidden">
                {room.images && room.images.length > 0 ? (
                  <img
                    src={room.images[0].url}
                    alt={room.roomType?.name || "Room"}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center">
                    <span className="text-4xl">🛏️</span>
                  </div>
                )}
                {room.status === "unavailable" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                      Currently Unavailable
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {room.roomType?.name || "Standard"}
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {room.roomType?.name || "Room"} {room.roomNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Room #{room.roomNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">4.8</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {room.description ||
                    `A comfortable ${room.roomType?.name || "room"} with modern amenities and beautiful views.`}
                </p>

                {/* Room Specs */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>👥</span>
                    <span>Up to {room.capacity || 2} guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🛏️</span>
                    <span>{room.bedType || "Queen"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📏</span>
                    <span>{room.size || "25"} m²</span>
                  </div>
                </div>

                {/* Amenities Preview */}
                {room.amenities && room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {amenity.name || amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Price and Contact Info */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(room.rate)}
                    </span>
                    <span className="text-gray-500 text-sm"> / night</span>
                  </div>

                  {/* Contact Information */}
                  <div className="text-center text-sm text-gray-500 border-t border-gray-100 pt-3">
                    <p className="font-semibold text-gray-700 mb-1">
                      For inquiries and reservations:
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <span>📞</span>
                      <span>+63 976023356</span>
                    </p>
                    <p className="flex items-center justify-center gap-2 mt-1">
                      <span>📧</span>
                      <span>suvasplaceinc@gmail.com</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
