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
import GuestDiscountIdModal from "../components/modals/GuestDiscountIdModal.jsx";
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
    refunded: "Refunded",
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
  const [discountIdModalProof, setDiscountIdModalProof] = useState(null);

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

    let reason = "";
    while (true) {
      const input = window.prompt(
        reason
          ? "Cancellation reason is required. Please enter a reason:"
          : "Please provide a reason for cancellation:",
        reason,
      );
      if (input === null) return; // user cancelled prompt

      reason = String(input).trim();
      if (reason) break;
    }

    try {
      await updateReservationStatus(reservationId, "cancelled", reason);
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

  const isTerminalStatus = (status) =>
    status === "cancelled" ||
    status === "checked_out" ||
    status === "expired" ||
    status === "no_show";

  // Helper to check if reservation is upcoming or past
  const isUpcoming = (booking) => {
    const checkOut = new Date(booking.reservation.checkOut);
    const now = new Date();
    // Show both future and currently active stays under Upcoming.
    return checkOut >= now && !isTerminalStatus(booking.reservation.status);
  };

  const isPast = (booking) => {
    const checkOut = new Date(booking.reservation.checkOut);
    const now = new Date();
    return (
      checkOut < now || isTerminalStatus(booking.reservation.status)
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
          {filteredReservations.map((booking) => {
            const seniorPwdDeclared =
              Number(booking.reservation?.seniorCitizenCount || 0) +
              Number(booking.reservation?.pwdCount || 0);
            const showPerGuestIdDiscountDetails =
              Boolean(booking.discount?.isPerId) || seniorPwdDeclared > 0;

            return (
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
                            {(Number(booking.billing.discountAmount || 0) > 0 ||
                              booking.discount?.isPerId ||
                              seniorPwdDeclared > 0) && (
                              <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-sm text-gray-500">
                                  Discount
                                  {booking.discount?.name
                                    ? ` (${booking.discount.name})`
                                    : ""}
                                </p>
                                {Number(booking.billing.discountAmount || 0) >
                                0 ? (
                                  <p className="text-2xl font-bold text-green-600">
                                    -
                                    {formatMoney(booking.billing.discountAmount)}
                                  </p>
                                ) : (
                                  <p className="text-sm text-amber-900/90 mt-1">
                                    Amount updates after staff verify your valid
                                    IDs.
                                  </p>
                                )}
                                {booking.discount?.discountPercent ? (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {booking.discount.discountPercent}% off
                                  </p>
                                ) : null}
                                {showPerGuestIdDiscountDetails ? (
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs font-medium text-gray-600 mb-2">
                                      PWD / Senior (per valid ID)
                                    </p>
                                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-700">
                                      <span>
                                        <span className="text-gray-500">
                                          Senior citizens:{" "}
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                          {Number(
                                            booking.reservation
                                              .seniorCitizenCount || 0,
                                          )}
                                        </span>
                                      </span>
                                      <span>
                                        <span className="text-gray-500">
                                          PWDs:{" "}
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                          {Number(
                                            booking.reservation.pwdCount || 0,
                                          )}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
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

                      {booking.discountProofs?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <FiImage /> Discount IDs
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            IDs you uploaded for your discount. Tap a photo to
                            enlarge. Status is set by front desk after review.
                          </p>
                          {Number(booking.discountProofSummary?.rejected || 0) >
                            0 && (
                            <p className="text-xs text-amber-900 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-4">
                              One or more IDs were not accepted—your discount on
                              the bill matches only approved proofs. Open an item
                              below to read the staff note.
                            </p>
                          )}
                          {booking.discountProofSummary &&
                            booking.discountProofSummary.total > 0 && (
                              <div className="flex flex-wrap gap-2 text-xs mb-4">
                                <span className="rounded-full bg-green-50 text-green-800 px-2.5 py-1 font-medium border border-green-100">
                                  Approved:{" "}
                                  {booking.discountProofSummary.confirmed ?? 0}
                                </span>
                                <span className="rounded-full bg-[#0c2bfc]/10 text-[#0c2bfc] px-2.5 py-1 font-medium border border-[#0c2bfc]/15">
                                  Pending:{" "}
                                  {booking.discountProofSummary.pending ?? 0}
                                </span>
                                <span className="rounded-full bg-red-50 text-red-800 px-2.5 py-1 font-medium border border-red-100">
                                  Not accepted:{" "}
                                  {booking.discountProofSummary.rejected ?? 0}
                                </span>
                              </div>
                            )}
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {booking.discountProofs.map((p, idx) => {
                              const st = p.status;
                              const short =
                                st === "confirmed"
                                  ? "Approved"
                                  : st === "rejected"
                                    ? "Not accepted"
                                    : "Pending";
                              const ring =
                                st === "confirmed"
                                  ? "ring-green-200"
                                  : st === "rejected"
                                    ? "ring-red-200"
                                    : "ring-[#0c2bfc]/20";
                              return (
                                <button
                                  key={`${booking.reservation._id}-proof-${idx}`}
                                  type="button"
                                  onClick={() => setDiscountIdModalProof(p)}
                                  className="group text-left rounded-xl border border-gray-200 bg-white p-2 shadow-sm hover:shadow-md hover:border-[#0c2bfc]/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#0c2bfc]/30"
                                >
                                  <div
                                    className={`relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 ring-2 ${ring}`}
                                  >
                                    {p.url ? (
                                      <img
                                        src={p.url}
                                        alt=""
                                        className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
                                      />
                                    ) : (
                                      <div className="w-full h-full grid place-items-center text-xs text-gray-400 px-2 text-center">
                                        No preview
                                      </div>
                                    )}
                                    <span className="absolute bottom-1.5 left-1.5 right-1.5 rounded-md bg-black/65 text-[10px] font-semibold text-white px-1.5 py-0.5 text-center">
                                      Tap to view
                                    </span>
                                  </div>
                                  <p className="mt-2 text-xs font-semibold text-gray-900 truncate">
                                    {p.label}
                                    {p.discountName
                                      ? ` · ${p.discountName}`
                                      : ""}
                                  </p>
                                  <p
                                    className={`text-[11px] font-medium mt-0.5 ${
                                      st === "confirmed"
                                        ? "text-green-700"
                                        : st === "rejected"
                                          ? "text-red-700"
                                          : "text-[#0c2bfc]"
                                    }`}
                                  >
                                    {short}
                                  </p>
                                </button>
                              );
                            })}
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
            );
          })}
        </div>
      )}

      <GuestDiscountIdModal
        open={!!discountIdModalProof}
        proof={discountIdModalProof}
        onClose={() => setDiscountIdModalProof(null)}
      />
    </div>
  );
}
