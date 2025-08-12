import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const expandAnim = {
  open: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  collapsed: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

const ServiceCard = ({ service, onSelectSubservice, selectedServices }) => {
  const [expanded, setExpanded] = useState(false);
  const [fees, setFees] = useState(
    service.subservices.map(sub => ({
      professionalFee: 0,
  reimbursement: 0
    }))
  );

  const [editState, setEditState] = useState(
    service.subservices.map(() => ({
      stage: 'idle', // idle | editing | confirmed
      error: ''
    }))
  );

  const handleFeeChange = (index, field, value) => {
    const updatedFees = [...fees];
    updatedFees[index][field] = Number(value) || 0;
    setFees(updatedFees);
    // Clear error on change
    setEditState(prev => prev.map((s, i) => i === index ? { ...s, error: '' } : s));
  };

  const getTotal = (index, officialFee) => {
    return (
      Number(officialFee) +
      Number(fees[index]?.professionalFee || 0) +
  Number(fees[index]?.reimbursement || 0)
    );
  };

  // Use selectedServices from props to determine checklist state
  const isSubserviceSelected = (sub) => {
    return (
      selectedServices &&
      selectedServices.some(
        (s) => s.service.id === service.id && s.subservice.name === sub.name
      )
    );
  };

  const handleChecklistToggle = (sub, idx) => {
    if (editState[idx].stage === 'idle') {
      // Start editing
      setEditState(prev => prev.map((s, i) => i === idx ? { ...s, stage: 'editing', error: '' } : s));
    } else if (editState[idx].stage === 'editing') {
      // Validate
      const fee = fees[idx];
      if (fee.professionalFee <= 0 || fee.reimbursement < 0) {
        setEditState(prev => prev.map((s, i) => i === idx ? { ...s, error: 'Enter valid fee values' } : s));
        return;
      }
      // Confirm selection and pass current values
      onSelectSubservice(service, {
        ...sub,
        officialFee: sub.officialFee,
        professionalFee: fee.professionalFee,
        reimbursement: fee.reimbursement,
        miscFee: fee.reimbursement, // for compatibility
        total: Number(sub.officialFee) + Number(fee.professionalFee) + Number(fee.reimbursement)
      });
      setEditState(prev => prev.map((s, i) => i === idx ? { ...s, stage: 'confirmed', error: '' } : s));
    } else if (editState[idx].stage === 'confirmed') {
      // Allow change
      setEditState(prev => prev.map((s, i) => i === idx ? { ...s, stage: 'editing', error: '' } : s));
    }
  };

  return (
    <>
      {/* Card View */}
      <motion.div
        className="relative bg-white bg-opacity-90 p-7 rounded-3xl shadow-xl border-2 border-transparent cursor-pointer flex flex-col items-center justify-center min-w-[180px] max-w-[240px] w-full mb-2 transition-all duration-300 group hover:scale-105 hover:shadow-2xl hover:border-blue-300"
        style={{ boxShadow: '0 4px 32px 0 rgba(24,90,219,0.08)' }}
        onClick={() => setExpanded(true)}
        whileHover={{ scale: 1.07 }}
      >
        {service.icon && (
          <span className="text-4xl mb-2 drop-shadow-sm">
            {service.icon}
          </span>
        )}
        <h3 className="text-xl font-extrabold text-blue-700 text-center tracking-tight mb-1 group-hover:text-blue-800">
          {service.name}
        </h3>
        {service.description && (
          <p className="text-xs text-blue-400 text-center font-medium mb-1">
            {service.description}
          </p>
        )}
      </motion.div>

      {/* Expanded View */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="expand"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={expandAnim}
            style={{ overflow: "auto" }}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl border-2 border-blue-200 w-full max-w-[95vw] max-h-[90vh] p-6 relative flex flex-col"
            >
              <div className="w-full overflow-auto">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-blue-800 text-center">Select Subservices</h3>
                  <p className="text-sm text-blue-500 text-center">Click the checklist to select or deselect subservices. Selected items are highlighted below and in the table.</p>
                </div>
                {/* Selected summary */}
                {service.subservices.some(isSubserviceSelected) && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex flex-wrap gap-2 items-center justify-center">
                    <span className="font-semibold text-green-700">Selected:</span>
                    {service.subservices.map((sub, idx) =>
                      isSubserviceSelected(sub) ? (
                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs border border-green-300 flex items-center gap-1">
                          <span className="text-green-600">&#10003;</span> {sub.name}
                        </span>
                      ) : null
                    )}
                  </div>
                )}
                <table className="min-w-full text-base rounded-2xl overflow-hidden shadow border border-blue-100">
                  <thead className="bg-gradient-to-r from-blue-50 to-blue-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-5 py-3 text-left font-bold text-blue-700 uppercase tracking-wider">Particulars</th>
                      <th className="px-5 py-3 text-left font-bold text-blue-700 uppercase tracking-wider">Official Fee (₹)</th>
                      <th className="px-5 py-3 text-left font-bold text-blue-700 uppercase tracking-wider">Professional Fee (₹)</th>
                      <th className="px-5 py-3 text-left font-bold text-blue-700 uppercase tracking-wider">Reimbursement (₹)</th>
                      <th className="px-5 py-3 text-left font-bold text-blue-700 uppercase tracking-wider">Total (₹)</th>
                      <th className="px-5 py-3 text-left font-bold text-blue-700 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {service.subservices.map((sub, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className={
                          `transition-colors duration-200 ${isSubserviceSelected(sub) ? 'bg-green-50 border-l-4 border-green-400' : (idx % 2 === 0 ? 'bg-white' : 'bg-blue-50')} hover:bg-blue-100`
                        }
                      >
                        <td className="px-5 py-3 font-medium text-blue-900">{sub.name}</td>
                        <td className="px-5 py-3 text-blue-700 font-semibold">{sub.officialFee}</td>
                        <td className="px-5 py-3">
                          <input
                            type="number"
                            value={fees[idx]?.professionalFee || ""}
                            onChange={e => handleFeeChange(idx, "professionalFee", e.target.value)}
                            className={`w-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white shadow-sm ${editState[idx].stage === 'confirmed' ? 'border-green-300 bg-green-50 text-green-700' : 'border-blue-200'}`}
                            min="0"
                            disabled={editState[idx].stage !== 'editing'}
                          />
                        </td>
                        <td className="px-5 py-3">
                          <input
                            type="number"
                            value={fees[idx]?.reimbursement || ""}
                            onChange={e => handleFeeChange(idx, "reimbursement", e.target.value)}
                            className={`w-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white shadow-sm ${editState[idx].stage === 'confirmed' ? 'border-green-300 bg-green-50 text-green-700' : 'border-blue-200'}`}
                            min="0"
                            aria-label="Reimbursement"
                            disabled={editState[idx].stage !== 'editing'}
                          />
                        </td>
                        <td className="px-5 py-3 font-bold text-blue-800">
                          {getTotal(idx, sub.officialFee)}
                        </td>
                        <td className="px-5 py-3">
                          <button
                            className={`px-4 py-2 rounded-lg font-semibold shadow transition-all duration-200 flex items-center gap-2
                              ${editState[idx].stage === 'idle' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white' : ''}
                              ${editState[idx].stage === 'editing' ? 'bg-yellow-500 text-white hover:bg-yellow-600' : ''}
                              ${editState[idx].stage === 'confirmed' ? 'bg-green-500 text-white hover:bg-green-600' : ''}`}
                            onClick={() => handleChecklistToggle(sub, idx)}
                            title={
                              editState[idx].stage === 'idle' ? 'Add and enter values' :
                              editState[idx].stage === 'editing' ? 'Confirm selection' :
                              'Change values'
                            }
                          >
                            {editState[idx].stage === 'idle' && (<><span className="w-5 h-5 flex items-center justify-center bg-white rounded-full text-blue-600 font-bold border border-blue-400">+</span> Add</>)}
                            {editState[idx].stage === 'editing' && (<><span className="w-5 h-5 flex items-center justify-center bg-white rounded-full text-yellow-600 font-bold border border-yellow-400">✎</span> Confirm</>)}
                            {editState[idx].stage === 'confirmed' && (<><span className="w-5 h-5 flex items-center justify-center bg-white rounded-full text-green-600 font-bold border border-green-400">&#10003;</span> Change</>)}
                          </button>
                          {editState[idx].error && (
                            <div className="text-xs text-red-600 mt-1">{editState[idx].error}</div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {service.note && (
                <motion.div
                  className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="font-semibold">Note:</span> {service.note}
                </motion.div>
              )}

              <button
                className="absolute top-3 right-4 text-2xl text-blue-400 hover:text-blue-700 font-bold bg-white rounded-full shadow p-1 z-10"
                onClick={() => setExpanded(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ServiceCard;
