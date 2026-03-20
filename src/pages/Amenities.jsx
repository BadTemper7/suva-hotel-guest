// src/pages/guest/Amenities.jsx
import { useState, useEffect } from "react";
import { useAmenityStore } from "../stores/amenityStore";

export default function GuestAmenities() {
  const { amenities, loading, error, fetchAmenities } = useAmenityStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredAmenities, setFilteredAmenities] = useState([]);

  useEffect(() => {
    fetchAmenities();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredAmenities(amenities);
    } else {
      setFilteredAmenities(
        amenities.filter((a) => a.category === selectedCategory),
      );
    }
  }, [selectedCategory, amenities]);

  const categories = [
    { id: "all", name: "All Amenities", icon: "🎯" },
    { id: "pool", name: "Pools", icon: "🏊" },
    { id: "dining", name: "Dining", icon: "🍽️" },
    { id: "spa", name: "Spa & Wellness", icon: "💆" },
    { id: "recreation", name: "Recreation", icon: "🎮" },
    { id: "facilities", name: "Facilities", icon: "🏢" },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse"
            >
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
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
          <p className="text-red-600">Error loading amenities: {error}</p>
          <button
            onClick={fetchAmenities}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Amenities</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover world-class facilities and services designed to make your
          stay unforgettable.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`
              px-6 py-3 rounded-full font-medium transition-all duration-300
              flex items-center gap-2
              ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-700 hover:bg-amber-50 border border-gray-200"
              }
            `}
          >
            <span className="text-xl">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Amenities Grid */}
      {filteredAmenities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No amenities found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAmenities.map((amenity) => (
            <div
              key={amenity._id}
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                {amenity.image ? (
                  <img
                    src={amenity.image}
                    alt={amenity.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-200 to-rose-200 flex items-center justify-center">
                    <span className="text-5xl">{amenity.icon || "🎯"}</span>
                  </div>
                )}
                {amenity.isFeatured && (
                  <div className="absolute top-4 left-4 bg-amber-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                    Featured
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {amenity.name}
                  </h3>
                  <span className="text-2xl">{amenity.icon || "🎯"}</span>
                </div>
                <p className="text-gray-600 mb-4">{amenity.description}</p>

                {/* Amenity Details */}
                {amenity.details && (
                  <div className="space-y-2 mb-4">
                    {amenity.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-500"
                      >
                        <span className="text-green-500">✓</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Operating Hours */}
                {amenity.hours && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>🕒</span>
                      <span>{amenity.hours}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
