import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Instant Quotes",
    description: "Generate accurate IP service quotations in seconds",
    icon: "⚡",
    color: "from-stone-500 to-stone-700"
  },
  {
    title: "Multi-IP Support",
    description: "Patents, Trademarks, Copyrights & Designs in one place",
    icon: "📜",
    color: "from-neutral-500 to-neutral-700"
  },
  {
    title: "Professional Documents",
    description: "Download ready-to-use quotation documents",
    icon: "📄",
    color: "from-zinc-500 to-zinc-700"
  }
];

const FloatingShape = ({ className, animation }) => (
  <motion.div
    className={`absolute rounded-full filter blur-xl opacity-20 ${className}`}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0]
    }}
    transition={{
      duration: animation === "slow" ? 15 : animation === "medium" ? 10 : 7,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
  />
);

const FeatureCard = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.15, duration: 0.5 }}
    whileHover={{ y: -10 }}
    className={`bg-gradient-to-br ${feature.color} p-8 rounded-3xl shadow-xl text-white`}
  >
    <div className="text-5xl mb-4">{feature.icon}</div>
    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
    <p className="opacity-90">{feature.description}</p>
  </motion.div>
);

const LandingPage = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Floating background shapes */}
      <FloatingShape className="w-64 h-64 bg-stone-300 top-20 left-10" animation="slow" />
      <FloatingShape className="w-96 h-96 bg-neutral-300 bottom-20 right-20" animation="medium" />
      <FloatingShape className="w-80 h-80 bg-zinc-300 top-1/3 right-1/4" animation="fast" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <section className="text-center py-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-stone-600 to-neutral-700">
              IP Quotation Made Simple
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto mb-10"
          >
            Generate professional IP service quotations in minutes, not hours
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center"
          >
            <button
              onClick={onStart}
              className="bg-gradient-to-r from-stone-600 to-neutral-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Get Started Free
            </button>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 mb-12"
          >
            Why Choose Our Solution
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white rounded-3xl shadow-lg px-8 mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start mb-6">
                <div className="bg-stone-100 text-stone-600 rounded-full w-10 h-10 flex items-center justify-center mr-4 font-bold">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Select Services</h3>
                  <p className="text-neutral-600">Choose from our comprehensive IP service catalog</p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="bg-stone-100 text-stone-600 rounded-full w-10 h-10 flex items-center justify-center mr-4 font-bold">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Enter Client Details</h3>
                  <p className="text-neutral-600">Add your client information for personalized quotes</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-stone-100 text-stone-600 rounded-full w-10 h-10 flex items-center justify-center mr-4 font-bold">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Generate & Download</h3>
                  <p className="text-neutral-600">Get professional documents ready for client delivery</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex-1 bg-gray-100 rounded-2xl"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Placeholder for screenshot or illustration */}
              <div className="h-full flex items-center justify-center text-neutral-400">
                <div className="text-center p-8">
                  <div className="text-5xl mb-4">📊</div>
                  <p>Interactive Service Selection</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-stone-600 to-neutral-700 rounded-3xl p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your IP Workflow?</h2>
            <p className="text-xl mb-8 opacity-90">Start creating professional quotes today</p>
            <button
              onClick={onStart}
              className="bg-white text-stone-700 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Start Generating Quotes Now
            </button>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;