import React, { useState } from 'react';
import ServiceSelection from './ServiceSelection';
import ClientForm from './ClientForm';
import SummaryTable from './SummaryTable';
import TotalCalculation from './TotalCalculation';

const QuotationFlow = () => {
  const [step, setStep] = useState('services'); // 'services', 'client', 'summary'
  const [selectedServices, setSelectedServices] = useState([]);
  const [clientData, setClientData] = useState(null);

  const handleServiceSelection = (service, subservice, remove = false) => {
    if (remove) {
      setSelectedServices(prev => prev.filter(s => 
        !(s.service.id === service.id && s.subservice.name === subservice.name)
      ));
    } else {
      setSelectedServices(prev => [...prev, { service, subservice }]);
    }
  };

  const handleFeeUpdate = (serviceId, subserviceIndex, field, value) => {
    setSelectedServices(prev => {
      const newServices = [...prev];
      const serviceIndex = newServices.findIndex(s => 
        s.service.id === serviceId && s.subservice === prev[subserviceIndex].subservice
      );
      if (serviceIndex !== -1) {
        newServices[serviceIndex] = {
          ...newServices[serviceIndex],
          [field]: value
        };
      }
      return newServices;
    });
  };

  const handleClientSubmit = (data) => {
    setClientData(data);
    setStep('summary');
  };

  const handleBack = () => {
    if (step === 'summary') {
      setStep('client');
    } else if (step === 'client') {
      setStep('services');
    }
  };

  const handleContinue = () => {
    if (step === 'services') {
      setStep('client');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'services':
        return (
          <ServiceSelection
            services={services}
            selectedServices={selectedServices}
            onSelectSubservice={handleServiceSelection}
            onFeeUpdate={handleFeeUpdate}
          />
        );
      case 'client':
        return (
          <ClientForm
            onSubmit={handleClientSubmit}
            onCancel={handleBack}
            initialData={clientData} // Pass existing client data if available
          />
        );
      case 'summary':
        return (
          <>
            <SummaryTable
              selectedServices={selectedServices}
              clientData={clientData}
            />
            <TotalCalculation selectedServices={selectedServices} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {renderStep()}
      {step === 'services' && selectedServices.length > 0 && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Continue to Client Details
          </button>
        </div>
      )}
    </div>
  );
};

export default QuotationFlow;
