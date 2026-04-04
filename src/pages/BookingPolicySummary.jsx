import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  bookingPolicySummaryIntro,
  resortGuestSummary,
  roomPolicySummary,
} from "../content/bookingPolicySummary.js";

function BulletList({ items }) {
  return (
    <ul className="space-y-2.5 text-gray-700 text-sm leading-relaxed">
      {items.map((text, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

function Section({ title, children }) {
  return (
    <div className="border-l-4 border-blue-500 pl-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
      {children}
    </div>
  );
}

export default function BookingPolicySummary() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>Booking essentials — policies at a glance | Suva&apos;s Place</title>
        <meta
          name="description"
          content="Summarized resort and room policies for guests booking or visiting Suva's Place Resort Antipolo."
        />
      </Helmet>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Policies at a glance
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{bookingPolicySummaryIntro}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-3">
          <p className="text-sm text-amber-900">
            <span className="font-semibold">Note:</span> This is a summary for
            convenience. For complete terms, see the full{" "}
            <Link
              to="/guest-policy"
              className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
            >
              Resort Guest Policy
            </Link>{" "}
            and{" "}
            <Link
              to="/room-policy"
              className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
            >
              Room Policy
            </Link>
            .
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-10">
          <Section title={resortGuestSummary.title}>
            <BulletList items={resortGuestSummary.items} />
          </Section>
          <Section title={roomPolicySummary.title}>
            <BulletList items={roomPolicySummary.items} />
          </Section>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-8">
        Questions?{" "}
        <Link
          to="/contact"
          className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
        >
          Contact us
        </Link>
        {" · "}
        <Link
          to="/booking-process"
          className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
        >
          Continue booking
        </Link>
      </p>
    </div>
  );
}
