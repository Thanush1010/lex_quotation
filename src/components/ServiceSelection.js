import ServiceCard from './ServiceCard';

const ServiceSelection = ({ services, selectedServices, onSelectSubservice }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {services.map(service => (
        <ServiceCard
          key={service.id}
          service={service}
          onSelectSubservice={onSelectSubservice}
          isSelected={selectedServices.some(s => s.service.id === service.id)}
        />
      ))}
    </div>
  );
};

export default ServiceSelection;