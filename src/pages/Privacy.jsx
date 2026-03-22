// src/pages/guest/PrivacyPolicy.jsx
import { Link } from "react-router-dom";

export default function Privacy() {
  const lastUpdated = "March 21, 2026";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600">
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your information.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Last Updated Banner */}
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-3">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">Last updated:</span> {lastUpdated}
          </p>
        </div>

        <div className="p-6 md:p-8">
          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Introduction
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Welcome to Suva's Place Resort. We are committed to protecting
                your personal information and your right to privacy. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website or make a
                reservation with us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                1. Information We Collect
              </h2>
              <p className="text-gray-600 mb-3">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 ml-4 space-y-2">
                <li>
                  Full name, email address, phone number, and contact details
                </li>
                <li>Payment information for reservations and bookings</li>
                <li>Identification documents for verification purposes</li>
                <li>Special requests, preferences, and dietary restrictions</li>
                <li>Communication history with our team</li>
                <li>IP address, browser type, and device information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-3">
                We use the information we collect for various purposes:
              </p>
              <ul className="list-disc list-inside text-gray-600 ml-4 space-y-2">
                <li>Process and manage your reservations and bookings</li>
                <li>Communicate with you about your stay and confirmations</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Improve our services and enhance guest experience</li>
                <li>Send promotional offers and updates (with your consent)</li>
                <li>Comply with legal obligations and regulations</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                3. Information Sharing
              </h2>
              <p className="text-gray-600 mb-3">
                We do not sell, trade, or rent your personal information to
                third parties. We may share information with:
              </p>
              <ul className="list-disc list-inside text-gray-600 ml-4 space-y-2">
                <li>
                  Service providers who assist in operating our resort (payment
                  processors, IT services)
                </li>
                <li>
                  Legal authorities when required by law or to protect rights
                </li>
                <li>With your consent or at your direction</li>
                <li>Business partners for collaborative services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Data Security
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate technical and organizational security
                measures to protect your personal information. However, no
                method of transmission over the Internet or electronic storage
                is 100% secure. While we strive to use commercially acceptable
                means to protect your personal information, we cannot guarantee
                its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                5. Your Rights
              </h2>
              <p className="text-gray-600 mb-3">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-600 ml-4 space-y-2">
                <li>Access your personal information we hold</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications at any time</li>
                <li>Withdraw consent where applicable</li>
                <li>Data portability where applicable</li>
              </ul>
              <p className="text-gray-600 mt-3">
                To exercise these rights, please contact us using the
                information provided below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                6. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your
                browsing experience, analyze website traffic, and personalize
                content. You can control cookie settings through your browser
                preferences. Disabling cookies may affect certain features of
                our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                7. Third-Party Links
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our website may contain links to third-party websites, products,
                or services. We are not responsible for the privacy practices or
                content of these third parties. We encourage you to review their
                privacy policies before providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                8. Children's Privacy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are not directed to children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If we become aware that we have collected personal
                information from a child under 13 without parental consent, we
                will take steps to delete that information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                9. International Data Transfers
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Your information may be transferred to and maintained on servers
                located outside of your country. By using our services, you
                consent to the transfer of your information to countries that
                may have different data protection laws than your country.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                10. Changes to This Policy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this privacy policy periodically to reflect
                changes in our practices or for legal reasons. We will notify
                you of any material changes by posting the new policy on this
                page with an updated effective date. We encourage you to review
                this policy regularly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                11. Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have questions, concerns, or requests regarding this
                privacy policy or our data practices, please contact us:
              </p>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-700">
                  <span className="font-semibold">Suva's Place Resort</span>
                  <br />
                  📍 Antipolo City, Rizal, Philippines
                  <br />
                  📧{" "}
                  <a
                    href="mailto:privacy@suvasplace.com"
                    className="text-blue-600 hover:underline"
                  >
                    privacy@suvasplace.com
                  </a>
                  <br />
                  📞{" "}
                  <a
                    href="tel:+63281234567"
                    className="text-blue-600 hover:underline"
                  >
                    +63 976023356
                  </a>
                </p>
              </div>
            </section>

            {/* Acknowledgement */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                By using our website and services, you acknowledge that you have
                read and understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home Link */}
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
