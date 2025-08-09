import React, { useState } from 'react';

const ServiceCard = ({ service, onFeeUpdate, onSelectSubservice }) => {
  const [expanded, setExpanded] = useState(false);
  const [editableFees, setEditableFees] = useState({});

  const handleFeeChange = (index, field, value) => {
    const numericValue = value === '' ? '' : Number(value);
    if (value !== '' && isNaN(numericValue)) return;

    const newEditableFees = { ...editableFees };
    if (!newEditableFees[index]) newEditableFees[index] = {};
    newEditableFees[index][field] = value;
    setEditableFees(newEditableFees);

    onFeeUpdate(service.id, index, field, value === '' ? null : Number(value));
  };

  const calculateTotal = (subservice, index) => {
    const official = subservice.officialFee || 0;
    const professional = editableFees[index]?.professionalFee ?? subservice.professionalFee ?? 0;
    const misc = editableFees[index]?.miscFee ?? subservice.miscFee ?? 0;
    return Number(official) + Number(professional) + Number(misc);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 mb-6 ${expanded ? 'ring-2 ring-blue-200' : ''}`}>
      <div 
        className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <span className="text-3xl mr-4">{service.icon}</span>
          <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
        </div>
        <span className="text-gray-500 transition-transform duration-300">
          {expanded ? '▲' : '▼'}
        </span>
      </div>

      {expanded && (
        <div className="px-6 pb-6 space-y-4 animate-fade-in">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Particulars</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Official Fee (₹)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professional Fee (₹)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">reimbursement (₹)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (₹)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {service.subservices.map((subservice, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{subservice.name}</div>
                      {subservice.description && (
                        <div className="text-xs text-gray-500 mt-1">{subservice.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="text"
                        value={subservice.officialFee}
                        readOnly
                        className="w-full bg-gray-100 p-2 rounded text-sm border-none"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        value={editableFees[idx]?.professionalFee ?? ''}
                        onChange={(e) => handleFeeChange(idx, 'professionalFee', e.target.value)}
                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        placeholder="Enter"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        value={editableFees[idx]?.miscFee ?? ''}
                        onChange={(e) => handleFeeChange(idx, 'miscFee', e.target.value)}
                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        placeholder="Enter"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      ₹{calculateTotal(subservice, idx).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        className="text-blue-600 underline text-xs hover:text-blue-800"
                        onClick={() =>
                          onSelectSubservice(
                            service,
                            {
                              ...subservice,
                              professionalFee: Number(editableFees[idx]?.professionalFee ?? 0),
                              miscFee: Number(editableFees[idx]?.miscFee ?? 0)
                            }
                          )
                        }
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {service.note && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gray-700">
              <span className="font-semibold">Note:</span> {service.note}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
