// src/pages/guest/TrackBooking.jsx
import { useState } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPrinter } from "react-icons/fi";
import { useReservationStore } from "../stores/reservationStore.js";
import InvoicePreviewModal from "../components/modals/InvoicePreviewModal.jsx";
import StayTimer from "../components/StayTimer.jsx";
import StayTypePill from "../components/StayTypePill.jsx";

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  checked_in: "Checked In",
  checked_out: "Checked Out",
  cancelled: "Cancelled",
  expired: "Expired",
  no_show: "No Show",
};

const money = (n) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(n || 0));

const formatDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function TrackBooking() {
  const trackBooking = useReservationStore((s) => s.trackBooking);
  const navState = useLocation().state || {};

  const [reservationNumber, setReservationNumber] = useState(
    navState.reservationNumber || "",
  );
  const [email, setEmail] = useState(navState.email || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [invoiceBilling, setInvoiceBilling] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reservationNumber.trim() || !email.trim()) {
      toast.error("Enter both your reservation number and email.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    try {
      const reservation = await trackBooking(
        reservationNumber.trim(),
        email.trim(),
      );
      setResult(reservation);
    } catch (err) {
      setError(
        err.message || "We couldn't find a booking matching those details.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Track Your Booking
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Enter your reservation number and the email you booked with to see
          your booking details — no account needed.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 grid gap-4 sm:grid-cols-2"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reservation Number *
          </label>
          <input
            type="text"
            value={reservationNumber}
            onChange={(e) => setReservationNumber(e.target.value)}
            placeholder="e.g. RES-2026-0001"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Looking up your booking..." : "Track Booking"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 text-center">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="text-sm text-gray-500">Reservation Number</div>
              <div className="text-xl font-bold text-gray-900">
                #{result.reservationNumber}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StayTypePill reservation={result} />
              <span className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700">
                {STATUS_LABELS[result.status] || result.status}
              </span>
            </div>
          </div>

          {result.status === "checked_in" && (
            <div className="max-w-sm">
              <StayTimer
                checkInAt={result.actualCheckInAt}
                checkOutAt={result.checkOut}
                active
              />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="text-xs text-gray-500">Check-in</div>
              <div className="font-semibold text-gray-900">
                {formatDate(result.checkIn)}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="text-xs text-gray-500">Check-out</div>
              <div className="font-semibold text-gray-900">
                {formatDate(result.checkOut)}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="text-xs text-gray-500">Guests</div>
              <div className="font-semibold text-gray-900">
                {result.adults} adult(s), {result.children || 0} child(ren)
              </div>
            </div>
            {result.cancelReason && (
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-xs text-gray-500">Cancel Reason</div>
                <div className="font-semibold text-gray-900">
                  {result.cancelReason}
                </div>
              </div>
            )}
          </div>

          {Array.isArray(result.rooms) && result.rooms.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Rooms / Cottages
              </h3>
              <div className="space-y-2">
                {result.rooms.map((rr) => (
                  <div
                    key={rr._id}
                    className="rounded-xl border border-gray-200 p-3 text-sm text-gray-700"
                  >
                    {rr.roomId?.category === "cottage" ? "Cottage" : "Room"}{" "}
                    {rr.roomId?.roomNumber || "—"}
                    {result.stayType === "hourly" && result.hourlyDuration && (
                      <span className="text-gray-500">
                        {" "}
                        — {result.hourlyDuration} hrs
                      </span>
                    )}
                    {Array.isArray(rr.addOns) && rr.addOns.length > 0 && (
                      <span className="text-gray-500">
                        {" "}
                        — {rr.addOns.length} add-on(s)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.billing && (
            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Billing</h3>
                <button
                  type="button"
                  onClick={() => setInvoiceBilling(result.billing)}
                  disabled={!result.billing._id}
                  className="px-3 py-1.5 text-sm font-medium text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPrinter size={14} />
                  View Invoice
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="font-semibold text-gray-900">
                    {money(result.billing.totalAmount)}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">Amount Paid</div>
                  <div className="font-semibold text-green-700">
                    {money(result.billing.amountPaid)}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">Balance</div>
                  <div className="font-semibold text-orange-600">
                    {money(result.billing.balance)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <InvoicePreviewModal
        open={!!invoiceBilling}
        billing={invoiceBilling}
        onClose={() => setInvoiceBilling(null)}
      />
    </div>
  );
}
