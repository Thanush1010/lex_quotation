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
    return <QuotationLandingPage onStart={() => setShowLanding(false)} />;
  }

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
    setSelectedServices(prev => {
      const idx = prev.findIndex(item => item.service.id === service.id && item.subservice.name === subservice.name);
      if (idx === -1) {
        // Not present, add new
        return [
          ...prev,
          {
            service,
            subservice,
            total: subservice.total || 0,
            officialFee: subservice.officialFee || 0,
            professionalFee: subservice.professionalFee || 0,
            miscFee: subservice.miscFee || 0
          }
        ];
      } else {
        // Already present, update values
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          subservice,
          total: subservice.total || 0,
          officialFee: subservice.officialFee || 0,
          professionalFee: subservice.professionalFee || 0,
          miscFee: subservice.miscFee || 0
        };
        return updated;
      }
    });
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
    <div className="min-h-screen flex flex-col dark-theme">
      {/* Fixed background */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black -z-20" />
      
      {/* Static background shapes */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-amber-500/5 rounded-full filter blur-3xl -z-10" />
      <div className="fixed top-1/3 -right-20 w-[500px] h-[500px] bg-orange-500/5 rounded-full filter blur-3xl -z-10" />
      <div className="fixed bottom-20 left-1/4 w-[400px] h-[400px] bg-yellow-500/5 rounded-full filter blur-3xl -z-10" />

      <main className="flex-1 z-10 relative px-4 sm:px-6 lg:px-8 py-8 w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 mb-2">
            IP Services Calculator
          </h1>
          <h2 className="text-2xl text-gray-400">Get instant quotes for your IP needs</h2>
        </div>

        {activeStep === 'services' && (
          <div className="relative w-full max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-8">
              {servicesData.map(service => (
                <div key={service.id} className="flex justify-center items-center">
                  <ServiceCard
                    service={service}
                    onFeeUpdate={handleFeeUpdate}
                    onSelectSubservice={handleSelectSubservice}
                    selectedServices={selectedServices}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStep === 'client' && (
          <ClientForm 
            onSubmit={handleClientSubmit} 
            onCancel={() => setActiveStep('services')}
            initialData={clientData}
          />
        )}

        {activeStep === 'summary' && clientData && (
          <div className="space-y-8">
            <SummaryTable 
              selectedServices={selectedServices} 
              onRemoveService={handleRemoveService} 
            />
            <TotalCalculation selectedServices={selectedServices} />
            <div className="card-gradient rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Generate Quotation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Array.from(new Set(selectedServices.map(s => (s.service.id || '').toLowerCase()))).map(templateType => (
                  templateOptions[templateType] && (
                    <button
                      key={templateType}
                      onClick={() => generateDocument(templateType)}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl"
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
                className="bg-gradient-to-r from-gray-500/50 to-gray-600/50 hover:from-gray-500/70 hover:to-gray-600/70 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 border border-white/10"
              >
                Back
              </button>
              <button
                onClick={() => {
                  setSelectedServices([]);
                  setClientData(null);
                  setActiveStep('services');
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
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
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 hover:from-amber-600 hover:to-orange-600 hover:shadow-xl hover:scale-[1.02]"
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
          50% { transform: translateY(-8px) translateX(4px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-6px) translateX(-6px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-4px) translateX(2px); }
        }
        .animate-float-slow { 
          animation: float-slow 12s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform;
        }
        .animate-float-medium { 
          animation: float-medium 10s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform;
        }
        .animate-float-fast { 
          animation: float-fast 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}

export default App;