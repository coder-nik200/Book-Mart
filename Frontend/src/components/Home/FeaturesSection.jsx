import { Truck, ShieldCheck, RotateCcw } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "Enjoy free shipping on orders above $50 anywhere in the country.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "Your transactions are fully encrypted and 100% secure.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "Not satisfied? Return within 30 days hassle-free.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-16 sm:py-20 lg:py-24 mt-16">

      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        {/* ================= HEADING ================= */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Why Shop With Us?
          </h2>

          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            We provide the best online book shopping experience with secure
            payments, fast delivery, and easy returns.
          </p>
        </div>

        {/* ================= FEATURES GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-10">
          {features.map(({ icon: Icon, title, desc }, index) => (
            <div
              key={index}
              className="group relative p-8 sm:p-10 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 hover:-translate-y-2 hover:shadow-xl transition-all duration-500 text-center"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6 text-blue-400 transition-transform duration-300 group-hover:scale-110">
                <Icon size={42} />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                {title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                {desc}
              </p>

              {/* Soft Glow Hover Effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 bg-blue-500/5 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;