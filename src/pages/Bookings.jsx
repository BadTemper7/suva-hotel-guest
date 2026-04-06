// src/pages/guest/Bookings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiUser,
  FiHome,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiDownload,
  FiRefreshCw,
  FiChevronRight,
  FiChevronDown,
  FiFileText,
  FiImage,
  FiExternalLink,
  FiPlus,
} from "react-icons/fi";
import { useReservationStore } from "../stores/reservationStore";
import { useGuestStore } from "../stores/guestStore";
import Loader from "../components/ui/Loader";
import toast from "react-hot-toast";
const PesoIcon = ({ className = "w-5 h-5", ...props }) => (
  <span
    className={`inline-flex items-center justify-center font-bold ${className}`}
    style={{ fontFamily: "system-ui" }}
    {...props}
  >
    ₱
  </span>
);
// Money formatter
const formatMoney = (n) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(n || 0);

// Status Badge Component
function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    checked_in: "bg-blue-100 text-blue-800 border-blue-200",
    checked_out: "bg-purple-100 text-purple-800 border-purple-200",
    expired: "bg-gray-100 text-gray-800 border-gray-200",
    no_show: "bg-orange-100 text-orange-800 border-orange-200",
  };

  const icons = {
    pending: <FiClock className="mr-1.5" size={12} />,
    confirmed: <FiCheckCircle className="mr-1.5" size={12} />,
    cancelled: <FiXCircle className="mr-1.5" size={12} />,
    checked_in: <FiUser className="mr-1.5" size={12} />,
    checked_out: <FiCheckCircle className="mr-1.5" size={12} />,
    expired: <FiClock className="mr-1.5" size={12} />,
    no_show: <FiXCircle className="mr-1.5" size={12} />,
  };

  const labels = {
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    checked_in: "Checked In",
    checked_out: "Checked Out",
    expired: "Expired",
    no_show: "No Show",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border ${styles[status] || styles.pending}`}
    >
      {icons[status]}
      {labels[status] || status}
    </span>
  );
}

// Payment Status Badge
function PaymentStatusBadge({ paymentStatus }) {
  const styles = {
    paid: "bg-green-100 text-green-800 border-green-200",
    partial: "bg-yellow-100 text-yellow-800 border-yellow-200",
    unpaid: "bg-red-100 text-red-800 border-red-200",
    free: "bg-purple-100 text-purple-800 border-purple-200",
  };

  const labels = {
    paid: "Paid",
    partial: "Partial",
    unpaid: "Unpaid",
    free: "Free",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border ${styles[paymentStatus] || styles.unpaid}`}
    >
      <PesoIcon className="mr-1.5" size={12} />
      {labels[paymentStatus] || paymentStatus}
    </span>
  );
}

// Room Card Component with Amenities
function RoomCard({ room }) {
  const [expanded, setExpanded] = useState(false);

  if (!room) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">
            {room.roomType?.name || "Room"} #{room.roomNumber}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            Capacity: {room.capacity} guests • Rate: {formatMoney(room.rate)}
            /night
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {formatMoney(room.total)}
          </p>
          <p className="text-xs text-gray-500">{room.nights} nights</p>
        </div>
      </div>

      {/* Amenities Section */}
      {room.amenities && room.amenities.length > 0 && (
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            {expanded ? (
              <FiChevronDown size={16} />
            ) : (
              <FiChevronRight size={16} />
            )}
            Amenities ({room.amenities.length})
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-3"
              >
                <div className="space-y-2">
                  {room.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {amenity.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Quantity: {amenity.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatMoney(amenity.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Room Total */}
      <div className="p-4 bg-gray-50 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Room Total</span>
        <span className="text-lg font-bold text-blue-600">
          {formatMoney(room.total)}
        </span>
      </div>
    </div>
  );
}

// Receipt Card Component
function ReceiptCard({ receipt }) {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  if (!receipt) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {receipt.paymentType?.name || "Payment"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {new Date(receipt.createdAt).toLocaleDateString("en-PH", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <StatusBadge status={receipt.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-500">Amount Paid</p>
          <p className="text-sm font-semibold text-green-600">
            {formatMoney(receipt.amountPaid)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Amount Received</p>
          <p className="text-sm font-semibold text-blue-600">
            {formatMoney(receipt.amountReceived ?? receipt.amountPaid)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Change</p>
          <p className="text-sm font-medium text-gray-700">
            {formatMoney(receipt.change || 0)}
          </p>
        </div>
      </div>

      {receipt.referenceNumber && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">Reference Number</p>
          <p className="text-xs font-mono text-gray-700 bg-gray-50 p-2 rounded-lg mt-1">
            {receipt.referenceNumber}
          </p>
        </div>
      )}

      {receipt.receiptImages && receipt.receiptImages.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setImageModalOpen(true)}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FiImage size={12} />
            View Receipt Image ({receipt.receiptImages.length})
          </button>
        </div>
      )}

      {/* Image Modal */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              ✕
            </button>
            <img
              src={receipt.receiptImages[0].url}
              alt="Receipt"
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <a
                href={receipt.receiptImages[0].url}
                download
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition"
              >
                <FiDownload size={20} />
              </a>
              <a
                href={receipt.receiptImages[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition"
              >
                <FiExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Bookings Component
export default function Bookings() {
  const navigate = useNavigate();
  const loc = useLocation();
  const { currentGuest, isAuthenticated, initialize } = useGuestStore();
  const {
    guestReservations,
    guestReservationsLoading,
    fetchGuestReservations,
    updateReservationStatus,
    error,
    clearError,
  } = useReservationStore();

  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [expandedReservation, setExpandedReservation] = useState(null);
  const [allReservations, setAllReservations] = useState([]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isAuthenticated || !currentGuest) {
      navigate("/login", {
        state: { from: `${loc.pathname}${loc.search}` },
      });
      return;
    }

    loadAllReservations();
  }, [isAuthenticated, currentGuest, navigate, loc.pathname, loc.search]);

  const loadAllReservations = async () => {
    if (!currentGuest?._id) return;

    try {
      await fetchGuestReservations(currentGuest._id, { type: "all" });
    } catch (err) {
      console.error("Error loading reservations:", err);
      toast.error(err.message || "Failed to load reservations");
    }
  };

  // Update allReservations when guestReservations changes
  useEffect(() => {
    if (guestReservations && Array.isArray(guestReservations)) {
      setAllReservations(guestReservations);
    }
  }, [guestReservations]);

  const handleCancelReservation = async (reservationId) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;

    const reason = window.prompt("Please provide a reason for cancellation:");
    if (reason === null) return; // user cancelled prompt
    if (!String(reason).trim()) {
      toast.error("Cancellation reason is required.");
      return;
    }

    try {
      await updateReservationStatus(reservationId, "cancelled", reason.trim());
      toast.success("Reservation cancelled successfully");
      await loadAllReservations();
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      toast.error(err.message || "Failed to cancel reservation");
    }
  };

  const handleDownloadConfirmation = async (
    reservationId,
    reservationNumber,
  ) => {
    const API =
      import.meta.env.VITE_SERVER_URI || import.meta.env.VITE_SERVER_LOCAL;

    try {
      const response = await fetch(
        `${API}/reservations/${reservationId}/confirmation`,
      );

      if (!response.ok) {
        throw new Error("Failed to generate confirmation");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `confirmation-${reservationNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Confirmation downloaded");
    } catch (err) {
      console.error("Error downloading confirmation:", err);
      toast.error("Failed to download confirmation");
    }
  };

  // Helper to check if reservation is upcoming or past
  const isUpcoming = (booking) => {
    const checkIn = new Date(booking.reservation.checkIn);
    const now = new Date();
    return (
      checkIn > now &&
      booking.reservation.status !== "cancelled" &&
      booking.reservation.status !== "checked_out" &&
      booking.reservation.status !== "expired" &&
      booking.reservation.status !== "no_show"
    );
  };

  const isPast = (booking) => {
    const checkOut = new Date(booking.reservation.checkOut);
    const now = new Date();
    return (
      checkOut < now ||
      booking.reservation.status === "cancelled" ||
      booking.reservation.status === "checked_out" ||
      booking.reservation.status === "expired" ||
      booking.reservation.status === "no_show"
    );
  };

  // Filter reservations based on selected tab
  const getFilteredReservations = () => {
    if (selectedTab === "upcoming") {
      return allReservations.filter((booking) => isUpcoming(booking));
    } else if (selectedTab === "past") {
      return allReservations.filter((booking) => isPast(booking));
    }
    return allReservations;
  };

  const filteredReservations = getFilteredReservations();

  // Get counts for tabs
  const upcomingCount = allReservations.filter((b) => isUpcoming(b)).length;
  const pastCount = allReservations.filter((b) => isPast(b)).length;
  const allCount = allReservations.length;

  if (guestReservationsLoading && allReservations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader
          size={60}
          variant="primary"
          showText
          text="Loading your bookings..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <FiXCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Bookings
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              clearError();
              loadAllReservations();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    navigate("/booking-process");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">
          View and manage your reservations at Suva's Place Resort
        </p>
        <p className="text-sm text-gray-600 mt-3">
          <Link
            to="/booking-policy-summary"
            className="text-blue-600 font-medium underline underline-offset-2 hover:text-blue-800"
          >
            Policies at a glance
          </Link>{" "}
          — resort and room rules summarized for your stay.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setSelectedTab("upcoming")}
          className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
            selectedTab === "upcoming"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Upcoming ({upcomingCount})
        </button>
        <button
          onClick={() => setSelectedTab("past")}
          className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
            selectedTab === "past"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Past ({pastCount})
        </button>
        <button
          onClick={() => setSelectedTab("all")}
          className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
            selectedTab === "all"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All ({allCount})
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          onClick={handleBookNow}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          <FiPlus size={16} /> Add Booking
        </button>
        <button
          onClick={loadAllReservations}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <FiRefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiCalendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-500 mb-6">
            {selectedTab === "upcoming"
              ? "You don't have any upcoming reservations."
              : selectedTab === "past"
                ? "You don't have any past reservations."
                : "You haven't made any reservations yet."}
          </p>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FiHome size={18} /> Browse Rooms & Cottages
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReservations.map((booking) => (
            <motion.div
              key={booking.reservation._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Reservation Header */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        {booking.reservation.reservationNumber}
                      </h2>
                      <StatusBadge status={booking.reservation.status} />
                      <PaymentStatusBadge
                        paymentStatus={booking.paymentSummary?.paymentStatus}
                      />
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        {new Date(
                          booking.reservation.checkIn,
                        ).toLocaleDateString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(
                          booking.reservation.checkOut,
                        ).toLocaleDateString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiUser size={14} />
                        {booking.reservation.adults} Adults,{" "}
                        {booking.reservation.children} Children
                      </span>
                      <span className="flex items-center gap-1">
                        <FiHome size={14} />
                        {booking.rooms?.length || 0}{" "}
                        {booking.rooms?.length === 1 ? "Room" : "Rooms"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {booking.canCancel && (
                      <button
                        onClick={() =>
                          handleCancelReservation(booking.reservation._id)
                        }
                        className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setExpandedReservation(
                          expandedReservation === booking.reservation._id
                            ? null
                            : booking.reservation._id,
                        )
                      }
                      className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <FiEye className="inline mr-2" size={14} />
                      {expandedReservation === booking.reservation._id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedReservation === booking.reservation._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 space-y-6">
                      {/* Rooms Section */}
                      {booking.rooms && booking.rooms.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FiHome /> Accommodations
                          </h3>
                          <div className="space-y-3">
                            {booking.rooms.map((room, idx) => (
                              <RoomCard key={idx} room={room} />
                            ))}
                          </div>
                          <div className="mt-4 p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                            <span className="font-semibold text-gray-900">
                              Total Room Charges
                            </span>
                            <span className="text-xl font-bold text-blue-600">
                              {formatMoney(booking.roomTotals?.total || 0)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Billing Section */}
                      {booking.billing && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <PesoIcon /> Payment Summary
                          </h3>
                          <div className="mb-4 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                            Non-VAT: All billing amounts are VAT-exempt.
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-sm text-gray-500">
                                Total Amount
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {formatMoney(booking.billing.totalAmount)}
                              </p>
                            </div>
                            {Number(booking.billing.discountAmount || 0) > 0 && (
                              <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-sm text-gray-500">
                                  Discount
                                  {booking.discount?.name
                                    ? ` (${booking.discount.name})`
                                    : ""}
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                  -{formatMoney(booking.billing.discountAmount)}
                                </p>
                                {booking.discount?.discountPercent ? (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {booking.discount.discountPercent}% off
                                  </p>
                                ) : null}
                              </div>
                            )}
                            <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-sm text-gray-500">
                                Amount Paid
                              </p>
                              <p className="text-2xl font-bold text-green-600">
                                {formatMoney(booking.billing.amountPaid)}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-sm text-gray-500">
                                Remaining Balance
                              </p>
                              <p className="text-2xl font-bold text-orange-600">
                                {formatMoney(booking.billing.balance)}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-sm text-gray-500">
                                Payment Option
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                {booking.paymentOption?.name || "N/A"}
                              </p>
                              {booking.paymentOption?.paymentType ===
                                "partial" && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {booking.paymentOption.amount}% down payment
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Receipts Section */}
                      {booking.receipts && booking.receipts.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FiFileText /> Payment Receipts
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {booking.receipts.map((receipt, idx) => (
                              <ReceiptCard key={idx} receipt={receipt} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {booking.reservation.notes && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Special Notes
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.reservation.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
