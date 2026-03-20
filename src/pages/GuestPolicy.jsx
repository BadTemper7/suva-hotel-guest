// src/pages/guest/GuestPolicy.jsx
import { Link } from "react-router-dom";

export default function GuestPolicy() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Guest Policy</h1>
        <p className="text-gray-600">
          Please read and understand our resort policies before your visit. By
          entering the premises, you agree to comply with all rules and
          regulations stated below.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Last Updated Banner */}
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-3">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">Effective Date:</span> March 21,
            2026
          </p>
        </div>

        <div className="p-6 md:p-8">
          <div className="space-y-8">
            {/* Section 1 - Entrance Fee */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                1. Entrance Fee & Pool Access
              </h3>
              <p className="text-gray-700 leading-relaxed">
                All guests must pay the designated entrance fee before entering
                the pool area. Children under 18 years old must be accompanied
                by their parents or guardians.
              </p>
            </div>

            {/* Section 2 - Cottage Occupancy */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                2. Cottage Occupancy
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The maximum occupancy per cottage is strictly enforced.
                Additional guests beyond the maximum occupancy will be charged
                an extra person fee per cottage.
              </p>
            </div>

            {/* Section 3 - Music & Videoke */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                3. Music & Videoke
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Playing music and using portable videoke are allowed only in
                moderation. Loud music and videoke will not be allowed beyond
                10:00 PM.
              </p>
            </div>

            {/* Section 4 - Unauthorized Usage */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                4. Unauthorized Usage
              </h3>
              <p className="text-gray-700 leading-relaxed">
                No using of empty cottages or umbrellas. Any unauthorized usage
                shall be charged appropriately.
              </p>
            </div>

            {/* Section 5 - Beverages */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                5. Beverages
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Beverages such as carbonated drinks and liquors will be charged
                per bottle:
              </p>
              <ul className="mt-2 space-y-1 ml-6">
                <li className="text-gray-700">
                  • Carbonated Drinks:{" "}
                  <span className="font-semibold">₱50.00</span> per bottle
                </li>
                <li className="text-gray-700">
                  • Liquors: <span className="font-semibold">₱60.00</span> per
                  bottle
                </li>
              </ul>
            </div>

            {/* Section 6 - Electricity Usage */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                6. Electricity Usage
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Usage of electricity in cottages will be charged depending on
                the size of the device. (Kindly refer to "Other Fee" section).
              </p>
            </div>

            {/* Section 7 - Pool Rules */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                7. Pool Rules
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We kindly request that all guests adhere to the instructions
                provided by the lifeguards and follow the pool rules at all
                times. Failure to do so may result in being asked to leave the
                premises.
              </p>
              <ul className="space-y-2 ml-6">
                <li className="text-gray-700">
                  a. Running, pushing and any dangerous games are strictly
                  prohibited.
                </li>
                <li className="text-gray-700">
                  b. Non-swimmers and weak swimmers must wear appropriate
                  floatation devices.
                </li>
                <li className="text-gray-700">
                  c. Glass and plastic containers, sharp objects and hazardous
                  materials are not allowed in the pool area.
                </li>
                <li className="text-gray-700">
                  d. Only swimwear such as rash guards, shorts, swimming trunks,
                  bathing suits shall be allowed while using the pool. No
                  wearing of cotton shirts, pants, jogger, denim shorts, and
                  khaki shorts.
                </li>
                <li className="text-gray-700">
                  e. All guests must shower before entering the pool.
                </li>
                <li className="text-gray-700">
                  f. Guests with open wounds, infections or contagious disease
                  are not allowed in the pool.
                </li>
                <li className="text-gray-700">
                  g. Spitting, spouting water and blowing the nose in the pool
                  are strictly prohibited.
                </li>
                <li className="text-gray-700">
                  h. No food or drinks are allowed in the pool itself. There are
                  designated areas for consuming food and drinks.
                </li>
                <li className="text-gray-700">
                  i. Pets are not allowed to swim in the pools.
                </li>
              </ul>
            </div>

            {/* Section 8 - Environmental Responsibility */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                8. Environmental Responsibility
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Let's work together to protect our planet by responsibly
                disposing of our trash in the designated bins.
              </p>
            </div>

            {/* Section 9 - Kids Supervision */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                9. Kids Supervision
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Kids shall be accompanied by their parents or guardians at all
                times while inside the resort and specially while using the
                pool.
              </p>
            </div>

            {/* Section 10 - Transactions */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                10. Transactions & Payments
              </h3>
              <p className="text-gray-700 leading-relaxed">
                All transactions and payments must only be made at the front
                desk.
              </p>
            </div>

            {/* Section 11 - Body Stamp */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                11. Body Stamp
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Always secure body stamp when going out of the resort. Absence
                of which shall be considered invalid entry and shall pay
                corresponding entrance fee.
              </p>
            </div>

            {/* Section 12 - Vandalism */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                12. Vandalism
              </h3>
              <p className="text-gray-700 leading-relaxed">
                A penalty of{" "}
                <span className="font-semibold text-red-600">₱3,000.00</span>{" "}
                for customers caught doing vandalism in any part of the resort
                shall be imposed.
              </p>
            </div>

            {/* Section 13 - Damaged Property */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                13. Damaged Property
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Any damaged resort property caused by the customer shall be
                charged accordingly and immediately.
              </p>
            </div>

            {/* Section 14 - Lost Items */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                14. Lost Items
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The resort management will not be responsible for any loss or
                damage to the customer's property.
              </p>
            </div>

            {/* Section 15 - Illegal Substances */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                15. Illegal Substances
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Possession or use of illegal drugs or marijuana is strictly
                prohibited inside the resort premises. Any person proven
                carrying or using such will be reported immediately to proper
                authorities and will be asked to leave the resort without
                refund.
              </p>
            </div>

            {/* Section 16 - Urinating */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                16. Proper Hygiene
              </h3>
              <p className="text-gray-700 leading-relaxed">
                A penalty of{" "}
                <span className="font-semibold text-red-600">₱1,000.00</span>{" "}
                for customers caught urinating on walls and areas other than
                comfort rooms.
              </p>
            </div>

            {/* Section 17 - Disruptive Behavior */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                17. Disruptive Behavior
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Engaging in any form of disruptive behavior, such as fighting,
                shouting or causing disturbances to other customers, may result
                in being asked to leave the resort without refund. Additionally,
                a charge of
                <span className="font-semibold text-red-600">
                  {" "}
                  ₱2,000.00
                </span>{" "}
                will be applied for any disruption caused to the resort's
                operation.
              </p>
            </div>

            {/* Section 18 - Photos & Videos */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                18. Photos & Videos
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Any pictures and videos taken within the premises may be
                utilized for company advertisement purposes.
              </p>
            </div>

            {/* Section 19 - Refunds */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                19. Refund Policy
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Once payment settles, payments are{" "}
                <span className="font-semibold">non-refundable</span>, except in
                cases of unforeseen circumstances such as blackouts or natural
                calamities. (Compensation is not applicable during designated
                blackout periods).
              </p>
            </div>

            {/* Section 20 - Visitors */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                20. Visitors
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Visitors are permitted to stay for a maximum of 15 minutes.
                Intending to stay longer must pay an entrance fee.
              </p>
            </div>

            {/* Responsibility Statement */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-800 font-medium text-center">
                "On behalf of my colleagues, I take full responsibility for
                their actions and hereby acknowledge and agree to all the terms
                and conditions stated in this policy statement."
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
