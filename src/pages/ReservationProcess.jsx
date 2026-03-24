import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiTrash2,
  FiUploadCloud,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiCalendar,
  FiHome,
  FiCreditCard,
  FiFilter,
  FiSun,
} from "react-icons/fi";
import { Helmet } from "react-helmet";

import Loader from "../components/ui/Loader.jsx";
import { useReservationStore } from "../stores/reservationStore.js";
import { useAddOnStore } from "../stores/addOnStore.js";
import { usePaymentStore } from "../stores/paymentStore.js";
import { useGuestStore } from "../stores/guestStore.js";
import NumberInput from "../components/ui/NumberInput.jsx";
import Stepper from "../components/ui/NumberInput.jsx";

// Utility functions
const formatMoney = (n) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(
    Number(n || 0),
  );

const toISODateTime = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timezoneOffset);
  return localDate.toISOString().slice(0, 16);
};

const setTimeTo = (date, hours, minutes = 0) => {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

const getDefaultCheckIn = () => {
  const now = new Date();
  const checkIn = setTimeTo(now, 14, 0);
  if (checkIn < now) {
    checkIn.setDate(checkIn.getDate() + 1);
  }
  return toISODateTime(checkIn);
};

const getDefaultCheckOut = (checkInDate) => {
  if (!checkInDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return toISODateTime(setTimeTo(tomorrow, 12, 0));
  }
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 1);
  return toISODateTime(setTimeTo(checkOut, 12, 0));
};

const nightsBetween = (checkIn, checkOut) => {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  const diff = b - a;
  const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return Math.max(1, nights);
};

const validatePhone = (v) => /^09\d{9}$/.test(String(v || ""));
const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");
const validateName = (v) => {
  if (!v || !v.trim()) return false;
  return /^[A-Za-z\s]+$/.test(v.trim());
};

const calculateMaxRooms = (adults) => {
  return Math.max(1, Math.ceil(adults / 2));
};

function FieldError({ text, className = "" }) {
  if (!text) return null;
  return <div className={`mb-1 text-xs text-red-600 ${className}`}>{text}</div>;
}

function Section({ title, subtitle, right, children, icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="mt-1 p-2 rounded-lg bg-gray-50 border border-gray-200">
              {React.cloneElement(icon, { className: "text-[#0c2bfc]" })}
            </div>
          )}
          <div>
            <div className="text-sm font-semibold text-gray-900">{title}</div>
            {subtitle && (
              <div className="text-xs text-gray-600 mt-1">{subtitle}</div>
            )}
          </div>
        </div>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Pill({ active, done, onClick, stepCount, stepLabel }) {
  const IconComponent =
    {
      1: FiCalendar,
      2: FiHome,
      3: FiCreditCard,
    }[stepCount] || FiCheckCircle;

  const baseCls =
    "flex items-center flex-col md:flex-row gap-3 transition-all w-full px-4 py-3 rounded-xl";
  const textCls = done
    ? "text-[#00af00] font-bold"
    : active
      ? "text-[#0c2bfc] font-bold"
      : "text-gray-400 font-semibold";

  const circleCls = done
    ? "bg-[#00af00] text-white"
    : active
      ? "border-2 border-[#0c2bfc] bg-white text-[#0c2bfc]"
      : "border-2 border-gray-200 bg-white text-gray-400";

  return (
    <button
      className={`${baseCls} ${
        !active && !done
          ? "cursor-not-allowed"
          : "cursor-pointer hover:shadow-md hover:-translate-y-0.5"
      }`}
      type="button"
      onClick={done || active ? onClick : null}
    >
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full shadow-sm transition-all ${circleCls}`}
      >
        {done ? (
          <FiCheckCircle className="w-5 h-5" />
        ) : (
          <IconComponent className="w-5 h-5" />
        )}
      </div>
      <div className="flex flex-col justify-center items-center md:items-start">
        <span className="text-xs text-gray-500">Step {stepCount}</span>
        <span className={`text-sm font-medium ${textCls}`}>{stepLabel}</span>
      </div>
    </button>
  );
}

function SummaryCard({ title, children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-5 ${className}`}
    >
      <div className="text-sm font-semibold text-gray-900 mb-3">{title}</div>
      {children}
    </div>
  );
}

export default function GuestReservation() {
  const navigate = useNavigate();
  const { currentGuest, isAuthenticated, initialize } = useGuestStore();
  const [step, setStep] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Step 1 data
  const [reservationFormData, setReservationFormData] = useState({
    checkIn: getDefaultCheckIn(),
    checkOut: getDefaultCheckOut(),
    adults: 1,
    children: 0,
    notes: "",
  });

  // Step 2 data
  const [roomReservations, setRoomReservations] = useState([]);

  // Step 3 data (Payment)
  const [payment, setPayment] = useState({
    paymentOption: "",
    paymentType: "",
    discountId: "",
    amountPaid: 0,
    amountReceived: 0,
    status: "pending",
  });

  // Receipt data
  const [selectedReceiptImage, setSelectedReceiptImage] = useState(null);
  const [receiptImagePreview, setReceiptImagePreview] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [selectedDiscountImage, setSelectedDiscountImage] = useState(null);
  const [discountImagePreview, setDiscountImagePreview] = useState("");

  const discountFileInputRef = useRef(null);
  const receiptFileInputRef = useRef(null);

  // Store hooks
  const { fetchAvailableRooms, createFullReservation, loading } =
    useReservationStore();
  const {
    paymentOptions,
    paymentTypes,
    discounts,
    fetchPaymentOptions,
    fetchPaymentTypes,
    fetchDiscounts,
  } = usePaymentStore();
  const addOns = useAddOnStore((s) => s.addOns);
  const fetchAddOns = useAddOnStore((s) => s.fetchAddOns);

  const [availableRooms, setAvailableRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [errors, setErrors] = useState({});
  const [maxRooms, setMaxRooms] = useState(1);

  // Initialize and check authentication
  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isAuthenticated || !currentGuest) {
      toast.error("Please login to make a reservation");
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        await Promise.all([
          fetchAddOns?.(),
          fetchPaymentOptions(),
          fetchPaymentTypes(),
          fetchDiscounts(),
        ]);
      } catch (error) {
        console.error("Failed to load initial data:", error);
        toast.error("Failed to load required data");
      }
    };
    loadData();
  }, [
    fetchAddOns,
    fetchPaymentOptions,
    fetchPaymentTypes,
    fetchDiscounts,
    isAuthenticated,
    currentGuest,
    navigate,
  ]);

  // Update check-out when check-in changes
  useEffect(() => {
    if (reservationFormData.checkIn) {
      const checkIn = new Date(reservationFormData.checkIn);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 1);
      setReservationFormData((prev) => ({
        ...prev,
        checkOut: toISODateTime(setTimeTo(checkOut, 12, 0)),
      }));
    }
  }, [reservationFormData.checkIn]);

  const filteredAvailableItems = useMemo(() => {
    if (categoryFilter === "all") return availableRooms;
    return availableRooms.filter((item) => item.category === categoryFilter);
  }, [availableRooms, categoryFilter]);

  const roomCount = availableRooms.filter(
    (item) => item.category === "room",
  ).length;
  const cottageCount = availableRooms.filter(
    (item) => item.category === "cottage",
  ).length;

  const nights = useMemo(() => {
    if (!reservationFormData.checkIn || !reservationFormData.checkOut) return 0;
    return nightsBetween(
      reservationFormData.checkIn,
      reservationFormData.checkOut,
    );
  }, [reservationFormData.checkIn, reservationFormData.checkOut]);

  const roomTotals = useMemo(() => {
    return roomReservations.map((roomRes) => {
      const room = availableRooms.find((r) => r._id === roomRes.roomId);
      const roomRate = room?.rate || 0;
      const roomSubtotal = roomRate * nights;
      const isCottage = room?.category === "cottage";

      // Only calculate add-ons for rooms (not cottages)
      let addOnsSubtotal = 0;
      if (!isCottage) {
        addOnsSubtotal = roomRes.addOns.reduce((sum, addOn) => {
          const addOnData = addOns.find((a) => a._id === addOn.addOnId);
          return sum + (addOnData?.rate || 0) * addOn.quantity;
        }, 0);
      }

      return {
        roomId: roomRes.roomId,
        total: roomSubtotal + addOnsSubtotal,
        roomSubtotal,
        addOnsSubtotal,
        roomRate,
        category: room?.category,
        isCottage,
      };
    });
  }, [roomReservations, availableRooms, nights, addOns]);

  const totalAmount = useMemo(() => {
    return roomTotals.reduce((sum, room) => sum + room.total, 0);
  }, [roomTotals]);

  const discount = useMemo(() => {
    if (!payment.discountId) return { amount: 0, percent: 0, name: "" };
    const discountData = discounts.find((d) => d._id === payment.discountId);
    if (!discountData) return { amount: 0, percent: 0, name: "" };
    if (discountData.appliesToAllRooms) {
      return {
        amount: (totalAmount * discountData.discountPercent) / 100,
        percent: discountData.discountPercent,
        name: discountData.name,
      };
    } else {
      if (roomTotals.length === 0) return { amount: 0, percent: 0, name: "" };
      let targetRoom;
      if (discountData.discountPriority === "highest") {
        targetRoom = roomTotals.reduce((max, room) =>
          room.total > max.total ? room : max,
        );
      } else {
        targetRoom = roomTotals.reduce((min, room) =>
          room.total < min.total ? room : min,
        );
      }
      return {
        amount: (targetRoom.total * discountData.discountPercent) / 100,
        percent: discountData.discountPercent,
        name: discountData.name,
        roomId: targetRoom.roomId,
      };
    }
  }, [payment.discountId, discounts, totalAmount, roomTotals]);

  const finalTotal = useMemo(
    () => totalAmount - discount.amount,
    [totalAmount, discount.amount],
  );

  const amountDue = useMemo(() => {
    if (!payment.paymentOption) return finalTotal;
    const paymentOption = paymentOptions.find(
      (po) => po._id === payment.paymentOption,
    );
    if (!paymentOption) return finalTotal;
    if (paymentOption.paymentType === "full") return finalTotal;
    if (paymentOption.paymentType === "partial")
      return (finalTotal * paymentOption.amount) / 100;
    return finalTotal;
  }, [payment.paymentOption, paymentOptions, finalTotal]);

  const totalCapacity = useMemo(() => {
    return roomReservations.reduce((sum, roomRes) => {
      const room = availableRooms.find((r) => r._id === roomRes.roomId);
      return sum + (room?.capacity || 0);
    }, 0);
  }, [roomReservations, availableRooms]);

  const checkOutMin = useMemo(() => {
    if (!reservationFormData.checkIn)
      return toISODateTime(setTimeTo(new Date(), 12, 0));
    const min = new Date(reservationFormData.checkIn);
    min.setDate(min.getDate() + 1);
    return toISODateTime(setTimeTo(min, 12, 0));
  }, [reservationFormData.checkIn]);

  const selectedPaymentType = paymentTypes.find(
    (pt) => pt._id === payment.paymentType,
  );
  const requiresReceipt = selectedPaymentType?.isReceipt;

  const progressPct = useMemo(() => Math.round((step / 3) * 100), [step]);

  // Validation
  const setFieldError = (key, message) =>
    setErrors((prev) => ({ ...prev, [key]: message }));

  const validateStep1 = () => {
    const errors = {};
    if (!reservationFormData.checkIn) errors.checkIn = "Check-in is required.";
    if (!reservationFormData.checkOut)
      errors.checkOut = "Check-out is required.";
    if (
      reservationFormData.checkIn &&
      reservationFormData.checkOut &&
      nights <= 0
    ) {
      errors.checkOut = "Check-out must be after check-in.";
    }
    if (reservationFormData.adults < 1)
      errors.adults = "Adults must be at least 1.";
    if (reservationFormData.children < 0)
      errors.children = "Children cannot be negative.";
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const errors = {};
    if (roomReservations.length === 0)
      errors.rooms = "Select at least one room or cottage.";
    if (roomReservations.length > maxRooms) {
      errors.rooms = `You can only select maximum ${maxRooms} item(s) for ${reservationFormData.adults} adult(s).`;
    }
    if (reservationFormData.adults > totalCapacity) {
      errors.capacity = `Capacity (${totalCapacity}) is not enough for adults (${reservationFormData.adults}).`;
    }
    const hasRooms = roomReservations.some((item) => item.category === "room");
    const hasCottages = roomReservations.some(
      (item) => item.category === "cottage",
    );
    if (hasRooms && hasCottages) {
      errors.category =
        "You cannot mix rooms and cottages in the same reservation.";
    }
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const errors = {};
    if (!payment.paymentOption)
      errors.paymentOption = "Please select a payment option.";
    if (!payment.paymentType)
      errors.paymentType = "Please select a payment type.";
    if (payment.amountPaid < 0)
      errors.amountPaid = "Amount paid cannot be negative.";
    if (payment.amountReceived < 0)
      errors.amountReceived = "Amount received cannot be negative.";
    if (payment.amountPaid > payment.amountReceived) {
      errors.amountReceived = "Amount received must be at least amount paid.";
    }

    if (requiresReceipt && !referenceNumber && !selectedReceiptImage) {
      errors.receipt = "Either reference number OR receipt image is required.";
    }

    if (payment.discountId && !selectedDiscountImage) {
      errors.discountImage =
        "Discount image is required when applying discount.";
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return false;
    }

    return true;
  };

  const handleStep1Next = async () => {
    if (!validateStep1()) return;
    const newMaxRooms = calculateMaxRooms(reservationFormData.adults);
    if (roomReservations.length > newMaxRooms) {
      toast.error(
        `Selected items exceed limit of ${newMaxRooms} for ${reservationFormData.adults} adult(s).`,
      );
      setMaxRooms(newMaxRooms);
      setStep(2);
      return;
    }
    setMaxRooms(newMaxRooms);
    setLoadingRooms(true);
    try {
      const data = await fetchAvailableRooms({
        checkIn: reservationFormData.checkIn,
        checkOut: reservationFormData.checkOut,
      });
      setAvailableRooms(data || []);
      setStep(2);
    } catch (err) {
      toast.error(err?.message || "Failed to load available rooms.");
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleStep2Next = () => {
    if (!validateStep2()) return;
    setStep(3);
  };

  const goBack = () => setStep((prev) => Math.max(1, prev - 1));

  const addRoom = (item) => {
    if (roomReservations.length > 0) {
      const existingCategory = roomReservations[0].category;
      if (existingCategory !== item.category) {
        toast.error(
          `Cannot mix rooms and cottages. You have ${existingCategory === "room" ? "rooms" : "cottages"} selected.`,
        );
        return;
      }
    }
    if (roomReservations.length >= maxRooms) {
      toast.error(
        `Maximum ${maxRooms} item(s) allowed for ${reservationFormData.adults} adult(s).`,
      );
      return;
    }
    setRoomReservations((prev) => [
      ...prev,
      {
        roomId: item._id,
        roomNumber: item.roomNumber,
        rate: item.rate,
        capacity: item.capacity,
        roomTypeName: item.roomType?.name ?? "",
        category: item.category,
        addOns: [],
      },
    ]);
  };

  const removeRoom = (roomId) => {
    setRoomReservations((prev) => prev.filter((r) => r.roomId !== roomId));
  };

  const addAddOnToRoom = (roomIndex) => {
    const selectedItem = roomReservations[roomIndex];
    const item = availableRooms.find((r) => r._id === selectedItem.roomId);

    if (item?.category === "cottage") {
      toast.error(
        "Add-ons are not available for cottages. They can only be added to rooms.",
      );
      return;
    }

    if (!addOns?.length) {
      toast.error("No add-ons available.");
      return;
    }

    setRoomReservations((prev) => {
      const updated = [...prev];
      updated[roomIndex].addOns.push({
        addOnId: addOns[0]._id,
        quantity: 1,
      });
      return updated;
    });
  };

  const updateAddOnInRoom = (roomIndex, addOnIndex, updates) => {
    setRoomReservations((prev) => {
      const updated = [...prev];
      updated[roomIndex].addOns[addOnIndex] = {
        ...updated[roomIndex].addOns[addOnIndex],
        ...updates,
      };
      return updated;
    });
  };

  const removeAddOnFromRoom = (roomIndex, addOnIndex) => {
    setRoomReservations((prev) => {
      const updated = [...prev];
      updated[roomIndex].addOns.splice(addOnIndex, 1);
      return updated;
    });
  };

  const handleDiscountImageUpload = (file) => {
    if (discountImagePreview) URL.revokeObjectURL(discountImagePreview);
    setSelectedDiscountImage(file);
    setDiscountImagePreview(URL.createObjectURL(file));
  };

  const handleReceiptImageUpload = (file) => {
    if (receiptImagePreview) URL.revokeObjectURL(receiptImagePreview);
    setSelectedReceiptImage(file);
    setReceiptImagePreview(URL.createObjectURL(file));
  };

  const removeDiscountImage = () => {
    if (discountImagePreview) URL.revokeObjectURL(discountImagePreview);
    setSelectedDiscountImage(null);
    setDiscountImagePreview("");
  };

  const removeReceiptImage = () => {
    if (receiptImagePreview) URL.revokeObjectURL(receiptImagePreview);
    setSelectedReceiptImage(null);
    setReceiptImagePreview("");
  };

  const resetAll = () => {
    setStep(1);
    setReservationFormData({
      checkIn: getDefaultCheckIn(),
      checkOut: getDefaultCheckOut(),
      adults: 1,
      children: 0,
      notes: "",
    });
    setRoomReservations([]);
    setPayment({
      paymentOption: "",
      paymentType: "",
      discountId: "",
      amountPaid: 0,
      amountReceived: 0,
    });
    removeDiscountImage();
    removeReceiptImage();
    setReferenceNumber("");
    setAvailableRooms([]);
    setErrors({});
    setMaxRooms(1);
  };

  const RefundPolicyModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Important Policy</h3>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="text-2xl">⚠️</div>
              <p className="text-gray-700 font-medium">
                Please read and understand our refund and cancellation policy
                before confirming your reservation.
              </p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Reschedule:</span> Must be
                  made 7 days before the date of reservation
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">No Show:</span> Initial
                  Deposit is no longer refundable
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Initial Deposit:</span>{" "}
                  Non-refundable unless accidents and acts of God occur
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Full Payment:</span> Once
                  settled, payments are non-refundable
                </p>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-800 text-center">
                By proceeding with this reservation, you acknowledge and agree
                to the terms and conditions stated above.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200"
              >
                I Agree & Confirm
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const submitReservation = async () => {
    if (!validateStep3()) return;
    setShowConfirmModal(false);

    try {
      const payload = {
        guest: {
          firstName: currentGuest.firstName,
          lastName: currentGuest.lastName,
          contactNumber: currentGuest.contactNumber,
          email: currentGuest.email,
        },
        reservationData: {
          checkIn: reservationFormData.checkIn,
          checkOut: reservationFormData.checkOut,
          adults: reservationFormData.adults,
          children: reservationFormData.children,
          notes: reservationFormData.notes || "",
          paymentOption: payment.paymentOption,
          discountId: payment.discountId || null,
        },
        rooms: roomReservations.map((roomRes) => ({
          roomId: roomRes.roomId,
          addOns: roomRes.addOns.map((addOn) => ({
            addOnId: addOn.addOnId,
            quantity: addOn.quantity,
          })),
        })),
        payment: {
          paymentType: payment.paymentType,
          amountPaid: payment.amountPaid,
          amountReceived: payment.amountReceived,
          status: payment.status || "pending",
        },
        discountImageFile: selectedDiscountImage,
        receiptData: {
          imageFile: selectedReceiptImage,
          referenceNumber: referenceNumber || null,
          isAdminInitiated: false,
        },
        guestId: currentGuest._id,
      };

      await createFullReservation(payload);
      toast.success("Reservation created successfully!");
      navigate(`/bookings`);
    } catch (err) {
      console.error("Reservation creation error:", err);
      toast.error(
        err.message || "Failed to create reservation. Please try again.",
      );
    }
  };

  const handleShowConfirmModal = () => {
    if (validateStep3()) {
      setShowConfirmModal(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>Make a Reservation - Suva's Place</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Toaster position="top-center" reverseOrder={false} />

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Make a Reservation
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Step {step} of 3 •{" "}
                {
                  {
                    1: "Dates & Guests",
                    2: "Room/Cottage Selection",
                    3: "Payment",
                  }[step]
                }
              </p>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="h-10 px-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium inline-flex items-center gap-2 transition-all duration-200"
            >
              <FiRefreshCw size={14} /> Reset
            </button>
          </div>

          {/* Progress bar and steps */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>Progress</span>
              <span className="font-medium text-gray-900">{progressPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-[#0c2bfc] rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Pill
                active={step === 1}
                done={step > 1}
                onClick={() => setStep(1)}
                stepCount={1}
                stepLabel="Dates & Guests"
              />
              <Pill
                active={step === 2}
                done={step > 2}
                onClick={() => step >= 2 && setStep(2)}
                stepCount={2}
                stepLabel="Room/Cottage"
              />
              <Pill
                active={step === 3}
                done={false}
                onClick={() => step >= 3 && setStep(3)}
                stepCount={3}
                stepLabel="Payment"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1 */}
            {step === 1 && (
              <Section
                title="Step 1: Dates and Guests"
                subtitle="Select your stay dates and number of guests."
                icon={<FiCalendar />}
                right={
                  nights > 0 && (
                    <div className="text-sm text-gray-600">
                      Nights:{" "}
                      <span className="font-semibold text-gray-900">
                        {nights}
                      </span>
                    </div>
                  )
                }
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Check In Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      min={toISODateTime(new Date())}
                      value={reservationFormData.checkIn}
                      onChange={(e) =>
                        setReservationFormData({
                          ...reservationFormData,
                          checkIn: e.target.value,
                        })
                      }
                      className={`mt-1 w-full h-11 rounded-lg border px-4 text-sm outline-none focus:ring-2 focus:ring-[#0c2bfc]/20 focus:border-[#0c2bfc] transition-all duration-200 bg-white ${errors.checkIn ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      Check-in time: 2:00 PM
                    </div>
                    <FieldError text={errors.checkIn} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Check Out Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      min={checkOutMin}
                      value={reservationFormData.checkOut}
                      onChange={(e) =>
                        setReservationFormData({
                          ...reservationFormData,
                          checkOut: e.target.value,
                        })
                      }
                      className={`mt-1 w-full h-11 rounded-lg border px-4 text-sm outline-none focus:ring-2 focus:ring-[#0c2bfc]/20 focus:border-[#0c2bfc] transition-all duration-200 bg-white ${errors.checkOut ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      Check-out time: 12:00 PM
                    </div>
                    <FieldError text={errors.checkOut} />
                  </div>
                  <div>
                    <NumberInput
                      label="Adults *"
                      value={reservationFormData.adults}
                      onChange={(newValue) =>
                        setReservationFormData({
                          ...reservationFormData,
                          adults: newValue,
                        })
                      }
                      min={1}
                      max={99}
                      step={1}
                      error={errors.adults}
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      Maximum items allowed:{" "}
                      {calculateMaxRooms(reservationFormData.adults)}
                    </div>
                  </div>
                  <div>
                    <NumberInput
                      label="Children"
                      value={reservationFormData.children}
                      onChange={(newValue) =>
                        setReservationFormData({
                          ...reservationFormData,
                          children: newValue,
                        })
                      }
                      min={0}
                      max={20}
                      step={1}
                      description="Ages 2-12 years"
                      error={errors.children}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={reservationFormData.notes}
                    onChange={(e) =>
                      setReservationFormData({
                        ...reservationFormData,
                        notes: e.target.value,
                      })
                    }
                    className="mt-1 w-full min-h-[80px] rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0c2bfc]/20 focus:border-[#0c2bfc] transition-all duration-200"
                    placeholder="Any special requests or notes..."
                  />
                </div>
              </Section>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <Section
                title="Step 2: Select Rooms & Cottages"
                subtitle="Choose your accommodation and add add-ons."
                icon={<FiHome />}
                right={
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    <span>
                      Adults:{" "}
                      <b className="text-gray-900">
                        {reservationFormData.adults}
                      </b>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>
                      Selected:{" "}
                      <b className="text-gray-900">{roomReservations.length}</b>
                      /<b>{maxRooms}</b>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>
                      Capacity: <b className="text-gray-900">{totalCapacity}</b>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>
                      Nights: <b className="text-gray-900">{nights}</b>
                    </span>
                  </div>
                }
              >
                <div className="mb-4">
                  {errors.category && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                      {errors.category}
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <FiFilter className="text-gray-400" />
                      <span className="text-sm text-gray-600 font-medium">
                        Show:
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCategoryFilter("all")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${categoryFilter === "all" ? "bg-[#0c2bfc] text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                      >
                        All ({availableRooms.length})
                      </button>
                      <button
                        onClick={() => setCategoryFilter("room")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${categoryFilter === "room" ? "bg-[#0c2bfc] text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                      >
                        <FiHome className="inline mr-1" size={12} /> Rooms (
                        {roomCount})
                      </button>
                      <button
                        onClick={() => setCategoryFilter("cottage")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${categoryFilter === "cottage" ? "bg-[#0c2bfc] text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                      >
                        <FiSun className="inline mr-1" size={12} /> Cottages (
                        {cottageCount})
                      </button>
                    </div>
                  </div>
                </div>

                {loadingRooms ? (
                  <div className="py-12 flex items-center justify-center">
                    <Loader size={40} variant="primary" />
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Available{" "}
                          {categoryFilter === "cottage"
                            ? "Cottages"
                            : categoryFilter === "room"
                              ? "Rooms"
                              : "Items"}
                        </h3>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium text-gray-900">
                            {roomReservations.length}
                          </span>
                          <span className="text-gray-400"> / </span>
                          <span className="font-medium text-gray-600">
                            {maxRooms}
                          </span>
                          <span className="text-gray-400 ml-1">selected</span>
                        </div>
                      </div>
                      <FieldError text={errors.rooms} />
                      <FieldError text={errors.capacity} />
                      <div className="grid gap-3 md:grid-cols-2">
                        {filteredAvailableItems.map((item) => {
                          const isSelected = roomReservations.some(
                            (r) => r.roomId === item._id,
                          );
                          const isCottage = item.category === "cottage";
                          return (
                            <div
                              key={item._id}
                              className={`rounded-lg border p-4 transition-all duration-200 bg-white ${isSelected ? "border-[#0c2bfc] ring-2 ring-[#0c2bfc]/20" : "border-gray-200 hover:border-gray-300 hover:shadow-md"}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm font-semibold text-gray-900">
                                      {isCottage ? "Cottage" : "Room"}{" "}
                                      {item.roomNumber}
                                    </div>
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${isCottage ? "bg-[#00af00]/10 text-[#00af00]" : "bg-[#0c2bfc]/10 text-[#0c2bfc]"}`}
                                    >
                                      {isCottage ? "Cottage" : "Room"}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-600 mt-0.5">
                                    {isCottage
                                      ? item.description || "—"
                                      : (item.roomType?.name ?? "—")}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    isSelected
                                      ? removeRoom(item._id)
                                      : addRoom(item)
                                  }
                                  disabled={
                                    !isSelected &&
                                    roomReservations.length >= maxRooms
                                  }
                                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${isSelected ? "bg-[#0c2bfc] text-white hover:bg-[#0a24d6]" : roomReservations.length >= maxRooms ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200" : "bg-[#0c2bfc] text-white hover:bg-[#0a24d6]"}`}
                                >
                                  {isSelected ? "Remove" : "Select"}
                                </button>
                              </div>
                              <div className="text-xs text-gray-600 mt-2">
                                Capacity: {item.capacity} • Rate:{" "}
                                {formatMoney(item.rate)} / night
                              </div>
                            </div>
                          );
                        })}
                        {filteredAvailableItems.length === 0 && (
                          <div className="rounded-lg border border-gray-200 bg-white px-4 py-10 text-center text-gray-500 md:col-span-2">
                            <FiHome className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            No available{" "}
                            {categoryFilter === "cottage"
                              ? "cottages"
                              : categoryFilter === "room"
                                ? "rooms"
                                : "items"}{" "}
                            for selected dates.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selected Items with Add-Ons */}
                    {roomReservations.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Selected Items
                        </h3>
                        {roomReservations.map((roomRes, roomIndex) => {
                          const item = availableRooms.find(
                            (r) => r._id === roomRes.roomId,
                          );
                          const isCottage = item?.category === "cottage";
                          const isRoom = item?.category === "room";

                          return (
                            <div
                              key={roomRes.roomId}
                              className="rounded-xl border border-gray-200 bg-white p-4"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm font-semibold text-gray-900">
                                      {isCottage ? "Cottage" : "Room"}{" "}
                                      {roomRes.roomNumber}
                                    </div>
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        isCottage
                                          ? "bg-[#00af00]/10 text-[#00af00]"
                                          : "bg-[#0c2bfc]/10 text-[#0c2bfc]"
                                      }`}
                                    >
                                      {isCottage ? "Cottage" : "Room"}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    Rate: {formatMoney(roomRes.rate)}/night
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeRoom(roomRes.roomId)}
                                  className="h-9 w-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 grid place-items-center text-[#0c2bfc] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                                  title="Remove item"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>

                              {/* Add-Ons Section - ONLY show for rooms, NOT for cottages */}
                              {!isCottage && isRoom && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-gray-700">
                                      Add-Ons
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => addAddOnToRoom(roomIndex)}
                                      className="h-8 px-3 rounded-xl bg-[#0c2bfc] hover:bg-[#0a24d6] text-white text-xs font-medium inline-flex items-center gap-1 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                                    >
                                      <FiPlus size={12} /> Add Add-On
                                    </button>
                                  </div>

                                  {roomRes.addOns.map((addOn, addOnIndex) => {
                                    const addOnData = addOns.find(
                                      (a) => a._id === addOn.addOnId,
                                    );

                                    return (
                                      <div
                                        key={`${addOn.addOnId}-${addOnIndex}`}
                                        className="grid gap-3 sm:grid-cols-12 items-center rounded-xl border border-gray-200 bg-white p-3"
                                      >
                                        <div className="sm:col-span-7">
                                          <label className="text-xs text-gray-500">
                                            Add-On
                                          </label>
                                          <select
                                            value={addOn.addOnId}
                                            onChange={(e) =>
                                              updateAddOnInRoom(
                                                roomIndex,
                                                addOnIndex,
                                                {
                                                  addOnId: e.target.value,
                                                },
                                              )
                                            }
                                            className="mt-1 w-full h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#0c2bfc]/20 focus:border-[#0c2bfc] text-gray-700"
                                          >
                                            {addOns.map((a) => (
                                              <option key={a._id} value={a._id}>
                                                {a.name} ({formatMoney(a.rate)})
                                                {a.category &&
                                                  ` - ${a.category}`}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        <div className="sm:col-span-3">
                                          <label className="text-xs text-gray-500">
                                            Quantity
                                          </label>
                                          <div className="mt-1">
                                            <Stepper
                                              value={addOn.quantity}
                                              onChange={(newQuantity) =>
                                                updateAddOnInRoom(
                                                  roomIndex,
                                                  addOnIndex,
                                                  {
                                                    quantity: newQuantity,
                                                  },
                                                )
                                              }
                                              min={1}
                                              max={99}
                                              step={1}
                                              size="small"
                                            />
                                          </div>
                                        </div>

                                        <div className="sm:col-span-2 flex justify-end">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              removeAddOnFromRoom(
                                                roomIndex,
                                                addOnIndex,
                                              )
                                            }
                                            className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 grid place-items-center text-[#0c2bfc] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                                            title="Remove add-on"
                                          >
                                            <FiTrash2 />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}

                                  {roomRes.addOns.length === 0 && (
                                    <div className="text-xs text-gray-500 italic text-center py-3 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                                      No add-ons added to this room.
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* For cottages, show a message that add-ons are not available */}
                              {isCottage && (
                                <div className="mt-2 text-xs text-gray-500 italic text-center py-3 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                                  <span className="text-[#00af00] font-medium">
                                    ℹ️ Note:
                                  </span>{" "}
                                  Add-ons are only available for rooms, not for
                                  cottages.
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </Section>
            )}

            {/* STEP 3 - Payment */}
            {step === 3 && (
              <Section
                title="Step 3: Payment Details"
                subtitle="Complete payment information."
                icon={<FiCreditCard />}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Payment Option *
                    </label>
                    <select
                      value={payment.paymentOption}
                      onChange={(e) => {
                        const newPaymentOptionId = e.target.value;
                        const selectedOption = paymentOptions.find(
                          (po) => po._id === newPaymentOptionId,
                        );
                        let calculatedAmount = finalTotal;
                        if (selectedOption?.paymentType === "partial")
                          calculatedAmount =
                            (finalTotal * selectedOption.amount) / 100;
                        setPayment({
                          ...payment,
                          paymentOption: newPaymentOptionId,
                          amountPaid: calculatedAmount,
                          amountReceived: calculatedAmount,
                          status: "pending",
                        });
                        setFieldError("paymentOption", "");
                      }}
                      className={`mt-1 w-full h-11 rounded-lg border px-4 text-sm outline-none focus:ring-2 focus:ring-[#0c2bfc]/20 focus:border-[#0c2bfc] transition-all duration-200 bg-white ${errors.paymentOption ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    >
                      <option value="">Select payment option</option>
                      {paymentOptions
                        .filter((po) => po.isActive)
                        .map((po) => (
                          <option key={po._id} value={po._id}>
                            {po.name}{" "}
                            {po.paymentType === "partial"
                              ? `(${po.amount}% - ${formatMoney((finalTotal * po.amount) / 100)})`
                              : `(Full - ${formatMoney(finalTotal)})`}
                          </option>
                        ))}
                    </select>
                    <FieldError text={errors.paymentOption} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Payment Type *
                    </label>
                    <select
                      value={payment.paymentType}
                      onChange={(e) => {
                        setPayment({
                          ...payment,
                          paymentType: e.target.value,
                          status: "pending",
                        });
                        setSelectedReceiptImage(null);
                        setReceiptImagePreview("");
                        setReferenceNumber("");
                        setFieldError("paymentType", "");
                        setFieldError("receipt", "");
                      }}
                      className={`mt-1 w-full h-11 rounded-lg border px-4 text-sm outline-none focus:ring-2 focus:ring-[#0c2bfc]/20 focus:border-[#0c2bfc] transition-all duration-200 bg-white ${errors.paymentType ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    >
                      <option value="">Select payment type</option>
                      {paymentTypes
                        .filter((pt) => pt.isActive)
                        .map((pt) => (
                          <option key={pt._id} value={pt._id}>
                            {pt.name} {pt.isReceipt && "(Requires Receipt)"}
                          </option>
                        ))}
                    </select>
                    <FieldError text={errors.paymentType} />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Discount (Optional)
                    </label>
                    <select
                      value={payment.discountId}
                      onChange={(e) => {
                        setPayment({ ...payment, discountId: e.target.value });
                        if (!e.target.value) removeDiscountImage();
                        setFieldError("discountImage", "");
                      }}
                      className="mt-1 w-full h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-[#0c2bfc]/20 focus:border-[#0c2bfc] text-gray-700"
                    >
                      <option value="">No discount</option>
                      {discounts
                        .filter((d) => d.isActive)
                        .map((d) => (
                          <option key={d._id} value={d._id}>
                            {d.name} ({d.discountPercent}%
                            {d.appliesToAllRooms
                              ? ", All rooms"
                              : `, ${d.discountPriority} room`}
                            )
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Amount Paid *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={payment.amountPaid}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setPayment({
                          ...payment,
                          amountPaid: value,
                          amountReceived:
                            payment.amountReceived < value
                              ? value
                              : payment.amountReceived,
                        });
                        setFieldError("amountPaid", "");
                      }}
                      className={`mt-1 w-full h-11 rounded-lg border px-4 text-sm outline-none focus:ring-2 focus:ring-[#0c2bfc]/20 focus:border-[#0c2bfc] transition-all duration-200 bg-white ${errors.amountPaid ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    />
                    <FieldError text={errors.amountPaid} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Amount Received *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={payment.amountReceived}
                      onChange={(e) => {
                        setPayment({
                          ...payment,
                          amountReceived: Number(e.target.value),
                        });
                        setFieldError("amountReceived", "");
                      }}
                      className={`mt-1 w-full h-11 rounded-lg border px-4 text-sm outline-none focus:ring-2 focus:ring-[#0c2bfc]/20 focus:border-[#0c2bfc] transition-all duration-200 bg-white ${errors.amountReceived ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    />
                    <FieldError text={errors.amountReceived} />
                  </div>
                </div>

                {payment.discountId && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-700">
                        Discount ID Image *
                      </label>
                      <button
                        type="button"
                        onClick={() => discountFileInputRef.current?.click()}
                        className="h-9 px-4 rounded-lg bg-[#0c2bfc] hover:bg-[#0a24d6] text-white text-xs font-medium inline-flex items-center gap-2 transition-all duration-200"
                      >
                        <FiUploadCloud size={12} /> Upload
                      </button>
                      <input
                        ref={discountFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0])
                            handleDiscountImageUpload(e.target.files[0]);
                        }}
                      />
                    </div>
                    {discountImagePreview ? (
                      <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                        <div className="relative">
                          <img
                            src={discountImagePreview}
                            alt="Discount ID"
                            className="h-48 w-full object-contain bg-gray-50"
                          />
                          <button
                            type="button"
                            onClick={removeDiscountImage}
                            className="absolute top-2 right-2 h-9 w-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 grid place-items-center text-[#0c2bfc] transition-all duration-200"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
                        <FiUploadCloud
                          className="mx-auto mb-3 text-gray-400"
                          size={28}
                        />
                        <div>Upload discount ID image</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Required for discount application
                        </div>
                      </div>
                    )}
                    <FieldError text={errors.discountImage} />
                  </div>
                )}

                {requiresReceipt && (
                  <div className="mt-6">
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Receipt Information *
                      </div>
                      <div className="text-xs text-gray-500 mb-3">
                        Please provide either a reference number OR upload a
                        receipt image.
                      </div>
                    </div>

                    {/* Reference Number Field */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reference Number
                        <span className="text-xs text-gray-500 ml-2">
                          (Optional if image uploaded)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={referenceNumber}
                        onChange={(e) => {
                          setReferenceNumber(e.target.value);
                          setFieldError("receipt", "");
                          if (e.target.value && selectedReceiptImage) {
                            setFieldError("receipt", "");
                          }
                        }}
                        placeholder="e.g., GCash Ref #, Bank Transfer Ref #"
                        className="w-full h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-[#0c2bfc]/20 focus:border-[#0c2bfc] transition-all duration-200"
                      />
                    </div>

                    {/* OR Divider */}
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                      </div>
                    </div>

                    {/* Receipt Image Upload */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-gray-700">
                          Receipt Image
                          <span className="text-xs text-gray-500 ml-2">
                            (Optional if reference number provided)
                          </span>
                        </label>
                        <div className="flex items-center gap-2">
                          {selectedReceiptImage && (
                            <button
                              type="button"
                              onClick={() => {
                                removeReceiptImage();
                                setFieldError("receipt", "");
                              }}
                              className="h-9 px-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700"
                            >
                              Clear
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => receiptFileInputRef.current?.click()}
                            className="h-9 px-4 rounded-lg bg-[#0c2bfc] hover:bg-[#0a24d6] text-white text-xs font-medium inline-flex items-center gap-2 transition-all duration-200"
                          >
                            <FiUploadCloud size={12} />{" "}
                            {selectedReceiptImage ? "Change" : "Upload"}
                          </button>
                          <input
                            ref={receiptFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleReceiptImageUpload(e.target.files[0]);
                                setFieldError("receipt", "");
                              }
                            }}
                          />
                        </div>
                      </div>

                      {receiptImagePreview ? (
                        <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                          <div className="relative">
                            <img
                              src={receiptImagePreview}
                              alt="Payment Receipt"
                              className="h-48 w-full object-contain bg-gray-50"
                            />
                            <button
                              type="button"
                              onClick={removeReceiptImage}
                              className="absolute top-2 right-2 h-9 w-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 grid place-items-center text-[#0c2bfc] transition-all duration-200"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
                          <FiUploadCloud
                            className="mx-auto mb-3 text-gray-400"
                            size={28}
                          />
                          <div>Upload receipt image (optional)</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {referenceNumber
                              ? "Reference number provided, image is optional"
                              : "Upload image or provide reference number"}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Validation Status */}
                    <div className="mt-3 text-xs">
                      {referenceNumber || receiptImagePreview ? (
                        <div className="text-[#00af00] flex items-center gap-1">
                          <FiCheckCircle size={12} />
                          {referenceNumber && receiptImagePreview
                            ? "✓ Both reference number and image provided"
                            : referenceNumber
                              ? "✓ Reference number provided"
                              : "✓ Receipt image uploaded"}
                        </div>
                      ) : (
                        <div className="text-amber-600 flex items-center gap-1">
                          <FiAlertCircle size={12} />
                          Please provide either a reference number or upload a
                          receipt image
                        </div>
                      )}
                    </div>
                    <FieldError text={errors.receipt} />
                  </div>
                )}
              </Section>
            )}
          </div>

          {/* Right Summary Panel */}
          <div className="lg:col-span-4 space-y-6">
            <SummaryCard title="Booking Summary">
              <div className="space-y-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Check In</span>
                    <span className="font-medium text-gray-900">
                      {reservationFormData.checkIn
                        ? new Date(reservationFormData.checkIn).toLocaleString(
                            "en-PH",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Check Out</span>
                    <span className="font-medium text-gray-900">
                      {reservationFormData.checkOut
                        ? new Date(reservationFormData.checkOut).toLocaleString(
                            "en-PH",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nights</span>
                    <span className="font-medium text-gray-900">
                      {nights || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Guests</span>
                    <span className="font-medium text-gray-900">
                      {reservationFormData.adults} adults,{" "}
                      {reservationFormData.children} children
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Items</span>
                    <span className="font-medium text-gray-900">
                      {roomReservations.length} / {maxRooms}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4"></div>
                {roomTotals.map((roomTotal, index) => {
                  const roomRes = roomReservations[index];
                  const item = availableRooms.find(
                    (r) => r._id === roomRes?.roomId,
                  );
                  const isCottage = item?.category === "cottage";
                  return (
                    <div key={roomTotal.roomId} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-medium text-gray-900">
                          {isCottage ? "Cottage" : "Room"} {roomRes?.roomNumber}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${isCottage ? "bg-[#00af00]/10 text-[#00af00]" : "bg-[#0c2bfc]/10 text-[#0c2bfc]"}`}
                        >
                          {isCottage ? "Cottage" : "Room"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">
                            {nights} × {formatMoney(roomTotal.roomRate)}
                          </span>
                          <span>{formatMoney(roomTotal.roomSubtotal)}</span>
                        </div>
                        {roomRes?.addOns.map((addOn, aIndex) => {
                          const addOnData = addOns.find(
                            (a) => a._id === addOn.addOnId,
                          );
                          return (
                            <div
                              key={`${addOn.addOnId}-${aIndex}`}
                              className="flex justify-between text-xs"
                            >
                              <span className="text-gray-500 pl-2">
                                • {addOnData?.name} (×{addOn.quantity})
                                {addOnData?.category &&
                                  ` - ${addOnData.category}`}
                              </span>
                              <span>
                                {formatMoney(
                                  (addOnData?.rate || 0) * addOn.quantity,
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-xs font-medium pt-1 border-t border-gray-100">
                        <span className="text-gray-700">Total</span>
                        <span>{formatMoney(roomTotal.total)}</span>
                      </div>
                    </div>
                  );
                })}
                <div className="border-t border-gray-200 pt-4"></div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatMoney(totalAmount)}
                    </span>
                  </div>
                  {discount.amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Discount ({discount.name})
                      </span>
                      <span className="font-medium text-[#00af00]">
                        -{formatMoney(discount.amount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-base pt-2 border-t border-gray-200">
                    <span className="text-gray-700 font-semibold">Total</span>
                    <span className="text-gray-900 font-semibold">
                      {formatMoney(finalTotal)}
                    </span>
                  </div>
                  {step === 3 && (
                    <>
                      <div className="border-t border-gray-200 pt-4"></div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Total Amount</span>
                          <span className="font-medium text-gray-900">
                            {formatMoney(finalTotal)}
                          </span>
                        </div>
                        {payment.paymentOption && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              {(() => {
                                const po = paymentOptions.find(
                                  (p) => p._id === payment.paymentOption,
                                );
                                if (!po) return "Amount Due";
                                return po.paymentType === "partial"
                                  ? `Partial Payment (${po.amount}%)`
                                  : "Full Payment";
                              })()}
                            </span>
                            <span className="font-medium text-gray-900">
                              {formatMoney(amountDue)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-500">Amount Paid</span>
                          <span className="font-medium text-gray-900">
                            {formatMoney(payment.amountPaid)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Amount Received</span>
                          <span className="font-medium text-gray-900">
                            {formatMoney(payment.amountReceived)}
                          </span>
                        </div>
                        {payment.amountReceived > payment.amountPaid && (
                          <div className="flex justify-between text-[#00af00]">
                            <span>Change</span>
                            <span className="font-medium">
                              {formatMoney(
                                payment.amountReceived - payment.amountPaid,
                              )}
                            </span>
                          </div>
                        )}
                        {payment.amountPaid < amountDue && (
                          <div className="flex justify-between text-red-600">
                            <span>Balance Due</span>
                            <span className="font-medium">
                              {formatMoney(amountDue - payment.amountPaid)}
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              {step === 2 && reservationFormData.adults > totalCapacity && (
                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-800">
                  <div className="font-medium">Capacity Warning</div>
                  <div className="mt-1">
                    Selected capacity ({totalCapacity}) is not enough for{" "}
                    {reservationFormData.adults} adults.
                  </div>
                </div>
              )}
            </SummaryCard>

            {/* Guest Info Card */}
            {currentGuest && (
              <SummaryCard title="Guest Information">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-gray-400" size={14} />
                    <span className="font-medium text-gray-900">
                      {currentGuest.firstName} {currentGuest.lastName}
                    </span>
                  </div>
                  <div className="text-gray-600">{currentGuest.email}</div>
                  <div className="text-gray-600">
                    {currentGuest.contactNumber}
                  </div>
                </div>
              </SummaryCard>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className={`h-11 px-5 rounded-lg border text-sm font-medium inline-flex items-center gap-2 transition-all duration-200 ${step === 1 ? "border-gray-200 text-gray-400 cursor-not-allowed bg-white" : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-[#0c2bfc] hover:shadow-md"}`}
          >
            <FiChevronLeft /> Back
          </button>

          {step === 1 && (
            <button
              type="button"
              onClick={handleStep1Next}
              disabled={loadingRooms}
              className={`h-11 px-5 rounded-lg text-white text-sm font-medium inline-flex items-center gap-2 transition-all duration-200 ${loadingRooms ? "bg-[#0c2bfc]/50 cursor-not-allowed" : "bg-[#0c2bfc] hover:bg-[#0a24d6] hover:shadow-md"}`}
            >
              {loadingRooms ? "Loading..." : "Next"} <FiChevronRight />
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={handleStep2Next}
              disabled={
                roomReservations.length === 0 ||
                roomReservations.length > maxRooms ||
                errors.category
              }
              className={`h-11 px-5 rounded-lg text-white text-sm font-medium inline-flex items-center gap-2 transition-all duration-200 ${roomReservations.length === 0 || roomReservations.length > maxRooms || errors.category ? "bg-[#0c2bfc]/50 cursor-not-allowed" : "bg-[#0c2bfc] hover:bg-[#0a24d6] hover:shadow-md"}`}
            >
              Next <FiChevronRight />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleShowConfirmModal}
              disabled={loading}
              className={`h-11 px-5 rounded-lg text-white text-sm font-medium inline-flex items-center gap-2 transition-all duration-200 ${loading ? "bg-[#00af00]/50 cursor-not-allowed" : "bg-[#00af00] hover:bg-[#009500] hover:shadow-md"}`}
            >
              {loading ? "Creating..." : "Complete Reservation"}
            </button>
          )}
        </div>

        {/* Loader overlay */}
        {(loading || loadingRooms) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
            <Loader
              size={60}
              variant="primary"
              showText={true}
              text={loading ? "Creating reservation..." : "Loading items..."}
            />
          </div>
        )}
      </div>
      <RefundPolicyModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={submitReservation}
      />
    </>
  );
}
