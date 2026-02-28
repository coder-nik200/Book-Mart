import React from "react";
import { FaBook, FaShippingFast, FaSmile } from "react-icons/fa";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-extrabold mb-6"
          >
            About BookMart
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-lg md:text-xl max-w-3xl mx-auto"
          >
            Your one-stop online bookstore for all your reading adventures. At
            BookMart, we bring your favorite books closer to you with ease and
            convenience.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-semibold mb-6"
          >
            Our Mission
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-700 text-lg leading-relaxed"
          >
            At BookMart, our mission is to ignite a love for reading by
            providing easy access to a wide range of books. Whether you are
            looking for the latest bestseller, a classic novel, or educational
            materials, we make reading accessible and enjoyable for everyone.
          </motion.p>
        </div>
      </section>

      {/* Features / Values */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-10 text-center">
          {[
            {
              icon: <FaBook />,
              title: "Wide Selection",
              description:
                "Thousands of titles across all genres to satisfy every reader.",
            },
            {
              icon: <FaShippingFast />,
              title: "Fast Delivery",
              description:
                "Quick and reliable shipping, right to your doorstep.",
            },
            {
              icon: <FaSmile />,
              title: "Customer Satisfaction",
              description:
                "We prioritize our customers with excellent support and service.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="p-6 rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <div className="text-blue-600 text-4xl mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-semibold mb-12"
          >
            What Our Readers Say
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alice",
                feedback: "BookMart has the best collection and fast delivery!",
              },
              {
                name: "John",
                feedback:
                  "I love the easy navigation and amazing customer service.",
              },
              {
                name: "Sophie",
                feedback: "A paradise for book lovers. Highly recommended!",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition"
              >
                <p className="text-gray-700 italic mb-4">
                  "{testimonial.feedback}"
                </p>
                <h4 className="font-semibold text-blue-600">
                  {testimonial.name}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold mb-6"
        >
          Join Our Reading Community
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-8 text-lg md:text-xl max-w-2xl mx-auto"
        >
          Explore our collection and find your next favorite book today.
        </motion.p>
        <motion.a
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          href="/books"
          className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          Browse Books
        </motion.a>
      </section>
    </div>
  );
};

export default AboutPage;
