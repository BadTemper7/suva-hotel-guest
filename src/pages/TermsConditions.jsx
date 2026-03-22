// src/pages/guest/TermsConditions.jsx
export default function TermsConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <p className="text-gray-600 mb-8">Last updated: January 1, 2024</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600">
              By accessing and using Suva's Place Resort website and services,
              you agree to be bound by these Terms and Conditions. If you do not
              agree with any part of these terms, please do not use our
              services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              2. Booking and Reservations
            </h2>
            <p className="text-gray-600 mb-2">
              All bookings are subject to availability. A valid credit card or
              deposit is required to confirm reservations. Please ensure all
              booking details are accurate before confirming.
            </p>
            <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
              <li>Check-in time: 2:00 PM</li>
              <li>Check-out time: 12:00 PM</li>
              <li>Early check-in and late check-out subject to availability</li>
              <li>Government-issued ID required upon check-in</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              3. Cancellation Policy
            </h2>
            <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
              <li>Free cancellation up to 7 days before check-in</li>
              <li>50% charge for cancellations within 7 days of check-in</li>
              <li>No-shows will be charged the full amount</li>
              <li>Refunds processed within 7-14 business days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Payment Terms</h2>
            <p className="text-gray-600">
              A 30% deposit is required to confirm your reservation. The
              remaining balance must be paid upon check-in. We accept cash,
              credit cards, and bank transfers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Property Rules</h2>
            <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
              <li>No smoking inside rooms and indoor facilities</li>
              <li>No outside food and drinks allowed (corkage fee applies)</li>
              <li>Pets allowed only in designated pet-friendly rooms</li>
              <li>Quiet hours from 10:00 PM to 7:00 AM</li>
              <li>Swimming pool hours: 7:00 AM to 9:00 PM</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Liability</h2>
            <p className="text-gray-600">
              Suva's Place Resort is not responsible for any loss, damage, or
              injury to persons or property during your stay. We recommend
              securing valuables in the provided safety deposit boxes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Privacy Policy</h2>
            <p className="text-gray-600">
              We collect and process personal information in accordance with our
              Privacy Policy. By using our services, you consent to such
              processing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Modifications</h2>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. Changes
              will be effective immediately upon posting. Continued use of our
              services constitutes acceptance of modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              9. Contact Information
            </h2>
            <p className="text-gray-600">
              For questions or concerns regarding these terms, please contact us
              at:
              <br />
              Email: suvasplaceinc@gmail.com
              <br />
              Phone: +63 976023356
              <br />
              Address: Antipolo City, Rizal, Philippines
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
