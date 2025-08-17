import React, { useState, useEffect } from "react";
import '../../src/blink.css';
import { motion, AnimatePresence } from "framer-motion";

const expandAnim = {
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  collapsed: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

// Prevent body scroll when modal is open
const usePreventScroll = (isOpen) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
};

const ServiceCard = ({ service, onSelectSubservice, selectedServices }) => {
  const [expanded, setExpanded] = useState(false);
  usePreventScroll(expanded);
  const [fees, setFees] = useState(
    service.subservices.map(sub => ({
      professionalFee: 0,
      reimbursement: 0
    }))
  );

  // Preset logic
  const localStorageKey = `fee-presets-${service.id}`;
  const [presets, setPresets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(localStorageKey)) || [];
    } catch {
      return [];
    }
  });
  const [presetName, setPresetName] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Must be after fees is defined
  const allFieldsEmpty = Array.isArray(fees) && fees.every(f =>
    (!f.professionalFee || f.professionalFee === 0) && (!f.reimbursement || f.reimbursement === 0)
  );

  const handleSavePreset = () => {
    if (!presetName.trim() || allFieldsEmpty) return;
    const newPreset = {
      name: presetName.trim(),
      fees: fees
    };
    const updated = [...presets.filter(p => p.name !== newPreset.name), newPreset];
    setPresets(updated);
    localStorage.setItem(localStorageKey, JSON.stringify(updated));
    setPresetName("");
  };

  // Load preset
  const handleLoadPreset = (name) => {
    const preset = presets.find(p => p.name === name);
    if (preset && Array.isArray(preset.fees)) {
      setFees(preset.fees.map(f => ({
        professionalFee: f.professionalFee || 0,
        reimbursement: f.reimbursement || 0
      })));
      setSelectedPreset(name);
    }
  };

  // Delete preset
  const handleDeletePreset = (name) => {
    const updated = presets.filter(p => p.name !== name);
    setPresets(updated);
    localStorage.setItem(localStorageKey, JSON.stringify(updated));
    if (selectedPreset === name) setSelectedPreset(null);
  };

  // Blink state for each row
  const [blinkRows, setBlinkRows] = useState(service.subservices.map(() => false));

  // Helper to trigger blink for a row
  const triggerBlink = (idx) => {
    setBlinkRows(prev => {
      const updated = [...prev];
      updated[idx] = false;
      return updated;
    });
    setTimeout(() => {
      setBlinkRows(prev => {
        const updated = [...prev];
        updated[idx] = true;
        return updated;
      });
    }, 10);
    setTimeout(() => {
      setBlinkRows(prev => {
        const updated = [...prev];
        updated[idx] = false;
        return updated;
      });
    }, 510);
  };

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
        className="card-gradient p-7 rounded-3xl border border-white/10 cursor-pointer flex flex-col items-center justify-center w-[200px] h-[180px] transition-all duration-300 group"
        onClick={() => setExpanded(true)}
        whileHover={{
          scale: 1.02,
          y: -3,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        layout
      >
        {service.icon && (
          <span className="text-4xl mb-2 drop-shadow-sm">
            {service.icon}
          </span>
        )}
        <h3 className="text-xl font-bold text-gray-100 text-center tracking-tight mb-1">
          {service.name}
        </h3>
        {service.description && (
          <p className="text-sm text-gray-400 text-center font-medium mb-1">
            {service.description}
          </p>
        )}
      </motion.div>

      {/* Expanded View */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="expand"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overscroll-none"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={expandAnim}
            style={{ overflow: "hidden" }}
            onClick={(e) => e.target === e.currentTarget && setExpanded(false)}
          >
            <div
              className="card-gradient rounded-3xl shadow-2xl border border-white/10 w-full max-w-[90vw] max-h-[85vh] p-6 relative flex flex-col"
              style={{ overflowY: 'auto', scrollbarGutter: 'stable' }}
            >
              <div className="w-full relative">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-amber-400 text-center mb-2">Select Subservices</h3>
                  <p className="text-sm text-gray-400 text-center">Click the checklist to select or deselect subservices. Selected items are highlighted below and in the table.</p>
                </div>
                {/* Selected summary */}
                {service.subservices.some(isSubserviceSelected) && (
                  <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg flex flex-wrap gap-2 items-center justify-center">
                    <span className="font-semibold text-green-400">Selected:</span>
                    {service.subservices.map((sub, idx) =>
                      isSubserviceSelected(sub) ? (
                        <span key={idx} className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs border border-green-500/30 flex items-center gap-1">
                          <span className="text-green-400">&#10003;</span> {sub.name}
                        </span>
                      ) : null
                    )}
                  </div>
                )}
                {/* Preset Controls */}
                <div className="flex flex-wrap gap-2 mb-3 items-center">
                  <input
                    type="text"
                    placeholder="Preset name"
                    value={presetName}
                    onChange={e => setPresetName(e.target.value)}
                    className="p-2 rounded border border-white/20 bg-white/10 text-gray-200 w-40"
                  />
                  <button
                    onClick={handleSavePreset}
                    className={`px-3 py-2 rounded font-semibold transition ${(!presetName.trim() || allFieldsEmpty) ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
                    disabled={!presetName.trim() || allFieldsEmpty}
                  >Save Preset</button>
                  {presets.length > 0 && (
                    <>
                      <select
                        value={selectedPreset || ""}
                        onChange={e => handleLoadPreset(e.target.value)}
                        className="p-2 rounded border border-white/20 bg-white/10 text-white font-semibold"
                        style={{ color: '#fff', backgroundColor: 'rgba(30,30,30,0.95)' }}
                      >
                        <option value="">Load Preset</option>
                        {presets.map(p => (
                          <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                      {selectedPreset && (
                        <button
                          onClick={() => handleDeletePreset(selectedPreset)}
                          className="ml-2 px-2 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600"
                        >Delete</button>
                      )}
                    </>
                  )}
                </div>
                <table className="min-w-full text-base rounded-2xl overflow-hidden border border-white/10">
                  <thead className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 sticky top-0 z-10 border-b border-white/10">
                    <tr>
                      <th className="px-5 py-3 text-left font-bold text-gray-200 uppercase tracking-wider">Particulars</th>
                      <th className="px-5 py-3 text-left font-bold text-gray-200 uppercase tracking-wider">Official Fee (₹)</th>
                      <th className="px-5 py-3 text-left font-bold text-gray-200 uppercase tracking-wider">Professional Fee (₹)</th>
                      <th className="px-5 py-3 text-left font-bold text-gray-200 uppercase tracking-wider">Reimbursement (₹)</th>
                      <th className="px-5 py-3 text-left font-bold text-gray-200 uppercase tracking-wider">Total (₹)</th>
                      <th className="px-5 py-3 text-left font-bold text-gray-200 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {service.subservices.map((sub, idx) => {
                      return (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className={`transition-colors duration-200 ${isSubserviceSelected(sub) ? 'bg-green-900/20 border-l-4 border-green-500' : (idx % 2 === 0 ? 'bg-white/5' : 'bg-white/10')} hover:bg-white/20 ${blinkRows[idx] ? 'blink-bg' : ''}`}
                        >
                          <td className="px-5 py-3 font-medium text-gray-200">{sub.name}</td>
                          <td className="px-5 py-3 text-gray-300 font-semibold">{sub.officialFee}</td>
                          <td className="px-5 py-3">
                            <input
                              type="number"
                              value={fees[idx]?.professionalFee || ""}
                              onChange={e => handleFeeChange(idx, "professionalFee", e.target.value)}
                              className={`w-24 p-2 border rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-white/10 shadow-sm text-gray-200 border-white/20`}
                              min="0"
                            />
                          </td>
                          <td className="px-5 py-3">
                            <input
                              type="number"
                              value={fees[idx]?.reimbursement || ""}
                              onChange={e => handleFeeChange(idx, "reimbursement", e.target.value)}
                              className={`w-24 p-2 border rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-white/10 shadow-sm text-gray-200 border-white/20`}
                              min="0"
                              aria-label="Reimbursement"
                            />
                          </td>
                          <td className="px-5 py-3 font-bold text-amber-400">
                            {getTotal(idx, sub.officialFee)}
                          </td>
                          <td className="px-5 py-3">
                            <button
                              className={`px-4 py-2 rounded-lg font-semibold shadow transition-all duration-300 flex items-center gap-2
                              ${isSubserviceSelected(sub) ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'}
                              ${(!isSubserviceSelected(sub) && (!fees[idx]?.professionalFee && !fees[idx]?.reimbursement)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={() => {
                                if (!isSubserviceSelected(sub) && (!fees[idx]?.professionalFee && !fees[idx]?.reimbursement)) return;
                                onSelectSubservice(service, {
                                  ...sub,
                                  officialFee: sub.officialFee,
                                  professionalFee: fees[idx].professionalFee,
                                  reimbursement: fees[idx].reimbursement,
                                  miscFee: fees[idx].reimbursement, // for compatibility
                                  total: Number(sub.officialFee) + Number(fees[idx].professionalFee) + Number(fees[idx].reimbursement)
                                });
                                if (isSubserviceSelected(sub)) triggerBlink(idx);
                              }}
                              title={isSubserviceSelected(sub) ? 'Change values' : 'Add as service'}
                              disabled={!isSubserviceSelected(sub) && (!fees[idx]?.professionalFee && !fees[idx]?.reimbursement)}
                            >
                              {isSubserviceSelected(sub)
                                ? (<><span className="w-5 h-5 flex items-center justify-center bg-white rounded-full text-green-600 font-bold border border-green-400">&#10003;</span> Change</>)
                                : (<><span className="w-5 h-5 flex items-center justify-center bg-white rounded-full text-blue-600 font-bold border border-blue-400">+</span> Add</>)}
                            </button>
                            {editState[idx].error && (
                              <div className="text-xs text-red-600 mt-1">{editState[idx].error}</div>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {service.note && (
                <motion.div
                  className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="font-semibold text-amber-400">Note:</span> {service.note}
                </motion.div>
              )}

              <button
                className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-white font-bold bg-white/10 hover:bg-white/20 rounded-full shadow-lg p-1 z-10 transition-colors duration-200"
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
