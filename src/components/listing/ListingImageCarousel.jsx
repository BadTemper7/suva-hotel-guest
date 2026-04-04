import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * In-card image slider for guest Rooms / Cottages listings and detail pages.
 */
export default function ListingImageCarousel({
  images,
  title = "Photos",
  variant = "room",
  className = "",
}) {
  const list = Array.isArray(images)
    ? images.filter((i) => i && (typeof i === "string" ? i : i.url))
    : [];

  const urls = list.map((i) => (typeof i === "string" ? i : i.url));

  const [idx, setIdx] = useState(0);
  const touchStartX = useRef(null);

  const safeIdx = Math.min(Math.max(0, idx), Math.max(0, urls.length - 1));
  const canPrev = urls.length > 1 && safeIdx > 0;
  const canNext = urls.length > 1 && safeIdx < urls.length - 1;

  const goPrev = useCallback(() => {
    setIdx((v) => Math.max(0, v - 1));
  }, []);

  const goNext = useCallback(() => {
    setIdx((v) => Math.min(urls.length - 1, v + 1));
  }, [urls.length]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current == null || urls.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx > 48) goPrev();
    else if (dx < -48) goNext();
  };

  const isCottage = variant === "cottage";
  const dotActive = isCottage ? "bg-green-600 w-6" : "bg-blue-600 w-6";
  const dotIdle = "bg-white/60 hover:bg-white/90 w-2";
  const arrowBorder = isCottage
    ? "border-green-200/80 hover:bg-green-50"
    : "border-blue-200/80 hover:bg-blue-50";

  if (urls.length === 0) {
    return (
      <div
        className={`flex h-full min-h-[16rem] w-full items-center justify-center bg-gradient-to-br from-blue-200 to-green-200 ${className}`}
      >
        <span className="text-4xl select-none" aria-hidden>
          {isCottage ? "🏡" : "🛏️"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative h-full min-h-[16rem] w-full overflow-hidden bg-gray-100 ${className}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={safeIdx}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <img
            src={urls[safeIdx]}
            alt={`${title} — photo ${safeIdx + 1} of ${urls.length}`}
            className="h-full w-full object-cover"
            loading={safeIdx === 0 ? "eager" : "lazy"}
          />
        </motion.div>
      </AnimatePresence>

      {urls.length > 1 && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              disabled={!canPrev}
              className={`pointer-events-auto grid h-9 w-9 shrink-0 place-items-center rounded-full border bg-white/90 shadow-md backdrop-blur-sm transition-all ${arrowBorder} ${
                canPrev
                  ? "opacity-90 hover:opacity-100"
                  : "cursor-not-allowed opacity-35"
              }`}
              aria-label="Previous photo"
            >
              <FiChevronLeft className="text-gray-800" size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              disabled={!canNext}
              className={`pointer-events-auto grid h-9 w-9 shrink-0 place-items-center rounded-full border bg-white/90 shadow-md backdrop-blur-sm transition-all ${arrowBorder} ${
                canNext
                  ? "opacity-90 hover:opacity-100"
                  : "cursor-not-allowed opacity-35"
              }`}
              aria-label="Next photo"
            >
              <FiChevronRight className="text-gray-800" size={18} />
            </button>
          </div>

          <div
            className="absolute bottom-3 left-1/2 z-10 flex max-w-[calc(100%-2rem)] -translate-x-1/2 gap-1.5 overflow-x-auto px-1 py-0.5"
            role="tablist"
            aria-label="Photo thumbnails"
          >
            {urls.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === safeIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(i);
                }}
                className={`h-2 shrink-0 rounded-full transition-all duration-200 ${
                  i === safeIdx ? dotActive : dotIdle
                }`}
                title={`Photo ${i + 1}`}
              />
            ))}
          </div>

          <div className="absolute left-3 top-3 z-10 rounded-lg bg-black/55 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {safeIdx + 1} / {urls.length}
          </div>
        </>
      )}
    </div>
  );
}
