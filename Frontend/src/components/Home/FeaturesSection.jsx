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
    <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-14 sm:py-16 md:py-20 lg:py-24 mt-12 sm:mt-16">

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            Why Shop With Us?
          </h2>
          <p className="mt-3 sm:mt-4 text-gray-400 max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed px-4">
            We provide the best online book shopping experience with secure
            payments, fast delivery, and easy returns.
          </p>
        </div>

        {/* Feature cards — stacked on mobile, 3-col on md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 lg:gap-10">
          {features.map(({ icon: Icon, title, desc }, index) => (
            <div
              key={index}
              className="group relative p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-xl transition-all duration-500 text-center"
            >
              <div className="flex justify-center mb-4 sm:mb-6 text-blue-400 transition-transform duration-300 group-hover:scale-110">
                <Icon size={36} className="sm:hidden" />
                <Icon size={42} className="hidden sm:block" />
              </div>

              <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3">
                {title}
              </h3>

              <p className="text-gray-400 text-xs sm:text-sm lg:text-base leading-relaxed">
                {desc}
              </p>

              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 bg-blue-500/5 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;