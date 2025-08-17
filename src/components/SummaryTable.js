import React, { useState } from 'react';

const SummaryTable = ({ selectedServices, onRemoveService, onLoadPreset }) => {
  // Preset logic (global for all selected services)
  const localStorageKey = `fee-presets-summary`;
  const [presets, setPresets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(localStorageKey)) || [];
    } catch {
      return [];
    }
  });
  const [presetName, setPresetName] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Save preset
  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    // Prevent saving if all fields are empty or zero
    if (!selectedServices || selectedServices.length === 0) return;
    const allEmpty = selectedServices.every(s =>
      (!s.professionalFee || s.professionalFee === 0) && (!s.miscFee || s.miscFee === 0)
    );
    if (allEmpty) return;
    const newPreset = {
      name: presetName.trim(),
      services: selectedServices
    };
    const updated = [...presets.filter(p => p.name !== newPreset.name), newPreset];
    setPresets(updated);
    localStorage.setItem(localStorageKey, JSON.stringify(updated));
    setPresetName("");
  };

  // Load preset
  const handleLoadPreset = (name) => {
    const preset = presets.find(p => p.name === name);
    if (preset && preset.services && typeof onLoadPreset === 'function') {
      onLoadPreset(preset.services);
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
  if (selectedServices.length === 0) return null;

  return (
  <div className="card-gradient rounded-2xl border border-white/10 overflow-hidden mb-8 animate-fade-in-up">
    {/* Preset Controls */}
    <div className="flex flex-wrap gap-2 p-4 items-center">
      <input
        type="text"
        placeholder="Preset name"
        value={presetName}
        onChange={e => setPresetName(e.target.value)}
        className="p-2 rounded border border-white/20 bg-white/10 text-gray-200 w-40"
      />
      <button
        onClick={handleSavePreset}
        className={`px-3 py-2 rounded font-semibold transition ${!presetName.trim() ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
        disabled={!presetName.trim()}
      >Save Preset</button>
      {presets.length > 0 && (
        <>
          <select
            value={selectedPreset || ""}
            onChange={e => handleLoadPreset(e.target.value)}
            className="p-2 rounded border border-white/20 bg-white/10 text-gray-200"
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
      <h3 className="text-lg font-semibold p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-white/10 text-gray-100">Selected Services</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">No.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Service</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Official Fee (₹)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Professional Fee (₹)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Reimbursement (₹)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Total (₹)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {selectedServices.map((item, index) => (
              <tr key={index} className="bg-white/5 hover:bg-white/10 transition-colors duration-200">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{index + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-200">
                  {item.subservice.name}
                  {item.subservice.description && (
                    <div className="text-xs text-gray-400 mt-1">{item.subservice.description}</div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {item.service.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200 text-right">
                  ₹{item.officialFee.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200 text-right">
                  ₹{item.professionalFee.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200 text-right">
                  ₹{item.miscFee.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-200 text-right">
                  ₹{item.total.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <button 
                    onClick={() => onRemoveService(index)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200 font-medium"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;