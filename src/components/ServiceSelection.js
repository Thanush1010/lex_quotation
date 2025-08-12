import React, { useState } from 'react';
import ServiceCard from './ServiceCard';

const ServiceSelection = ({ services, selectedServices, onSelectSubservice, onFeeUpdate }) => {
  const [modalIndex, setModalIndex] = useState(null);

  const renderModal = () => {
    if (modalIndex === null) return null;
    const service = services[modalIndex];

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        onClick={() => setModalIndex(null)}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 p-8 relative animate-fade-in-up"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-2xl text-blue-400 hover:text-blue-700 font-bold focus:outline-none"
            onClick={() => setModalIndex(null)}
            aria-label="Close"
          >
            &times;
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">
              {service.name} - Service Details
            </h2>
          </div>

          <div className="overflow-x-auto" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <table className="min-w-full divide-y divide-blue-100">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                    Particulars
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                    Official Fee (₹)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                    Professional Fee (₹)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                    Reimbursement Fee (₹)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                    Total (₹)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-blue-50">
                {service.subservices.map((subservice, idx) => {
                  const selected =
                    selectedServices &&
                    selectedServices.find(
                      (s) => s.service.id === service.id && s.subservice.name === subservice.name
                    );

                  const official = subservice.officialFee || 0;

                  // Always use miscFee for reimbursement in state
                  const professional = selected?.professionalFee ?? '';
                  // Accept both miscFee and reimbursementFee for backward compatibility
                  const reimbursement = typeof selected?.miscFee !== 'undefined' ? selected.miscFee : (selected?.reimbursementFee ?? '');

                  const total = official + (Number(professional) || 0) + (Number(reimbursement) || 0);

                  const isSelected = !!selected;

                  const handleToggleSelect = () => {
                    if (isSelected) {
                      onSelectSubservice(service, subservice, true);
                    } else {
                      onSelectSubservice(service, subservice);
                    }
                  };

                  const handleFeeChange = (field, value) => {
                    if (onFeeUpdate) {
                      // Always store reimbursement as miscFee in state
                      if (field === 'reimbursementFee') {
                        onFeeUpdate(service.id, idx, 'miscFee', value);
                      } else {
                        onFeeUpdate(service.id, idx, field, value);
                      }
                    }
                  };

                  return (
                    <tr key={idx} className="hover:bg-blue-50 align-top">
                      {/* Name & description */}
                      <td className="px-4 py-2 whitespace-normal align-top min-w-[180px] max-w-xs">
                        <div className="text-sm font-medium text-blue-900 break-words">
                          {subservice.name}
                        </div>
                        {subservice.description && (
                          <div className="text-xs text-blue-500 mt-1 break-words">
                            {subservice.description}
                          </div>
                        )}
                      </td>

                      {/* Official Fee (fixed) */}
                      <td className="px-4 py-2 whitespace-nowrap align-top">
                        <input
                          type="text"
                          value={official.toLocaleString('en-IN')}
                          readOnly
                          className="w-full bg-blue-50 p-2 rounded text-sm border-none"
                        />
                      </td>

                      {/* Professional Fee */}
                      <td className="px-4 py-2 whitespace-nowrap align-top">
                        <input
                          type="number"
                          value={professional}
                          onChange={(e) => handleFeeChange('professionalFee', e.target.value)}
                          className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                          placeholder="Enter"
                          min="0"
                        />
                      </td>

                      {/* Reimbursement Fee */}
                      <td className="px-4 py-2 whitespace-nowrap align-top">
                        <input
                          type="number"
                          value={reimbursement}
                          onChange={(e) => handleFeeChange('reimbursementFee', e.target.value)}
                          className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                          placeholder="Enter"
                          min="0"
                        />
                      </td>

                      {/* Total */}
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-blue-900 align-top">
                        ₹{total.toLocaleString('en-IN')}
                      </td>

                      {/* Select / Deselect */}
                      <td className="px-4 py-2 whitespace-nowrap text-sm align-top">
                        <button
                          className={`px-3 py-1 rounded-md text-xs transition-colors flex items-center gap-2 ${
                            isSelected
                              ? 'bg-green-500 text-white hover:bg-red-500'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                          onClick={handleToggleSelect}
                        >
                          {isSelected ? (
                            <>
                              <span className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-green-600 font-bold">
                                &#10003;
                              </span>
                              Deselect
                            </>
                          ) : (
                            'Select'
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="w-full grid gap-8 justify-center px-2"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(260px, 1fr))`,
          alignItems: 'stretch',
          justifyItems: 'center',
        }}
      >
        {services.map((service, idx) => {
          const isCopyright = service.id === 'copyright';
          const isLast = idx === services.length - 1;
          return (
            <div
              key={service.id}
              style={
                isCopyright && isLast
                  ? { gridColumn: '1 / -1', justifySelf: 'center', maxWidth: 320 }
                  : {}
              }
            >
              <ServiceCard
                service={service}
                selectedServices={selectedServices}
                onSelectSubservice={onSelectSubservice}
                onFeeUpdate={onFeeUpdate}
                expanded={false}
                onExpand={() => setModalIndex(idx)}
              />
            </div>
          );
        })}
      </div>
      {renderModal()}
    </>
  );
};

export default ServiceSelection;
