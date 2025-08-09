import React from 'react';

const TotalCalculation = ({ selectedServices }) => {
  if (selectedServices.length === 0) return null;

  const totals = selectedServices.reduce((acc, item) => {
    acc.total += item.total;
    acc.professionalFees += (item.professionalFee || 0);
    return acc;
  }, { total: 0, professionalFees: 0 });

  const gst = totals.professionalFees * 0.18;
  const tds = totals.professionalFees * 0.10;
  const grandTotal = totals.total + gst - tds;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
      <h3 className="text-lg font-semibold p-4 bg-gray-100 border-b">Final Calculation</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Subtotal</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹{totals.total.toLocaleString('en-IN')}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">GST (18%)</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹{gst.toLocaleString('en-IN')}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">TDS (10%)</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹{tds.toLocaleString('en-IN')}</td>
            </tr>
            <tr className="bg-gray-50 font-medium">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Grand Total</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">₹{grandTotal.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-blue-50 text-xs text-gray-700">
        <span className="font-semibold">Note:</span> GST is calculated on professional fees only. TDS is deducted at source as per government regulations.
      </div>
    </div>
  );
};

export default TotalCalculation;