// src/pages/guest/Gallery.jsx
import { useState, useEffect } from "react";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Simulate fetching gallery images
    // Replace with actual API call
    setTimeout(() => {
      const galleryImages = [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
          title: "Resort Overview",
          category: "resort",
          description: "Breathtaking view of our main resort area",
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
          title: "Deluxe Room",
          category: "rooms",
          description: "Spacious deluxe room with garden view",
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
          title: "Swimming Pool",
          category: "amenities",
          description: "Olympic-sized swimming pool",
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600",
          title: "Executive Suite",
          category: "rooms",
          description: "Luxury suite with mountain view",
        },
        {
          id: 5,
          url: "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=600",
          title: "Spa & Wellness",
          category: "amenities",
          description: "Relaxing spa treatment area",
        },
        {
          id: 6,
          url: "https://images.unsplash.com/photo-1582719500951-b83d6c1dcf0e?w=600",
          title: "Restaurant",
          category: "dining",
          description: "Fine dining restaurant",
        },
        {
          id: 7,
          url: "https://images.unsplash.com/photo-1584132915807-fd1f8f7815c5?w=600",
          title: "Event Hall",
          category: "facilities",
          description: "Spacious event hall for special occasions",
        },
        {
          id: 8,
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600",
          title: "Family Villa",
          category: "rooms",
          description: "Perfect for family gatherings",
        },
      ];
      setImages(galleryImages);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { id: "all", name: "All", icon: "🎨" },
    { id: "resort", name: "Resort", icon: "🌴" },
    { id: "rooms", name: "Rooms", icon: "🛏️" },
    { id: "amenities", name: "Amenities", icon: "🏊" },
    { id: "dining", name: "Dining", icon: "🍽️" },
    { id: "facilities", name: "Facilities", icon: "🏢" },
  ];

  const filteredImages =
    filter === "all" ? images : images.filter((img) => img.category === filter);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-xl h-64 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Photo Gallery</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore our beautiful resort through these stunning images.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`
              px-6 py-3 rounded-full font-medium transition-all duration-300
              flex items-center gap-2
              ${
                filter === cat.id
                  ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-amber-50 border border-gray-200"
              }
            `}
          >
            <span className="text-xl">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Masonry Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-semibold">{image.title}</h3>
                <p className="text-sm opacity-90">{image.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-amber-400 transition"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-lg">
              <h3 className="text-white text-xl font-semibold">
                {selectedImage.title}
              </h3>
              <p className="text-white/80">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
