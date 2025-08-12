import React from "react";
import { motion } from "framer-motion";
import Footer from "../pages/Footer";

// Custom styles for dark theme
const spaceStyles = `
  .dark-theme {
    background: linear-gradient(to bottom, #0B0E18, #151B2C);
  }
  
  .glow {
    box-shadow: 0 0 20px rgba(255, 177, 51, 0.1);
  }
  
  .card-gradient {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
    backdrop-filter: blur(10px);
  }
`;

const features = [
  {
    title: "Instant Quotes",
    description: "Generate accurate IP service quotations in seconds",
    icon: "⚡",
    color: "from-amber-500/20 to-amber-600/20"
  },
  {
    title: "Multi-IP Support",
    description: "Patents, Trademarks, Copyrights & Designs in one place",
    icon: "📜",
    color: "from-orange-500/20 to-orange-600/20"
  },
  {
    title: "Professional Documents",
    description: "Download ready-to-use quotation documents",
    icon: "📄",
    color: "from-yellow-500/20 to-yellow-600/20"
  }
];

const FloatingShape = ({ className, animation }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      const moveAmount = animation === "slow" ? 25 : animation === "medium" ? 35 : 45;
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / moveAmount,
        y: (e.clientY - window.innerHeight / 2) / moveAmount
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [animation]);

  return (
    <motion.div
      className={`absolute rounded-full filter blur-xl opacity-15 ${className}`}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{
        type: "spring",
        stiffness: animation === "slow" ? 25 : animation === "medium" ? 35 : 45,
        damping: 35,
        mass: animation === "slow" ? 2 : animation === "medium" ? 1.5 : 1
      }}
    />
  );
};

const FeatureCard = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.2, duration: 0.8, ease: "easeOut" }}
    whileHover={{ 
      y: -8, 
      scale: 1.01,
      boxShadow: "0 15px 30px rgba(0,0,0,0.15)"
    }}
    className={`card-gradient bg-gradient-to-br ${feature.color} p-6 rounded-2xl border border-white/10 text-white cursor-pointer transition-all duration-500`}
  >
    <motion.div 
      className="text-4xl mb-4 text-amber-400"
      whileHover={{ scale: 1.2, rotate: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {feature.icon}
    </motion.div>
    <h3 className="text-xl font-bold mb-2 text-gray-100">{feature.title}</h3>
    <p className="text-gray-400">{feature.description}</p>
  </motion.div>
);

const LandingPage = ({ onStart }) => {
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = spaceStyles;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

  return (
    <div className="min-h-screen dark-theme relative overflow-hidden">
      {/* Floating background shapes */}
      <FloatingShape className="w-64 h-64 bg-amber-500/5 top-20 left-10" animation="slow" />
      <FloatingShape className="w-96 h-96 bg-orange-500/5 bottom-20 right-20" animation="medium" />
      <FloatingShape className="w-80 h-80 bg-yellow-500/5 top-1/3 right-1/4" animation="fast" />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center py-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
              IP Quotation Made Simple
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10"
          >
            Generate professional IP service quotations in minutes, not hours
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={onStart}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg glow relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
              />
              <span className="relative z-10">Get Started Free</span>
            </motion.button>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-3xl font-bold text-center text-gray-100 mb-10"
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
        <section className="py-20 card-gradient rounded-3xl border border-white/10 px-8 mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-100 mb-12">How It Works</h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start mb-6">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 font-bold glow">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-100">Select Services</h3>
                  <p className="text-gray-400">Choose from our comprehensive IP service catalog</p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 font-bold glow">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-100">Enter Client Details</h3>
                  <p className="text-gray-400">Add your client information for personalized quotes</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 font-bold glow">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-100">Generate & Download</h3>
                  <p className="text-gray-400">Get professional documents ready for client delivery</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex-1 card-gradient rounded-2xl border border-white/10"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Placeholder for screenshot or illustration */}
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center p-8">
                  <div className="text-5xl mb-4 text-amber-400">📊</div>
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
            className="card-gradient rounded-3xl p-12 text-white border border-white/10"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-100">Ready to Transform Your IP Workflow?</h2>
            <p className="text-xl mb-8 text-gray-400">Start creating professional quotes today</p>
            <motion.button
              onClick={onStart}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg glow relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
              />
              <span className="relative z-10">Start Generating Quotes Now</span>
            </motion.button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;