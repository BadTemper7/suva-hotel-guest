import { FiX, FiExternalLink } from "react-icons/fi";

const statusCopy = {
  confirmed: { label: "Approved", className: "bg-green-50 text-green-800 border-green-100" },
  rejected: { label: "Not accepted", className: "bg-red-50 text-red-800 border-red-100" },
  pending: { label: "Pending review", className: "bg-[#0c2bfc]/10 text-[#0c2bfc] border-[#0c2bfc]/20" },
};

export default function GuestDiscountIdModal({ open, proof, onClose }) {
  if (!open || !proof) return null;

  const st = proof.status || "pending";
  const meta = statusCopy[st] || statusCopy.pending;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="discount-id-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 id="discount-id-modal-title" className="text-lg font-bold text-gray-900">
              {proof.label}
              {proof.discountName ? ` · ${proof.discountName}` : ""}
            </h2>
            <p className="text-xs text-gray-500 mt-1">Your uploaded discount ID</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {proof.url ? (
              <a
                href={proof.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 grid place-items-center text-gray-700"
                title="Open full image"
              >
                <FiExternalLink size={18} />
              </a>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 grid place-items-center text-gray-700"
              aria-label="Close"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-4">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold border ${meta.className}`}
          >
            {meta.label}
          </span>

          {proof.url ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
              <img
                src={proof.url}
                alt={proof.label || "Discount ID"}
                className="w-full max-h-[60vh] object-contain bg-gray-100"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500">Image preview is not available.</p>
          )}

          {st === "rejected" && proof.rejectionReason ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <span className="font-semibold">Staff note: </span>
              {proof.rejectionReason}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
