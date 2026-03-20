// src/pages/guest/Wishlist.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGuestStore } from "../stores/guestStore";
import { useRoomStore } from "../stores/roomStore";

export default function Wishlist() {
  const { isAuthenticated } = useGuestStore();
  const { rooms, fetchRooms } = useRoomStore();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    loadWishlist();
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      // Load rooms first
      if (rooms.length === 0) {
        await fetchRooms({ status: "active" });
      }

      // Get wishlist from localStorage
      const savedWishlist = JSON.parse(
        localStorage.getItem("guest_wishlist") || "[]",
      );

      // Filter rooms that are in wishlist
      const wishlistRooms = rooms.filter((room) =>
        savedWishlist.includes(room._id),
      );
      setWishlist(wishlistRooms);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (roomId) => {
    const savedWishlist = JSON.parse(
      localStorage.getItem("guest_wishlist") || "[]",
    );
    const updatedWishlist = savedWishlist.filter((id) => id !== roomId);
    localStorage.setItem("guest_wishlist", JSON.stringify(updatedWishlist));
    setWishlist(wishlist.filter((room) => room._id !== roomId));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Please log in to view your wishlist.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-gray-600 mt-2">Your favorite rooms and suites</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">
            Start adding rooms you love to your wishlist!
          </p>
          <Link
            to="/rooms"
            className="inline-block px-6 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition"
          >
            Browse Rooms
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                {room.images && room.images[0] ? (
                  <img
                    src={room.images[0].url}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-200 to-rose-200 flex items-center justify-center">
                    <span className="text-4xl">🛏️</span>
                  </div>
                )}
                <button
                  onClick={() => removeFromWishlist(room._id)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-red-50 transition"
                >
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {room.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-amber-600">
                      {formatPrice(room.price)}
                    </span>
                    <span className="text-gray-500 text-sm"> / night</span>
                  </div>
                  <Link
                    to={`/booking/${room._id}`}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
