// src/pages/guest/FAQ.jsx
import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Booking & Reservations",
      questions: [
        {
          q: "How do I make a reservation?",
          a: "You can make a reservation through our website by clicking the 'Book Now' button on any room page. You can also call us at +63 976023356 or email suvasplaceinc@gmail.com for assistance.",
        },
        {
          q: "What is your cancellation policy?",
          a: "Free cancellation up to 7 days before check-in. Cancellations within 7 days of check-in will incur a 50% charge. No-shows will be charged the full amount.",
        },
        {
          q: "Do I need to pay a deposit?",
          a: "Yes, a 30% deposit is required to confirm your booking. The remaining balance can be paid upon check-in.",
        },
      ],
    },
    {
      category: "Check-in & Check-out",
      questions: [
        {
          q: "What are the check-in and check-out times?",
          a: "Check-in is at 2:00 PM and check-out is at 12:00 PM. Early check-in and late check-out may be available upon request, subject to availability.",
        },
        {
          q: "Can I request early check-in?",
          a: "Yes, early check-in can be requested based on availability. There may be an additional fee depending on the time of arrival.",
        },
        {
          q: "What documents do I need for check-in?",
          a: "Please bring a valid government-issued ID or passport for all guests checking in.",
        },
      ],
    },
    {
      category: "Amenities & Services",
      questions: [
        {
          q: "Do you have swimming pools?",
          a: "Yes, we have an Olympic-sized pool, a kiddie pool, and a heated jacuzzi. Pool towels are provided.",
        },
        {
          q: "Is Wi-Fi available?",
          a: "Yes, complimentary high-speed Wi-Fi is available throughout the resort.",
        },
        {
          q: "Do you have a restaurant?",
          a: "Yes, we have two restaurants serving local and international cuisine, as well as a poolside bar.",
        },
      ],
    },
    {
      category: "Policies",
      questions: [
        {
          q: "Are pets allowed?",
          a: "We have a limited number of pet-friendly rooms available. Please contact us in advance to make arrangements. Additional cleaning fees may apply.",
        },
        {
          q: "Is smoking allowed?",
          a: "Smoking is only permitted in designated outdoor areas. All rooms and indoor facilities are strictly non-smoking.",
        },
        {
          q: "Do you allow outside food and drinks?",
          a: "Outside food and drinks are not allowed in the resort. However, we have a corkage fee for special occasions with prior arrangement.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about Suva's Place Resort
        </p>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-12">
        {faqs.map((category, catIdx) => (
          <div key={catIdx}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {category.category}
            </h2>
            <div className="space-y-4">
              {category.questions.map((faq, idx) => {
                const questionIndex = `${catIdx}-${idx}`;
                const isOpen = openIndex === questionIndex;

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setOpenIndex(isOpen ? null : questionIndex)
                      }
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                    >
                      <span className="font-semibold text-gray-800">
                        {faq.q}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 text-gray-600">{faq.a}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Still Have Questions */}
      <div className="mt-16 bg-gradient-to-r from-amber-500 to-rose-500 rounded-2xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
        <p className="mb-6">
          We're here to help! Contact us and we'll get back to you as soon as
          possible.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/contact"
            className="px-6 py-2 bg-white text-amber-600 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Contact Us
          </a>
          <a
            href="tel:+63281234567"
            className="px-6 py-2 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition"
          >
            Call Us Now
          </a>
        </div>
      </div>
    </div>
  );
}
