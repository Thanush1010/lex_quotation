import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ClientForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    clientName: '',
    clientAddress: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card-gradient rounded-3xl border border-white/10 p-8 mb-8 max-w-2xl mx-auto w-full"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Client Details
        </h3>
        <p className="text-gray-400 mt-2">Please provide your client's information for the quotation</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Name*</label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-gray-200 placeholder-gray-500 transition-all duration-300"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Address*</label>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            name="clientAddress"
            value={formData.clientAddress}
            onChange={handleChange}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-gray-200 placeholder-gray-500 transition-all duration-300"
            rows="3"
            placeholder="Enter your complete address"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-all duration-300"
          >
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Continue to Summary
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default ClientForm;