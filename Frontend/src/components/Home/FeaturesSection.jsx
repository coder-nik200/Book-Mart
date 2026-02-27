import { Truck, ShieldCheck, RotateCcw } from "lucide-react";

const features = [
  {
    icon: <Truck size={40} />,
    title: "Free Shipping",
    desc: "Enjoy free shipping on orders above $50 anywhere in the country.",
  },
  {
    icon: <ShieldCheck size={40} />,
    title: "Secure Payment",
    desc: "Your transactions are fully encrypted and 100% secure.",
  },
  {
    icon: <RotateCcw size={40} />,
    title: "Easy Returns",
    desc: "Not satisfied? Return within 30 days hassle-free.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-24 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Shop With Us?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We provide the best online book shopping experience with secure
            payments, fast delivery, and easy returns.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-10 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 hover:-translate-y-3 transition-all duration-500 text-center"
            >
              <div className="flex justify-center mb-6 text-blue-400 group-hover:scale-110 transition duration-300">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>

              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
