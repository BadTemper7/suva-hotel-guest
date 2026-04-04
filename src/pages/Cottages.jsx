// src/pages/guest/Cottages.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRoomStore } from "../stores/roomStore";
import { useGuestStore } from "../stores/guestStore";
import { useReservationStore } from "../stores/reservationStore";
import ListingImageCarousel from "../components/listing/ListingImageCarousel.jsx";

export default function GuestCottages() {
  const { rooms, loading, error, fetchRooms } = useRoomStore();
  const { isAuthenticated, checkAuth, initialize, initialized } =
    useGuestStore();
  const { fetchAvailableRooms } = useReservationStore();
  const [filteredCottages, setFilteredCottages] = useState([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [availableCottageIds, setAvailableCottageIds] = useState(new Set());
  const [checkingAvailability, setCheckingAvailability] = useState(true);

  // Get today's date for availability check
  const getTodayDate = () => {
    const today = new Date();
    today.setHours(14, 0, 0, 0); // Set to 2:00 PM check-in time
    return today.toISOString();
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0); // Set to 12:00 PM check-out time
    return tomorrow.toISOString();
  };

  useEffect(() => {
    document.title = "Suva's Place Resort - Cottages";
    // Fetch rooms - now works without authentication
    fetchRooms({ status: "active" });

    // Check availability for today
    const checkAvailability = async () => {
      setCheckingAvailability(true);
      try {
        const availableRooms = await fetchAvailableRooms({
          checkIn: getTodayDate(),
          checkOut: getTomorrowDate(),
        });

        // Create a Set of available cottage IDs for quick lookup
        const availableIds = new Set(
          availableRooms
            .filter((room) => room.category === "cottage")
            .map((room) => room._id),
        );
        setAvailableCottageIds(availableIds);
      } catch (error) {
        console.error("Error checking cottage availability:", error);
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkAvailability();
  }, [fetchRooms, fetchAvailableRooms]);

  // Filter cottages when rooms data changes or filters change
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      let filtered = rooms.filter((room) => room.category === "cottage");

      // Search by cottage number or description
      if (searchTerm) {
        filtered = filtered.filter(
          (cottage) =>
            cottage.roomNumber
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            cottage.description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()),
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

  // Show loading while checking auth or availability
  if (checkingAuth || !initialized || checkingAvailability) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading cottages and checking availability...
          </p>
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
              placeholder="Cottage number or description..."
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
          {filteredCottages.map((cottage) => {
            const isAvailable = availableCottageIds.has(cottage._id);
            const hasDescription =
              cottage.description && cottage.description.trim().length > 0;

            return (
              <div
                key={cottage._id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Cottage images — carousel + full-screen preview */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <ListingImageCarousel
                    images={cottage.images}
                    title={`Cottage ${cottage.roomNumber}`}
                    variant="cottage"
                    className="h-full"
                  />
                  <div className="pointer-events-none absolute top-4 right-4 z-20 bg-green-600 text-white px-3 py-1 rounded-full text-sm shadow-md">
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
                  </div>

                  {/* Description - Show full description */}
                  <div className="mb-4">
                    {hasDescription ? (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {cottage.description}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        No description available for this cottage.
                      </p>
                    )}
                  </div>

                  {/* Cottage Features */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <span>👥</span>
                      <span>Up to {cottage.capacity || 6} guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>💰</span>
                      <span>{formatPrice(cottage.rate)}/night</span>
                    </div>
                  </div>

                  {/* Price Display Only - No Book Now Button */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-green-600">
                          {formatPrice(cottage.rate)}
                        </span>
                        <span className="text-gray-500 text-sm"> / night</span>
                      </div>

                      {/* Availability Status Text */}
                      <div className="text-sm">
                        {isAvailable ? (
                          <span className="text-green-600 font-medium">
                            ✓ Available Today
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">
                            ✗ Not Available Today
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Login/Register Prompt */}
                    {!isAuthenticated && (
                      <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-500">
                          <Link
                            to="/login"
                            className="text-green-600 hover:underline"
                          >
                            Login
                          </Link>{" "}
                          or{" "}
                          <Link
                            to="/register"
                            className="text-green-600 hover:underline"
                          >
                            Register
                          </Link>{" "}
                          to make a reservation
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
