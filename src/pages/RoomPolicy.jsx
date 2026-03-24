// src/pages/guest/RoomPolicy.jsx
import { Link } from "react-router-dom";

export default function RoomPolicy() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Room Policy</h1>
        <p className="text-gray-600">
          In order to make your stay as pleasant as possible, the resort and
          motel management requests your cooperation in observing the following
          policies.
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
            {/* Section 1 - Check-in/Check-out */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                1. Check-in & Check-out
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Early check-in and late check-out may be accommodated subject to
                availability and additional charges.
              </p>
            </div>

            {/* Section 2 - Requirements */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                2. Check-in Requirements
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                A valid government-issued ID and cash deposit are required upon
                check-in. The deposited amount and ID will be returned upon
                check-out, provided there is no damage caused to the
                resort/rooms.
              </p>
              <ul className="space-y-2 ml-6">
                <li className="text-gray-700">
                  a. Cuarto & Teodora:{" "}
                  <span className="font-semibold">₱500.00</span>
                </li>
                <li className="text-gray-700">
                  b. Casa: <span className="font-semibold">₱1,000.00</span>
                </li>
              </ul>
            </div>

            {/* Section 3 - Occupancy */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                3. Room Occupancy
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The maximum occupancy per room is strictly enforced. Additional
                guests beyond the maximum occupancy will be charged an extra
                person per night. Visitors of registered guests are allowed in
                public areas but are not permitted to stay overnight and must
                provide a valid government ID.
              </p>
            </div>

            {/* Section 4 - Smoking */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                4. Smoking & Vaping
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Smoking and vaping is strictly prohibited inside the rooms.
                Guests found and proven smoking in the room will be charged a
                cleaning fee of
                <span className="font-semibold text-red-600"> ₱1,000.00</span>.
              </p>
            </div>

            {/* Section 5 - Pets */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                5. Pet Policy
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The resort is dog-friendly and accepts dogs weighing less than
                40kg/88lbs, with a maximum of two (2) dogs per room. A charge of
                <span className="font-semibold"> ₱200.00</span> per night per
                dog applies.
              </p>
            </div>

            {/* Section 6 - Room Keys */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                6. Room Keys
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Guests are provided with a key upon registration and are
                requested to lock the door of their rooms when going out or
                going to bed. A penalty of
                <span className="font-semibold text-red-600">
                  {" "}
                  ₱500.00
                </span>{" "}
                will be charged for lost or damaged key.
              </p>
            </div>

            {/* Section 7 - Damages */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                7. Damages
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Guests will be held responsible for any loss or damage to Suva's
                Place Resort and Teodora's property caused by themselves, their
                guests, or any person for whom they are responsible. In case of
                damage caused to the resort/rooms, the guest is responsible for
                covering the cost of repairs.
              </p>
            </div>

            {/* Section 8 - Illegal Substances */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                8. Illegal Substances
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Possession or use of illegal drugs or marijuana is strictly
                prohibited inside the rooms. Any person found carrying or using
                such substances will be reported immediately to the proper
                authorities and will be asked to leave the resort without
                refund.
              </p>
            </div>

            {/* Section 9 - Noise & Behavior */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                9. Noise & Behavior
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Guests are expected to respect the peace and privacy of other
                guests. Excessive noise, parties, and disruptive behavior are
                strictly prohibited. Additionally, a charge of{" "}
                <span className="font-semibold text-red-600">₱2,000.00</span>{" "}
                will be applied for any disruption caused to the resort's
                operation. Quiet hours are observed from
                <span className="font-semibold"> 10:00 PM to 8:00 AM</span>.
              </p>
            </div>

            {/* Section 10 - Swimming Pool Access */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                10. Swimming Pool Access
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Swimming pool access will only be available from:
              </p>
              <ul className="mt-2 space-y-1 ml-6">
                <li className="text-gray-700">
                  • Day Swimming:{" "}
                  <span className="font-semibold">8:00 AM - 4:30 PM</span>
                </li>
                <li className="text-gray-700">
                  • Night Swimming:{" "}
                  <span className="font-semibold">8:00 PM - 4:30 AM</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                We kindly ask for your cooperation in adhering to these
                designated hours to ensure a pleasant experience for all guests.
                The management will not be held responsible for any accidents in
                the pool that occur during unavailable hours.
              </p>
            </div>

            {/* Section 11 - Food Restrictions */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                11. Food Restrictions
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Food with strong or unpleasant odors is not allowed inside the
                rooms. Guests caught bringing or cooking such food will be
                charged
                <span className="font-semibold text-red-600">
                  {" "}
                  ₱1,000.00
                </span>{" "}
                for cleaning.
              </p>
            </div>

            {/* Section 12 - Cooking */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                12. Cooking
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Cooking is only allowed outside the rooms. Verandas and
                designated dirty kitchen are provided. Please inform the
                management if you plan to do so.
              </p>
            </div>

            {/* Section 13 - Guest Policy */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                13. Guest Policy
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The Guest Policy Statement also applies to room guests. We
                kindly request that you familiarize yourself with the policy and
                adhere to it during your stay.
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
