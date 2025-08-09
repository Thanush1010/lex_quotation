import React from 'react';

const SummaryTable = ({ selectedServices, onRemoveService }) => {
  if (selectedServices.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 animate-fade-in">
      <h3 className="text-lg font-semibold p-4 bg-gray-100 border-b">Selected Services</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Official Fee (₹)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Professional Fee (₹)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses (₹)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total (₹)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {selectedServices.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.subservice.name}
                  {item.subservice.description && (
                    <div className="text-xs text-gray-500 mt-1">{item.subservice.description}</div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {item.service.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                  ₹{item.officialFee.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                  ₹{item.professionalFee.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                  ₹{item.miscFee.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                  ₹{item.total.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <button 
                    onClick={() => onRemoveService(index)}
                    className="text-red-600 hover:text-red-900 transition-colors font-medium"
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