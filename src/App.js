import { useState } from 'react';
import { services } from './data/services';
import ServiceCard from './components/ServiceCard';
import SummaryTable from './components/SummaryTable';
import TotalCalculation from './components/TotalCalculation';
import logo from './assets/logo.png'; 

function App() {
  const [servicesData, setServicesData] = useState(services);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  const handleFeeUpdate = (serviceId, subserviceIndex, field, value) => {
    setServicesData(prev => prev.map(service => {
      if (service.id === serviceId) {
        const updatedSubservices = [...service.subservices];
        updatedSubservices[subserviceIndex] = {
          ...updatedSubservices[subserviceIndex],
          [field]: value
        };
        return { ...service, subservices: updatedSubservices };
      }
      return service;
    }));
  };

  const handleSelectSubservice = (service, subservice) => {
    const isAlreadySelected = selectedServices.some(
      item => item.service.id === service.id && item.subservice.name === subservice.name
    );

    if (!isAlreadySelected) {
      const total = (subservice.officialFee || 0) + 
                  (subservice.professionalFee || 0) + 
                  (subservice.miscFee || 0);

      setSelectedServices([...selectedServices, { 
        service, 
        subservice,
        total,
        officialFee: subservice.officialFee || 0,
        professionalFee: subservice.professionalFee || 0,
        miscFee: subservice.miscFee || 0
      }]);
    }
  };

  const handleRemoveService = (index) => {
    const newSelectedServices = [...selectedServices];
    newSelectedServices.splice(index, 1);
    setSelectedServices(newSelectedServices);
  };

  return (
    <div className="min-h-screen bg-blue-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <img 
              src={logo} 
              alt="Lextria Research" 
              className="h-16 md:h-20 object-contain" 
            />
          </div>
          <h1 className="text-4xl font-bold text-blue-800 mb-2">IP Services Calculator</h1>
          <h2 className="text-2xl text-gray-600">Get instant quotes for your IP needs</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          {servicesData.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onFeeUpdate={handleFeeUpdate}
              onSelectSubservice={handleSelectSubservice}
            />
          ))}
        </div>

        {selectedServices.length > 0 && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {showSummary ? 'Hide Calculation' : 'Calculate Total'}
            </button>
          </div>
        )}

        {showSummary && (
          <div className="space-y-8">
            <SummaryTable 
              selectedServices={selectedServices} 
              onRemoveService={handleRemoveService} 
            />
            <TotalCalculation selectedServices={selectedServices} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;