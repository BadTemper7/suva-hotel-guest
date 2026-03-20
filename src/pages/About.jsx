// src/pages/guest/About.jsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

export default function About() {
  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: true, amount: 0.3 });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl overflow-hidden mb-16"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"
          alt="Suva's Place Resort"
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="text-white px-8 md:px-12 max-w-2xl">
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-2">
              Since 1971
            </p>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Having Fun Under the Sun
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              A legacy of hospitality and excellence spanning over five decades
            </p>
          </div>
        </div>
      </motion.div>

      {/* Story Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
      >
        <motion.div variants={fadeInUp}>
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Our Heritage
          </span>
          <h2 className="text-4xl font-bold mt-2 mb-6">
            The Suva's Place Story
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Suva's Place Resort was established in{" "}
              <span className="font-semibold text-gray-800">1971</span> by
              <span className="font-semibold text-gray-800">
                {" "}
                Mr. Jose Timbol Suva
              </span>
              . Originally named
              <span className="font-semibold text-gray-800">
                {" "}
                Pecina Dela Virgen Resort
              </span>
              , it was later changed to the family's last name, creating the
              beloved destination we know today.
            </p>
            <p>
              The resort's first amenity was the{" "}
              <span className="font-semibold text-gray-800">Main Pool</span>,
              which stands at an impressive{" "}
              <span className="font-semibold text-gray-800">10 feet deep</span>{" "}
              and features
              <span className="font-semibold text-gray-800">
                {" "}
                2 exciting slides and 1 diving board
              </span>
              . Two kiddie pools were added in subsequent years, making the
              resort a perfect destination for families.
            </p>
            <p>
              In <span className="font-semibold text-gray-800">1995</span>, the
              resort expanded with the addition of
              <span className="font-semibold text-gray-800">
                {" "}
                Semi Private Pool, Casas, and Cuartos
              </span>
              , enhancing the guest experience and providing more accommodation
              options.
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="relative">
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400"
              alt="Historic Suva's Place"
              className="rounded-xl h-48 object-cover shadow-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400"
              alt="Resort Heritage"
              className="rounded-xl h-48 object-cover shadow-lg mt-8"
            />
            <img
              src="https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=400"
              alt="Pool Area"
              className="rounded-xl h-48 object-cover shadow-lg -mt-4"
            />
            <img
              src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400"
              alt="Cottages"
              className="rounded-xl h-48 object-cover shadow-lg"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-20 blur-2xl"></div>
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        ref={statsRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={staggerContainer}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
      >
        {[
          { value: "50+", label: "Years of Excellence", icon: "🏆" },
          { value: "10+", label: "Pool Facilities", icon: "🏊" },
          { value: "20+", label: "Accommodations", icon: "🏠" },
          { value: "100k+", label: "Happy Guests", icon: "😊" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-sm"
          >
            <div className="text-4xl mb-3">{stat.icon}</div>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {isInView ? stat.value : "0"}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Mission & Vision */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
      >
        {/* Mission */}
        <motion.div
          variants={fadeInUp}
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-sm border border-amber-100"
        >
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Mission</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">✓</span>
              <span>
                To be the gateway place that everybody would want to spend their
                valuable time
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">✓</span>
              <span>To provide an excellent customer service</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">✓</span>
              <span>
                To offer an enjoyment that creates memories they will never
                forget
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">✓</span>
              <span>To meet the expectations and needs of each customer</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">✓</span>
              <span>To provide excellent customer satisfaction</span>
            </li>
          </ul>
        </motion.div>

        {/* Vision */}
        <motion.div
          variants={fadeInUp}
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-sm border border-blue-100"
        >
          <div className="text-4xl mb-4">👁️</div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Vision</h3>
          <div className="space-y-4 text-gray-700">
            <p>
              Our vision is to be recognized as the premier destination for joy
              and unforgettable experiences in the resort industry.
            </p>
            <p>
              We strive to create a vibrant atmosphere where fun and enjoyment
              are at the heart of every guest interaction.
            </p>
            <p>
              Committed to upholding our core values, we prioritize exceptional
              customer service, ensuring that each visitor feels valued and
              appreciated.
            </p>
            <p>
              Our goal is to cultivate lasting memories, making our resort the
              preferred choice for those seeking a remarkable escape.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Core Values */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="mb-20"
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            What Drives Us
          </span>
          <h2 className="text-4xl font-bold mt-2">Our Core Values</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            The principles that guide everything we do at Suva's Place Resort
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              icon: "🙏",
              title: "Respect",
              description:
                "Treating every guest and team member with dignity, courtesy, and consideration.",
              color: "from-purple-50 to-pink-50",
              iconColor: "text-purple-500",
              gradient: "from-purple-600 to-pink-600",
            },
            {
              icon: "💎",
              title: "Values",
              description:
                "Upholding integrity, honesty, and ethical standards in all our interactions.",
              color: "from-blue-50 to-cyan-50",
              iconColor: "text-blue-500",
              gradient: "from-blue-600 to-cyan-600",
            },
            {
              icon: "🤝",
              title: "Teamwork",
              description:
                "Working together collaboratively to create seamless and memorable guest experiences.",
              color: "from-green-50 to-emerald-50",
              iconColor: "text-green-500",
              gradient: "from-green-600 to-emerald-600",
            },
            {
              icon: "⭐",
              title: "Excellence",
              description:
                "Striving for the highest standards in service, facilities, and guest satisfaction.",
              color: "from-amber-50 to-orange-50",
              iconColor: "text-amber-500",
              gradient: "from-amber-600 to-orange-600",
            },
          ].map((value, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`bg-gradient-to-br ${value.color} p-6 rounded-2xl shadow-sm text-center group relative overflow-hidden`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>
              <div
                className={`text-5xl mb-4 ${value.iconColor} transform group-hover:scale-110 transition-transform duration-300`}
              >
                {value.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {value.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {value.description}
              </p>
              <div
                className={`mt-4 w-12 h-0.5 bg-gradient-to-r ${value.gradient} mx-auto rounded-full`}
              ></div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Future Plans Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="mb-20"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-purple-900 p-12 text-white">
          <div className="absolute inset-0 opacity-10">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="stars"
                  patternUnits="userSpaceOnUse"
                  width="20"
                  height="20"
                >
                  <circle cx="10" cy="10" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#stars)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Looking to the Future
            </h2>
            <p className="text-xl mb-6 opacity-90">
              By 2030, we're committed to elevating your experience
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Renovations and upgrades to existing facilities</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>New Bar & Restaurant with panoramic views</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Events Place for weddings and special occasions</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Luxury Suite Rooms for premium experiences</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Expansion to new locations in Antipolo City</span>
                </div>
              </div>
            </div>

            <p className="text-lg font-semibold mt-6 pt-6 border-t border-white/20">
              "Committed to providing excellent quality services, the most
              comfortable and affordable place to stay."
            </p>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="text-center bg-gradient-to-r from-amber-50 to-rose-50 rounded-2xl p-12"
      >
        <h2 className="text-3xl font-bold mb-4">
          Experience Suva's Place Today
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Whether you're looking for a relaxing getaway, a family vacation, or a
          memorable event, Suva's Place Resort is ready to welcome you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/rooms"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Book Your Stay
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl font-semibold transition-all duration-300"
          >
            Contact Us
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
