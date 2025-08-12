import React from 'react';

const SummaryTable = ({ selectedServices, onRemoveService }) => {
  if (selectedServices.length === 0) return null;

  return (
  <div className="card-gradient rounded-2xl border border-white/10 overflow-hidden mb-8 animate-fade-in-up">
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