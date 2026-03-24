// src/pages/guest/Cottages.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRoomStore } from "../stores/roomStore";
import { useGuestStore } from "../stores/guestStore";

export default function GuestCottages() {
  const navigate = useNavigate();
  const { rooms, loading, error, fetchRooms } = useRoomStore();
  const { isAuthenticated, checkAuth, initialize, initialized } =
    useGuestStore();
  const [filteredCottages, setFilteredCottages] = useState([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");

  useEffect(() => {
    document.title = "Suva's Place Resort - Cottages";
    // Fetch rooms - now works without authentication
    fetchRooms({ status: "active" });
  }, [fetchRooms]);

  // Filter cottages when rooms data changes or filters change
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      let filtered = rooms.filter((room) => room.category === "cottage");

      // Search by cottage number
      if (searchTerm) {
        filtered = filtered.filter((cottage) =>
          cottage.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      // Filter by capacity
      if (selectedCapacity) {
        filtered = filtered.filter(
          (cottage) => cottage.capacity >= parseInt(selectedCapacity),
        );
      }

      // Filter by price range
      if (selectedPriceRange) {
        const [min, max] = selectedPriceRange.split("-").map(Number);
        if (max) {
          filtered = filtered.filter(
            (cottage) => cottage.rate >= min && cottage.rate <= max,
          );
        } else {
          filtered = filtered.filter((cottage) => cottage.rate >= min);
        }
      }

      setFilteredCottages(filtered);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
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
          <p className="text-red-600">Error loading cottages: {error}</p>
          <button
            onClick={() => fetchRooms({ status: "active" })}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Cottages</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience the perfect blend of comfort and nature in our charming
          traditional Filipino-style cottages.
        </p>
        {!isAuthenticated && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg inline-block">
            <p className="text-sm text-green-800">
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
              Search Cottage
            </label>
            <input
              type="text"
              placeholder="Cottage number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Capacity
            </label>
            <select
              value={selectedCapacity}
              onChange={(e) => setSelectedCapacity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Any</option>
              <option value="4">4+ guests</option>
              <option value="6">6+ guests</option>
              <option value="8">8+ guests</option>
              <option value="10">10+ guests</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Prices</option>
              <option value="0-2000">Under ₱2,000</option>
              <option value="2000-3500">₱2,000 - ₱3,500</option>
              <option value="3500-5000">₱3,500 - ₱5,000</option>
              <option value="5000-8000">₱5,000 - ₱8,000</option>
              <option value="8000-999999">₱8,000+</option>
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
        Found {filteredCottages.length} cottage(s)
      </div>

      {/* Cottages Grid */}
      {filteredCottages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No cottages match your search criteria.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCottages.map((cottage) => (
            <div
              key={cottage._id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Cottage Image */}
              <div className="relative h-64 overflow-hidden">
                {cottage.images && cottage.images.length > 0 ? (
                  <img
                    src={cottage.images[0].url}
                    alt={`Cottage ${cottage.roomNumber}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center">
                    <span className="text-4xl">🏡</span>
                  </div>
                )}
                {cottage.status === "unavailable" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                      Currently Unavailable
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                  Cottage
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Cottage #{cottage.roomNumber}
                    </h3>
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">4.9</span>
                  </div> */}
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {cottage.description ||
                    `A charming cottage perfect for ${cottage.capacity || 6} guests. Features traditional Filipino architecture with modern comforts.`}
                </p>

                {/* Cottage Features */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>👥</span>
                    <span>Up to {cottage.capacity || 6} guests</span>
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <span>🛏️</span>
                    <span>{cottage.bedType || "2 Queen Beds"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🏠</span>
                    <span>Private Space</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🌳</span>
                    <span>Garden View</span>
                  </div> */}
                </div>

                {/* Amenities */}
                {/* <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Private Veranda
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Kitchenette
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Air Conditioning
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Hot & Cold Shower
                  </span>
                </div> */}

                {/* Price and Contact Info */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(cottage.rate)}
                    </span>
                    <span className="text-gray-500 text-sm"> / night</span>
                  </div>

                  {/* Contact Information */}
                  {/* <div className="text-center text-sm text-gray-500 border-t border-gray-100 pt-3">
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
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Special Cottage Features Section */}
      {filteredCottages.length > 0 && (
        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Why Choose Our Cottages?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🏝️</div>
              <h3 className="font-semibold mb-2">Privacy & Seclusion</h3>
              <p className="text-sm text-gray-600">
                Enjoy your own private space surrounded by nature
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🍳</div>
              <h3 className="font-semibold mb-2">Home-like Comfort</h3>
              <p className="text-sm text-gray-600">
                Kitchenette and living area for a home away from home
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌿</div>
              <h3 className="font-semibold mb-2">Natural Surroundings</h3>
              <p className="text-sm text-gray-600">
                Set in lush gardens with beautiful views
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
