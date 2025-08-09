import { useState, useMemo } from 'react';
import { services } from './data/services';
import { templateOptions } from './data/templateData';
import ServiceCard from './components/ServiceCard';
import SummaryTable from './components/SummaryTable';
import TotalCalculation from './components/TotalCalculation';
import ClientForm from './components/ClientForm';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import logo from './assets/logo.png';

function App() {
  const [servicesData] = useState(services);
  const [selectedServices, setSelectedServices] = useState([]);
  const [clientData, setClientData] = useState(null);
  const [activeStep, setActiveStep] = useState('services'); // 'services', 'client', 'summary'

  const totals = useMemo(() => {
    return selectedServices.reduce((acc, item) => {
      acc.total += item.total;
      acc.professionalFees += (item.professionalFee || 0);
      return acc;
    }, { total: 0, professionalFees: 0 });
  }, [selectedServices]);

  const handleFeeUpdate = (serviceId, subserviceIndex, field, value) => {
    setSelectedServices(prev => prev.map(service => {
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

      setSelectedServices(prev => [...prev, { 
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
    setSelectedServices(prev => prev.filter((_, i) => i !== index));
  };

  const handleClientSubmit = (data) => {
    setClientData(data);
    setActiveStep('summary');
  };

  const generateDocument = async (templateType) => {
  if (!clientData) {
    alert('Please fill client details first');
    setActiveStep('client');
    return;
  }

  try {
    // Filter services so only the clicked category is included
    const filteredServices = selectedServices.filter(
      s => (s.service.id || '').toLowerCase() === templateType
    );

    if (filteredServices.length === 0) {
      alert(`No services selected for ${templateOptions[templateType].label}`);
      return;
    }

    // Calculate totals from filtered list
    const subtotal = filteredServices.reduce((sum, s) => sum + (s.total || 0), 0);
    const professionalFeesSum = filteredServices.reduce((sum, s) => sum + (s.professionalFee || 0), 0);
    const gst = professionalFeesSum * 0.18;
    const tds = professionalFeesSum * 0.10;
    const grandTotal = subtotal + gst - tds;

    // Fetch the matching template file
    const response = await fetch(`/templates/${templateType}-template.docx`);
    if (!response.ok) throw new Error(`Template not found: ${templateType}-template.docx`);
    const arrayBuffer = await response.arrayBuffer();
    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    // Build data for template
    const data = {
      ...clientData,
      quotationNumber: `LXR-${Date.now().toString().slice(-6)}`,
      quotationDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      services: filteredServices.map((service, index) => ({
        srNo: index + 1,
        name: service.subservice.name,
        officialFee: (service.officialFee || 0).toLocaleString('en-IN'),
        professionalFee: (service.professionalFee || 0).toLocaleString('en-IN'),
        miscFee: (service.miscFee || 0).toLocaleString('en-IN'),
        total: (service.total || 0).toLocaleString('en-IN')
      })),
      subtotal: subtotal.toLocaleString('en-IN'),
      gst: gst.toLocaleString('en-IN'),
      tds: tds.toLocaleString('en-IN'),
      grandTotal: grandTotal.toLocaleString('en-IN'),
      terms: templateOptions[templateType].terms
    };

    // Generate and save docx
    doc.render(data);
    const out = doc.getZip().generate({ type: "blob" });
    saveAs(out, `Quotation-${templateOptions[templateType].label}-${data.quotationNumber}.docx`);

  } catch (error) {
    console.error("Error generating document:", error);
    alert("Document generation failed: " + error.message);
  }
};


  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8">
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

        <div className="mb-8">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep === 'services' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className={`h-1 w-16 ${activeStep !== 'services' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep === 'client' ? 'bg-blue-600 text-white' : activeStep === 'summary' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <div className={`h-1 w-16 ${activeStep === 'summary' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep === 'summary' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
            </div>
          </div>
        </div>

        {activeStep === 'services' && (
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
        )}

        {activeStep === 'client' && (
          <ClientForm 
            onSubmit={handleClientSubmit} 
            onCancel={() => setActiveStep('services')} 
          />
        )}

        {activeStep === 'summary' && clientData && (
          <div className="space-y-8">
            <SummaryTable 
              selectedServices={selectedServices} 
              onRemoveService={handleRemoveService} 
            />
            <TotalCalculation selectedServices={selectedServices} />
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Generate Quotation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.keys(templateOptions).map(templateType => (
                  <button
                    key={templateType}
                    onClick={() => generateDocument(templateType)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                  >
                    {templateOptions[templateType].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setActiveStep('client')}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Back
              </button>
              <button
                onClick={() => {
                  setSelectedServices([]);
                  setClientData(null);
                  setActiveStep('services');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Create New Quotation
              </button>
            </div>
          </div>
        )}

        {activeStep === 'services' && selectedServices.length > 0 && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setActiveStep('client')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Proceed to Client Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;