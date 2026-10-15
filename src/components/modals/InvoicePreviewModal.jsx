import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiDownload, FiFileText } from "react-icons/fi";
import toast from "react-hot-toast";
import Loader from "../ui/Loader.jsx";

const API =
  import.meta.env.VITE_SERVER_URI || import.meta.env.VITE_SERVER_LOCAL;

async function fetchInvoicePdf(billingId, { download = false } = {}) {
  if (!billingId) {
    throw new Error("Billing ID is required");
  }
  const qs = download ? "?download=1" : "";
  const res = await fetch(`${API}/billings/id/${billingId}/invoice${qs}`);
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || `Failed to load invoice (${res.status})`);
  }
  const blob = await res.blob();
  const header = res.headers.get("content-disposition") || "";
  const match = header.match(/filename="?([^"]+)"?/i);
  const filename = match?.[1] || `invoice-${billingId}.pdf`;
  return { blob, filename };
}

async function downloadInvoice(billingId) {
  const { blob, filename } = await fetchInvoicePdf(billingId, {
    download: true,
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return { success: true, filename };
}

export default function InvoicePreviewModal({ open, billing, onClose }) {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !billing?._id) return undefined;
    let revoked = false;
    let objectUrl = "";

    const load = async () => {
      setLoading(true);
      setError("");
      setPdfUrl("");
      try {
        const { blob } = await fetchInvoicePdf(billing._id);
        if (revoked) return;
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (err) {
        if (!revoked) setError(err.message || "Failed to load invoice");
      } finally {
        if (!revoked) setLoading(false);
      }
    };

    load();

    return () => {
      revoked = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [open, billing?._id]);

  if (!open || !billing) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadInvoice(billing._id);
      toast.success("Invoice downloaded");
    } catch (err) {
      toast.error(err.message || "Failed to download invoice");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] grid place-items-center bg-black/50 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-4xl max-h-[92vh] rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-[#0c2bfc] text-white grid place-items-center shrink-0">
                <FiFileText />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold text-gray-900">
                  Invoice {billing.billingNumber || ""}
                </div>
                <div className="text-sm text-gray-600">
                  Stay charges and amount due for this booking
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 grid place-items-center text-gray-700"
              aria-label="Close"
            >
              <FiX />
            </button>
          </div>

          <div className="flex-1 min-h-0 bg-gray-100">
            {loading ? (
              <div className="h-[60vh] grid place-items-center">
                <Loader size={48} variant="primary" />
              </div>
            ) : error ? (
              <div className="h-[40vh] grid place-items-center px-6 text-center">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : (
              <iframe
                title="Invoice preview"
                src={pdfUrl}
                className="w-full h-[60vh] bg-white"
              />
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-gray-500">
              Preview your invoice, then download a copy for your records.
            </p>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading || loading || Boolean(error)}
              className="h-10 px-4 rounded-xl bg-[#0c2bfc] hover:bg-[#0a24d6] text-white text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <FiDownload />
              {downloading ? "Downloading…" : "Download PDF"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
