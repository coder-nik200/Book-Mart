import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">

          <div>
            <h3 className="text-2xl font-bold text-white mb-4">📚 BookMart</h3>

            <p className="text-sm leading-relaxed text-gray-400">
              Your one-stop destination for discovering amazing books. Explore
              bestsellers, new arrivals, and timeless classics curated for every
              reader.
            </p>
          </div>


          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/books"
                  className="hover:text-yellow-400 hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Browse Books
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="hover:text-yellow-400 hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/books?sort=popularity"
                  className="hover:text-yellow-400 hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  to="/books?sort=newest"
                  className="hover:text-yellow-400 hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Customer Service
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-400 hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-400 hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-400 hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-400 hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>


          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Contact Us
            </h3>

            <div className="space-y-4 text-sm text-gray-400">
              <a
                href="tel:+919988261955"
                className="flex items-center gap-3 hover:text-white transition"
              >
                <Phone size={18} />
                <span>+91 9988261955</span>
              </a>

              <a
                href="mailto:codesnippet17@gmail.com"
                className="flex items-center gap-3 hover:text-white transition"
              >
                <Mail size={18} />
                <span>codesnippet17@gmail.com</span>
              </a>

              <a
                href="https://maps.google.com/?q=New+Preet+Nagar,+Amritsar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-white transition"
              >
                <MapPin size={18} />
                <span>New Preet Nagar, Amritsar</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-10 mb-10">
          <div className="flex justify-center gap-6">
            <a
              href="https://www.instagram.com/wohh.nitish"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-3 rounded-full bg-white/5 hover:bg-yellow-400 hover:text-black transition duration-300"
            >
              <Instagram size={20} />
            </a>

            <a
              href="https://x.com/code_Bharti07"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="p-3 rounded-full bg-white/5 hover:bg-yellow-400 hover:text-black transition duration-300"
            >
              <Twitter size={20} />
            </a>

            <a
              href="https://github.com/coder-nik200"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-3 rounded-full bg-white/5 hover:bg-yellow-400 hover:text-black transition duration-300"
            >
              <Github size={20} />
            </a>

            <a
              href="https://www.linkedin.com/in/nitish-kumar-bharti-631a37359/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-3 rounded-full bg-white/5 hover:bg-yellow-400 hover:text-black transition duration-300"
            >
              <Linkedin size={20} />
            </a>

            <a
              href="mailto:codesnippet17@gmail.com"
              aria-label="Email"
              className="p-3 rounded-full bg-white/5 hover:bg-yellow-400 hover:text-black transition duration-300"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>


        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} BookMart. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
