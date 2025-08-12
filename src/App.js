import Footer from './pages/Footer';

import QuotationLandingPage from './pages/QuotationLandingPage.jsx';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

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


function App() {
  const [servicesData] = useState(services);
  const [selectedServices, setSelectedServices] = useState([]);
  const [clientData, setClientData] = useState(null);
  const [activeStep, setActiveStep] = useState('services'); // 'services', 'client', 'summary'
  const [showLanding, setShowLanding] = useState(true);
  const totals = useMemo(() => {
    return selectedServices.reduce((acc, item) => {
      acc.total += item.total;
      acc.professionalFees += (item.professionalFee || 0);
      return acc;
    }, { total: 0, professionalFees: 0 });
  }, [selectedServices]);

  if (showLanding) {
    return <>
      <QuotationLandingPage onStart={() => setShowLanding(false)} />
      <Footer />
    </>;
  }

  // Remove landing page logic, show main quotation maker UI directly
  // ...existing code for your main quotation maker UI goes here...
  <Footer />

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
      setSelectedServices(prev => [...prev, {
        service,
        subservice,
        total: subservice.total || 0,
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-fuchsia-100 via-sky-100 to-emerald-100 relative overflow-x-hidden">
      {/* Vibrant, layered backdrops for visual interest */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-fuchsia-400 via-pink-300 to-yellow-200 opacity-30 rounded-full filter blur-3xl animate-float-slow z-0" />
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-sky-400 via-cyan-300 to-blue-200 opacity-20 rounded-full filter blur-3xl animate-float-medium z-0" />
      <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-emerald-300 via-lime-200 to-teal-200 opacity-20 rounded-full filter blur-3xl animate-float-fast z-0" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-br from-yellow-200 via-pink-200 to-fuchsia-300 opacity-20 rounded-full filter blur-2xl animate-float-medium z-0 -translate-x-1/2 -translate-y-1/2" />

      <main className="flex-1 z-10 relative px-2 md:px-8 py-8 w-full max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">IP Services Calculator</h1>
          <h2 className="text-2xl text-gray-600">Get instant quotes for your IP needs</h2>
        </div>

        {activeStep === 'services' && (
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-10 gap-y-12 mb-8 place-items-center max-w-6xl w-full">
              {servicesData.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onFeeUpdate={handleFeeUpdate}
                  onSelectSubservice={handleSelectSubservice}
                />
              ))}
            </div>
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
                {Array.from(new Set(selectedServices.map(s => (s.service.id || '').toLowerCase()))).map(templateType => (
                  templateOptions[templateType] && (
                    <button
                      key={templateType}
                      onClick={() => generateDocument(templateType)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                    >
                      {templateOptions[templateType].label}
                    </button>
                  )
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
      </main>
      <Footer />
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(-15px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 8s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default App;