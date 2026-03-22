// src/pages/guest/Contact.jsx
import { useState } from "react";
import { useGuestStore } from "../stores/guestStore";
import toast from "react-hot-toast";

export default function Contact() {
  const { isAuthenticated, currentGuest } = useGuestStore();
  const [formData, setFormData] = useState({
    name: currentGuest
      ? `${currentGuest.firstName} ${currentGuest.lastName}`.trim()
      : "",
    email: currentGuest?.email || "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call - replace with actual API endpoint
    try {
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitted(true);
      toast.success("Message sent successfully!");
      setFormData({
        name: currentGuest
          ? `${currentGuest.firstName} ${currentGuest.lastName}`.trim()
          : "",
        email: currentGuest?.email || "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: "📍",
      title: "Address",
      details: "Antipolo City, Rizal, Philippines",
      link: "https://maps.google.com",
      description: "Visit us in the heart of Antipolo",
    },
    {
      icon: "📞",
      title: "Phone",
      details: "(02) 8123 4567",
      link: "tel:+63 976023356 ",
      description: "Call us for immediate assistance",
    },
    {
      icon: "📧",
      title: "Email",
      details: "suvasplaceinc@gmail.com",
      link: "mailto:suvasplaceinc@gmail.com",
      description: "Send us an email anytime",
    },
    {
      icon: "🕒",
      title: "Business Hours",
      details: "24/7 - Always Open",
      description: "We're here for you around the clock",
    },
  ];

  const faqs = [
    {
      question: "What are the check-in and check-out times?",
      answer:
        "Check-in is at 2:00 PM and check-out is at 12:00 PM. Early check-in and late check-out may be available upon request. Please contact our front desk for availability.",
    },
    {
      question: "Do you have parking available?",
      answer:
        "Yes, we offer complimentary parking for all guests. Our parking area is secure, well-lit, and monitored 24/7 by security personnel.",
    },
    {
      question: "Are pets allowed?",
      answer:
        "We have a limited number of pet-friendly rooms available. Please contact us in advance to make arrangements. Additional fees may apply.",
    },
    {
      question: "Do you offer airport transportation?",
      answer:
        "Yes, we offer airport shuttle service for an additional fee. Please contact us at least 24 hours in advance to arrange pick-up.",
    },
    {
      question: "What amenities are included?",
      answer:
        "Our amenities include swimming pool, restaurant, free Wi-Fi, parking, and garden views. Some rooms also include kitchenettes and private verandas.",
    },
    {
      question: "Is there a cancellation policy?",
      answer:
        "Free cancellation up to 7 days before check-in. Cancellations within 7 days may incur a fee. Please refer to your booking confirmation for details.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and
          we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>
            <div className="space-y-6">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="flex items-start gap-4 group">
                  <div className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {info.title}
                    </h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        target={
                          info.link.startsWith("http") ? "_blank" : undefined
                        }
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 transition-colors block"
                      >
                        {info.details}
                      </a>
                    ) : (
                      <p className="text-gray-600">{info.details}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {info.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-800 mb-3">Our Location</h3>
              <div className="rounded-xl overflow-hidden h-48 bg-gray-100 border border-gray-200">
                <iframe
                  title="Suva's Place Resort Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.130524471811!2d121.1776588!3d14.5916374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397bf51ef941ce1%3A0x4129f68c8e58bcbb!2sSuva&#39;s%20Place%20Resort!5e0!3m2!1sen!2sph!4v1774145930318!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                View on Google Maps
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-600 mb-6">
                  Thank you for reaching out. We'll get back to you within 24
                  hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Send a Message
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Fill out the form below and we'll get back to you as soon as
                    possible.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your name"
                      disabled={isAuthenticated}
                    />
                    {isAuthenticated && (
                      <p className="text-xs text-gray-500 mt-1">
                        Using your account information
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="your@email.com"
                      disabled={isAuthenticated}
                    />
                    {isAuthenticated && (
                      <p className="text-xs text-gray-500 mt-1">
                        Using your account email
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </div>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* FAQ Section */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-900">
                Frequently Asked Questions
              </h3>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group border-b border-gray-100 pb-4 last:border-0"
                >
                  <summary className="cursor-pointer font-medium text-gray-800 hover:text-blue-600 transition-colors flex items-center justify-between">
                    <span>{faq.question}</span>
                    <svg
                      className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform"
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
                  </summary>
                  <p className="mt-2 text-gray-600 pl-4 border-l-2 border-blue-200">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
