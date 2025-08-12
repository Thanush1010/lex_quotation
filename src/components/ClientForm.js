import React, { useState } from 'react';

const ClientForm = ({ onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    clientPhone: ''
});

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
};

return (
    <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl p-8 mb-8 animate-fade-in-up">
    <h3 className="text-xl font-semibold mb-4">Client Details</h3>
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Client Name*</label>
        <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            required
        />
        </div>
        
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
        <textarea
            name="clientAddress"
            value={formData.clientAddress}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            rows="3"
            required
        />
        </div>
        
    {/* Removed email and phone fields as requested */}
        
        <div className="flex justify-end gap-4 pt-4">
        <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
            Cancel
        </button>
        <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
            Save Details
        </button>
        </div>
    </form>
    </div>
);
};

export default ClientForm;