import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";

function formatPrice(price) {
  if (price == null || Number.isNaN(Number(price))) return null;
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
  }).format(Number(price));
}

export default function RoomQuickViewModal({ open, item, onClose }) {
  const title = useMemo(() => {
    if (!item) return "";
    const isRoom = item.category === "room";
    if (isRoom) return `${item.roomType?.name || "Room"} ${item.roomNumber || ""}`.trim();
    return `Cottage #${item.roomNumber || ""}`.trim();
  }, [item]);

  const coverImage = useMemo(() => {
    const img = item?.images?.[0];
    if (!img) return null;
    return typeof img === "string" ? img : img.url;
  }, [item]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-lg"
            onClick={onClose}
            aria-label="Close modal overlay"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { duration: 0.2 } },
              exit: { opacity: 0, transition: { duration: 0.15 } },
            }}
          />

          <div className="absolute inset-0 flex items-end sm:items-center justify-center p-3 sm:p-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={title || "Details"}
              className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden"
              variants={{
                hidden: { opacity: 0, y: 28, scale: 0.98 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 520,
                    damping: 35,
                    mass: 0.9,
                  },
                },
                exit: {
                  opacity: 0,
                  y: 18,
                  scale: 0.985,
                  transition: { duration: 0.16 },
                },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="min-w-0">
                  <div className="text-lg font-bold text-gray-900 truncate">
                    {title || "Details"}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {item?.category === "room" ? "Luxury Room" : "Cozy Cottage"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                >
                  <FiX /> Close
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="md:col-span-2">
                    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                      <div className="aspect-[4/3] w-full">
                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt={title || "Preview"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full grid place-items-center text-4xl">
                            {item?.category === "room" ? "🛏️" : "🏡"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <div className="flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900">
                          Highlights
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {item?.category === "room"
                            ? "Modern amenities and beautiful views."
                            : "Private cottage retreat with a relaxing vibe."}
                        </div>
                      </div>
                      {item?.rate != null && (
                        <div className="shrink-0 text-right">
                          <div
                            className={`text-2xl font-bold ${
                              item?.category === "room"
                                ? "text-blue-600"
                                : "text-green-600"
                            }`}
                          >
                            {formatPrice(item.rate)}
                          </div>
                          <div className="text-xs text-gray-500">/ night</div>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {item?.capacity != null && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-full">
                          👥 Up to {item.capacity}
                        </span>
                      )}
                      {item?.category === "room" && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-full">
                          🛏️ {item?.bedType || "Queen"}
                        </span>
                      )}
                      {item?.category === "cottage" && (
                        <>
                          <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1.5 rounded-full">
                            Private Veranda
                          </span>
                          <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1.5 rounded-full">
                            Kitchenette
                          </span>
                          <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1.5 rounded-full">
                            Garden View
                          </span>
                        </>
                      )}
                      {item?.roomType?.name && item?.category === "room" && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-full">
                          {item.roomType.name}
                        </span>
                      )}
                    </div>

                    <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <div className="text-xs font-semibold text-gray-900">
                        Quick note
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        This is a quick preview from the Home page. For full
                        details and availability, browse the full list.
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-800 transition-all duration-200"
                      >
                        Close
                      </button>
                      <a
                        href={item?.category === "room" ? "/rooms" : "/cottages"}
                        className={`px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 text-center ${
                          item?.category === "room"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        Browse all {item?.category === "room" ? "rooms" : "cottages"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

