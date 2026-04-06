// src/stores/reservationStore.js
import { create } from "zustand";

const API =
  import.meta.env.VITE_SERVER_URI || import.meta.env.VITE_SERVER_LOCAL;

async function safeJson(res) {
  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text();
  if (!res.ok) {
    const msg =
      (isJson && data && (data.message || data.error)) ||
      (!isJson && typeof data === "string" && data.trim()) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const useReservationStore = create((set, get) => ({
  // State
  reservations: [],
  loading: false,
  currentReservation: null,
  error: null,
  reportLoading: false,
  reportError: null,
  guestReservations: [],
  guestReservationsLoading: false,

  // ==================== ADMIN RESERVATIONS ====================

  fetchReservations: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/reservations`);
      const data = await safeJson(res);
      const reservations = Array.isArray(data)
        ? data
        : data.reservations || data.data || [];
      set({ reservations, loading: false });
      return reservations;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  fetchReservation: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/reservations/${id}`);
      const data = await safeJson(res);
      const reservation = data.reservation || data.data || data;

      set({
        currentReservation: reservation,
        loading: false,
      });

      return reservation;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  getReservationById: async (id) => {
    return get().fetchReservation(id);
  },

  // ==================== GUEST RESERVATIONS ====================

  fetchGuestReservations: async (guestId, options = {}) => {
    const { type = "all", status, startDate, endDate, sortBy } = options;

    set({ guestReservationsLoading: true, error: null });

    try {
      let url;

      if (type === "upcoming") {
        url = `${API}/reservations/guest/${guestId}/upcoming`;
      } else if (type === "past") {
        url = `${API}/reservations/guest/${guestId}/past`;
      } else {
        url = `${API}/reservations/guest/${guestId}`;
      }

      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (sortBy) params.append("sortBy", sortBy);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await safeJson(res);

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch reservations");
      }

      set({
        guestReservations: data.reservations || [],
        guestReservationsLoading: false,
      });

      return data;
    } catch (err) {
      set({
        error: err.message,
        guestReservationsLoading: false,
      });
      throw err;
    }
  },

  fetchUpcomingReservations: async (guestId) => {
    return get().fetchGuestReservations(guestId, { type: "upcoming" });
  },

  fetchPastReservations: async (guestId) => {
    return get().fetchGuestReservations(guestId, { type: "past" });
  },

  fetchGuestReservationSummary: async (guestId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/reservations/guest/${guestId}`);
      const data = await safeJson(res);

      set({ loading: false });

      return {
        summary: data.summary,
        totalReservations: data.summary?.total || 0,
        upcoming: data.summary?.confirmed || 0,
        past: data.summary?.checkedOut || 0,
        cancelled: data.summary?.cancelled || 0,
        totalSpent: data.summary?.totalSpent || 0,
        totalPaid: data.summary?.totalPaid || 0,
        outstanding: data.summary?.totalOutstanding || 0,
      };
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // ==================== RESERVATION OPERATIONS ====================

  updateReservationStatus: async (id, status, cancelReason = "") => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/reservations/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          ...(cancelReason ? { cancelReason: String(cancelReason).trim() } : {}),
        }),
      });

      const data = await safeJson(res);
      const reservation = data.reservation || data.data || data;

      set((state) => ({
        reservations: state.reservations.map((r) =>
          r._id === id ? reservation : r,
        ),
        guestReservations: state.guestReservations.map((r) =>
          r.reservation?._id === id
            ? { ...r, reservation: { ...r.reservation, status } }
            : r,
        ),
        currentReservation:
          state.currentReservation?._id === id
            ? reservation
            : state.currentReservation,
        loading: false,
      }));

      return reservation;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  cancelReservation: async (id) => {
    return get().updateReservationStatus(id, "cancelled");
  },

  // ==================== CREATE RESERVATION ====================

  createReservation: async (payload) => {
    set({ loading: true, error: null });
    try {
      const user = JSON.parse(localStorage.getItem("suva_admin_user") || "{}");
      const userId = user._id || "69624f18a99b94c2c1be2f62";

      const res = await fetch(`${API}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, userId }),
      });

      const data = await safeJson(res);
      const reservation = data.reservation || data.data || data;

      set((state) => ({
        reservations: [reservation, ...state.reservations],
        loading: false,
      }));

      return reservation;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // Create full reservation with AddOns
  createFullReservation: async ({
    guest,
    reservationData,
    rooms = [],
    payment,
    discountImageFile = null,
    discountImageFiles = [],
    receiptData = null,
    guestId = null,
  }) => {
    set({ loading: true, error: null });
    try {
      // Fetch available rooms
      const availableRooms = await fetch(
        `${API}/reservations/rooms?checkIn=${reservationData.checkIn}&checkOut=${reservationData.checkOut}`,
      );
      const availableRoomsResponse = await safeJson(availableRooms);

      const availableRoomIds = new Set(
        availableRoomsResponse.availableRooms.map((room) => room._id),
      );

      const unavailableRooms = [];
      const availableRoomsDetails = [];

      rooms.forEach((room) => {
        const roomId = room.roomId;
        if (availableRoomIds.has(roomId)) {
          const roomDetails = availableRoomsResponse.availableRooms.find(
            (availableRoom) => availableRoom._id === roomId,
          );
          availableRoomsDetails.push({
            roomId,
            roomNumber: roomDetails?.roomNumber || "Unknown",
            roomType: roomDetails?.roomType?.name || "Unknown",
            rate: roomDetails?.rate || 0,
            capacity: roomDetails?.capacity || 0,
          });
        } else {
          unavailableRooms.push(roomId);
        }
      });

      if (unavailableRooms.length > 0) {
        const unavailableRoomNumbers = unavailableRooms.map((roomId) => {
          const room = availableRoomsResponse.availableRooms?.find(
            (r) => r._id === roomId,
          );
          return room ? `Room ${room.roomNumber}` : `Room ID: ${roomId}`;
        });
        throw new Error(
          `The following rooms are not available: ${unavailableRoomNumbers.join(", ")}`,
        );
      }

      // Step 1: Get guest ID
      let finalGuestId = guestId;

      if (!finalGuestId && guest.email && guest.email.trim()) {
        try {
          const resGuest = await fetch(
            `${API}/guests/find-or-create-by-email`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(guest),
            },
          );
          const guestResponse = await safeJson(resGuest);
          finalGuestId = guestResponse.guest?._id || guestResponse._id;
        } catch (guestErr) {
          console.warn("Could not find/create guest:", guestErr.message);
          finalGuestId = "6968b7aad9522d8eac7cafb3";
        }
      } else if (!finalGuestId) {
        finalGuestId = "6968b7aad9522d8eac7cafb3";
      }

      // Step 2: Create reservation
      const user = JSON.parse(localStorage.getItem("suva_admin_user") || "{}");
      const availabilityNotes = availableRoomsDetails
        .map((room) => `Room ${room.roomNumber} (${room.roomType}) - Available`)
        .join(", ");

      const reservationPayload = {
        checkIn: reservationData.checkIn,
        checkOut: reservationData.checkOut,
        adults: reservationData.adults,
        children: reservationData.children || 0,
        guestId: finalGuestId,
        status: "pending",
        notes: [
          reservationData.notes || "",
          `Availability confirmed: ${availabilityNotes}`,
        ]
          .filter(Boolean)
          .join(". "),
        paymentOption: reservationData.paymentOption,
        userId: user?._id,
        discountId: reservationData.discountId || null,
      };

      const resReservation = await fetch(`${API}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationPayload),
      });

      const reservationResponse = await safeJson(resReservation);
      const reservation =
        reservationResponse.reservation || reservationResponse;
      const reservationId = reservation._id || reservation.reservation?._id;

      if (!reservationId) {
        throw new Error("Failed to create reservation");
      }

      set((state) => ({
        reservations: [reservation, ...state.reservations],
        currentReservation: reservation,
      }));

      // Step 3: Add rooms with AddOns
      if (rooms.length > 0) {
        const roomsPayload = {
          reservationId: reservationId,
          rooms: rooms.map((room) => ({
            roomId: room.roomId,
            addOns: room.addOns || [], // Changed from amenities to addOns
          })),
        };

        await fetch(`${API}/reservation-rooms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roomsPayload),
        });
      }

      // Step 4: Generate billing
      const billingPayload = { reservationId: reservationId };
      const resBilling = await fetch(`${API}/billings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(billingPayload),
      });

      const billing = await safeJson(resBilling);
      const billingId = billing._id || billing.billing?._id;

      if (!billingId) {
        throw new Error("Failed to generate billing");
      }

      // Step 5: Upload discount image if exists
      const filesToUpload = Array.isArray(discountImageFiles)
        ? discountImageFiles.filter(Boolean)
        : [];
      if (reservationData.discountId) {
        if (filesToUpload.length > 0) {
          for (const file of filesToUpload) {
            const discountFormData = new FormData();
            discountFormData.append("image", file);
            discountFormData.append("discountId", reservationData.discountId);
            discountFormData.append("billingId", billingId);
            discountFormData.append("status", "confirmed");
            const resDiscount = await fetch(`${API}/discount-images`, {
              method: "POST",
              body: discountFormData,
            });
            await safeJson(resDiscount);
          }
        } else if (discountImageFile) {
          // Backward compatibility with previous single-file callers.
          const discountFormData = new FormData();
          discountFormData.append("image", discountImageFile);
          discountFormData.append("discountId", reservationData.discountId);
          discountFormData.append("billingId", billingId);
          discountFormData.append("status", "confirmed");
          const resDiscount = await fetch(`${API}/discount-images`, {
            method: "POST",
            body: discountFormData,
          });
          await safeJson(resDiscount);
        }
      }

      // Step 6: Create receipt if payment exists
      if (payment && payment.amountPaid > 0) {
        const receiptFormData = new FormData();
        receiptFormData.append("billingId", billingId);
        receiptFormData.append("paymentType", payment.paymentType);
        receiptFormData.append("amountPaid", payment.amountPaid.toString());
        receiptFormData.append(
          "amountReceived",
          payment.amountReceived.toString(),
        );
        receiptFormData.append("status", "pending");
        receiptFormData.append("notes", reservationData.notes || "");
        receiptFormData.append("isAdminInitiated", "false");

        if (receiptData?.referenceNumber) {
          receiptFormData.append(
            "referenceNumber",
            receiptData.referenceNumber,
          );
        }

        if (receiptData?.imageFile) {
          receiptFormData.append("receiptImage", receiptData.imageFile);
        }

        const receiptResponse = await fetch(`${API}/receipts/upload`, {
          method: "POST",
          body: receiptFormData,
        });

        await safeJson(receiptResponse);
      }

      // Get updated reservation
      const updatedReservation = await get().fetchReservation(reservationId);
      const resCalculateBilling = await fetch(
        `${API}/billings/calculate/${billingId}`,
        { method: "PUT" },
      );
      const calculateBilling = await safeJson(resCalculateBilling);

      set((state) => ({
        reservations: state.reservations.map((res) =>
          res._id === reservationId ? updatedReservation : res,
        ),
        currentReservation: updatedReservation,
        loading: false,
      }));

      return {
        ...updatedReservation,
        availabilityChecked: true,
        availableRooms: availableRoomsDetails,
        calculateBilling,
        message: `Successfully reserved ${availableRoomsDetails.length} room(s)`,
      };
    } catch (err) {
      console.error("Error in createFullReservation:", err);
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // ==================== AVAILABILITY ====================

  fetchAvailableRooms: async ({ checkIn, checkOut }) => {
    set({ loading: true, error: null });
    try {
      const url = new URL(`${API}/reservations/rooms`);
      url.searchParams.set("checkIn", checkIn);
      url.searchParams.set("checkOut", checkOut);

      const res = await fetch(url.toString());
      const data = await safeJson(res);

      const availableRooms =
        data.availableRooms || data.rooms || data.data || data;

      set({ loading: false });
      return Array.isArray(availableRooms) ? availableRooms : [];
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // ==================== DELETE OPERATIONS ====================

  deleteReservation: async (id) => {
    set({ loading: true, error: null });
    try {
      if (!id) throw new Error("Reservation ID is required");

      const res = await fetch(`${API}/reservations/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await safeJson(res);

      set((state) => ({
        reservations: state.reservations.filter((r) => r._id !== id),
        guestReservations: state.guestReservations.filter(
          (r) => r.reservation?._id !== id,
        ),
        currentReservation:
          state.currentReservation?._id === id
            ? null
            : state.currentReservation,
        loading: false,
      }));

      return {
        success: true,
        message: data.message || "Reservation deleted successfully",
        deletedReservation: data.deletedReservation || { id },
      };
    } catch (err) {
      set({
        loading: false,
        error: err?.message || "Failed to delete reservation",
      });
      throw err;
    }
  },

  deleteMultipleReservations: async (reservationIds = []) => {
    set({ loading: true, error: null });
    try {
      if (!Array.isArray(reservationIds) || reservationIds.length === 0) {
        throw new Error("reservationIds array is required");
      }

      const res = await fetch(`${API}/reservations/delete-many`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationIds }),
      });

      const data = await safeJson(res);

      set((state) => ({
        reservations: state.reservations.filter(
          (r) => !reservationIds.includes(r._id),
        ),
        guestReservations: state.guestReservations.filter(
          (r) => !reservationIds.includes(r.reservation?._id),
        ),
        currentReservation:
          state.currentReservation &&
          reservationIds.includes(state.currentReservation._id)
            ? null
            : state.currentReservation,
        loading: false,
      }));

      return data;
    } catch (err) {
      set({
        loading: false,
        error: err?.message || "Failed to delete multiple reservations",
      });
      throw err;
    }
  },

  // ==================== UPDATE OPERATIONS ====================

  updateReservationRooms: async ({
    reservationId,
    rooms = [],
    removeRoomIds = [],
  }) => {
    set({ loading: true, error: null });
    try {
      if (rooms.length > 0) {
        const roomsPayload = {
          reservationId,
          rooms: rooms.map((room) => ({
            roomId: room.roomId,
            addOns: room.addOns || [], // Changed from amenities to addOns
          })),
        };

        const resAdd = await fetch(`${API}/reservation-rooms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roomsPayload),
        });

        await safeJson(resAdd);
      }

      if (removeRoomIds.length > 0) {
        for (const roomId of removeRoomIds) {
          await fetch(`${API}/reservation-rooms/${roomId}`, {
            method: "DELETE",
          }).catch(() => {});
        }
      }

      const updatedReservation = await get().fetchReservation(reservationId);

      set((state) => ({
        reservations: state.reservations.map((r) =>
          r._id === reservationId ? updatedReservation : r,
        ),
        currentReservation: updatedReservation,
        loading: false,
      }));

      return updatedReservation;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // Update reservation add-ons (renamed from updateReservationAmenities)
  updateReservationAddOns: async ({
    reservationId,
    addOns = [],
    removeAddOnIds = [],
  }) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `${API}/reservations/${reservationId}/update-addons`, // Update endpoint if needed
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addOns, removeAddOnIds }),
        },
      );
      const data = await safeJson(res);
      const reservation = data.reservation || data.data || data;

      set((state) => ({
        reservations: state.reservations.map((r) =>
          r._id === reservationId ? reservation : r,
        ),
        currentReservation:
          state.currentReservation?._id === reservationId
            ? reservation
            : state.currentReservation,
        loading: false,
      }));

      return reservation;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  updateReservationDates: async ({ reservationId, checkIn, checkOut }) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `${API}/reservations/${reservationId}/update-dates`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkIn, checkOut }),
        },
      );
      const data = await safeJson(res);
      const reservation = data.reservation || data.data || data;

      set((state) => ({
        reservations: state.reservations.map((r) =>
          r._id === reservationId ? reservation : r,
        ),
        currentReservation:
          state.currentReservation?._id === reservationId
            ? reservation
            : state.currentReservation,
        loading: false,
      }));

      return reservation;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // ==================== UTILITY ====================

  refreshCurrentReservation: async () => {
    const state = get();
    const reservationId = state.currentReservation?._id;
    if (!reservationId) return null;
    return state.fetchReservation(reservationId);
  },

  clearCurrentReservation: () => {
    set({ currentReservation: null, error: null });
  },

  clearGuestReservations: () => {
    set({ guestReservations: [], guestReservationsLoading: false });
  },

  updateLocalReservation: (updatedReservation) => {
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r._id === updatedReservation._id ? updatedReservation : r,
      ),
      guestReservations: state.guestReservations.map((r) =>
        r.reservation?._id === updatedReservation._id
          ? { ...r, reservation: updatedReservation }
          : r,
      ),
      currentReservation:
        state.currentReservation?._id === updatedReservation._id
          ? updatedReservation
          : state.currentReservation,
    }));
  },

  clearError: () => set({ error: null }),
  clearReportError: () => set({ reportError: null }),
}));

// ------------------ Helpers ------------------
export const reservationHelpers = {
  formatRoomData: (rooms) =>
    rooms.map((room) => ({ roomId: room._id || room.roomId })),

  formatAddOnData: (
    addOns, // Renamed from formatAmenityData
  ) =>
    addOns.map((a) => ({
      addOnId: a._id || a.addOnId,
      quantity: a.quantity || 1,
    })),

  calculateTotals: (reservation) => {
    if (!reservation)
      return {
        nights: 0,
        roomsSubtotal: 0,
        addOnsSubtotal: 0,
        totalAmount: 0,
      };

    const checkIn = new Date(reservation.checkIn);
    const checkOut = new Date(reservation.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    const roomsSubtotal = (reservation.rooms || []).reduce((sum, room) => {
      const roomRate = room.rate || room.roomId?.rate || 0;
      return sum + roomRate * nights;
    }, 0);

    const addOnsSubtotal = (reservation.addOns || []).reduce(
      // Changed from amenities
      (sum, addOn) => {
        const rate = addOn.rate || addOn.addOnId?.rate || 0;
        const quantity = addOn.quantity || 1;
        return sum + rate * quantity;
      },
      0,
    );

    const totalAmount = roomsSubtotal + addOnsSubtotal;
    return { nights, roomsSubtotal, addOnsSubtotal, totalAmount };
  },

  canModifyReservation: (reservation) =>
    reservation && !["checked_out", "cancelled"].includes(reservation.status),

  canModifyDates: (reservation) =>
    reservation &&
    !["checked_in", "checked_out", "cancelled"].includes(reservation.status),

  getReservationRooms: (reservation) => {
    if (!reservation || !reservation.rooms) return [];

    return reservation.rooms.map((room) => ({
      roomId: room._id || room.roomId?._id || room.roomId,
      roomNumber: room.roomNumber || room.roomId?.roomNumber,
      roomTypeName: room.roomTypeName || room.roomId?.roomType?.name,
      rate: room.rate || room.roomId?.rate,
      capacity: room.capacity || room.roomId?.capacity,
      addOns: room.addOns || [], // Changed from amenities
    }));
  },

  formatReservation: (reservation) => {
    if (!reservation) return null;

    return {
      ...reservation,
      guestName: reservation.guestId
        ? `${reservation.guestId.firstName} ${reservation.guestId.lastName}`
        : "Unknown Guest",
      paymentOptionName: reservation.paymentOption?.name || "Unknown",
      discountName: reservation.discountId?.name || null,
      userName:
        reservation.userId?.username || reservation.userId?.name || "System",
    };
  },

  getReportFilters: (filters = {}) => {
    const defaultFilters = {
      startDate: filters.startDate || "",
      endDate: filters.endDate || "",
      status: filters.status || "",
      format: filters.format || "pdf",
    };
    return defaultFilters;
  },

  formatDateForReport: (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  },

  getStatusColor: (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "checked_in":
        return "bg-blue-100 text-blue-800";
      case "checked_out":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  },

  getReportSummary: (reservations) => {
    if (!reservations || !Array.isArray(reservations)) {
      return {
        total: 0,
        confirmed: 0,
        pending: 0,
        checkedIn: 0,
        checkedOut: 0,
        cancelled: 0,
        totalNights: 0,
        totalAdults: 0,
        totalChildren: 0,
      };
    }

    return {
      total: reservations.length,
      confirmed: reservations.filter((r) => r.status === "confirmed").length,
      pending: reservations.filter((r) => r.status === "pending").length,
      checkedIn: reservations.filter((r) => r.status === "checked_in").length,
      checkedOut: reservations.filter((r) => r.status === "checked_out").length,
      cancelled: reservations.filter((r) => r.status === "cancelled").length,
      totalNights: reservations.reduce((sum, r) => sum + (r.nights || 0), 0),
      totalAdults: reservations.reduce((sum, r) => sum + (r.adults || 0), 0),
      totalChildren: reservations.reduce(
        (sum, r) => sum + (r.children || 0),
        0,
      ),
    };
  },

  confirmDeleteReservation: async (reservation, store) => {
    if (!reservation) return false;

    const confirmMessage = `Are you sure you want to delete reservation ${reservation.reservationNumber}?\n\nThis action will also delete all related billing, receipts, and room assignments.\n\nThis action cannot be undone.`;

    if (window.confirm(confirmMessage)) {
      try {
        await store.deleteReservation(reservation._id);
        return true;
      } catch (error) {
        console.error("Failed to delete reservation:", error);
        alert(`Failed to delete reservation: ${error.message}`);
        return false;
      }
    }
    return false;
  },

  confirmDeleteMultipleReservations: async (selectedReservations, store) => {
    if (!selectedReservations || selectedReservations.length === 0) {
      return false;
    }

    const reservationList = selectedReservations
      .slice(0, 5)
      .map((r) => `• ${r.reservationNumber || r._id}`)
      .join("\n");

    const moreCount =
      selectedReservations.length > 5
        ? `\n...and ${selectedReservations.length - 5} more`
        : "";

    const confirmMessage = `Are you sure you want to delete ${selectedReservations.length} reservation(s)?\n\n${reservationList}${moreCount}\n\nThis action will also delete all related billing, receipts, and room assignments.\n\nThis action cannot be undone.`;

    if (window.confirm(confirmMessage)) {
      try {
        const reservationIds = selectedReservations.map((r) => r._id);
        await store.deleteMultipleReservations(reservationIds);
        return true;
      } catch (error) {
        console.error("Failed to delete reservations:", error);
        alert(`Failed to delete reservations: ${error.message}`);
        return false;
      }
    }
    return false;
  },
};
