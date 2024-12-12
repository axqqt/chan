import React, { useState, useEffect } from 'react';

// Main App Component
const TicketPoolApp = () => {
  // State Management
  const [ticketPoolStatus, setTicketPoolStatus] = useState({
    totalTickets: 0,
    availableTickets: 0,
    processingStatus: 'Stopped'
  });

  const [configuration, setConfiguration] = useState({
    maxTickets: 100,
    processingRate: 10,
    simulationDuration: 60
  });

  const [errors, setErrors] = useState({
    configurationError: '',
    systemError: ''
  });

  // Control Handlers
  const handleStart = () => {
    if (validateConfiguration()) {
      // Simulated start logic
      setTicketPoolStatus(prev => ({
        ...prev,
        processingStatus: 'Running'
      }));
      setErrors(prev => ({ ...prev, configurationError: '' }));
    }
  };

  const handleStop = () => {
    setTicketPoolStatus(prev => ({
      ...prev,
      processingStatus: 'Stopped'
    }));
  };

  const handleReset = () => {
    setTicketPoolStatus({
      totalTickets: 0,
      availableTickets: 0,
      processingStatus: 'Stopped'
    });
    setConfiguration({
      maxTickets: 100,
      processingRate: 10,
      simulationDuration: 60
    });
  };

  const validateConfiguration = () => {
    if (configuration.maxTickets <= 0) {
      setErrors(prev => ({
        ...prev,
        configurationError: 'Max tickets must be greater than 0'
      }));
      return false;
    }
    if (configuration.processingRate <= 0) {
      setErrors(prev => ({
        ...prev,
        configurationError: 'Processing rate must be greater than 0'
      }));
      return false;
    }
    return true;
  };

  const handleConfigChange = (field, value) => {
    setConfiguration(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  // Simulated Real-Time Updates (would be replaced with actual WebSocket/Backend connection)
  useEffect(() => {
    let intervalId;
    if (ticketPoolStatus.processingStatus === 'Running') {
      intervalId = setInterval(() => {
        setTicketPoolStatus(prev => ({
          ...prev,
          totalTickets: prev.totalTickets + configuration.processingRate,
          availableTickets: prev.availableTickets + configuration.processingRate
        }));
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [ticketPoolStatus.processingStatus, configuration.processingRate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Ticket Pool Management System</h1>
        
        {/* Configuration Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Configuration Settings</h2>
          <div className="grid grid-cols-3 gap-4">
            <ConfigInput 
              label="Max Tickets" 
              value={configuration.maxTickets}
              onChange={(val) => handleConfigChange('maxTickets', val)}
            />
            <ConfigInput 
              label="Processing Rate" 
              value={configuration.processingRate}
              onChange={(val) => handleConfigChange('processingRate', val)}
            />
            <ConfigInput 
              label="Simulation Duration (s)" 
              value={configuration.simulationDuration}
              onChange={(val) => handleConfigChange('simulationDuration', val)}
            />
          </div>
          {errors.configurationError && (
            <div className="text-red-500 mt-2 text-center">
              {errors.configurationError}
            </div>
          )}
        </div>

        {/* Ticket Pool Status */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Ticket Pool Status</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <StatusCard 
              label="Total Tickets" 
              value={ticketPoolStatus.totalTickets} 
            />
            <StatusCard 
              label="Available Tickets" 
              value={ticketPoolStatus.availableTickets} 
            />
            <StatusCard 
              label="Processing Status" 
              value={ticketPoolStatus.processingStatus} 
              highlight={true}
            />
          </div>
        </div>

        {/* Control Panel */}
        <div className="flex justify-center space-x-4">
          <ControlButton 
            label="Start" 
            onClick={handleStart}
            className="bg-green-500 hover:bg-green-600"
            disabled={ticketPoolStatus.processingStatus === 'Running'}
          />
          <ControlButton 
            label="Stop" 
            onClick={handleStop}
            className="bg-red-500 hover:bg-red-600"
            disabled={ticketPoolStatus.processingStatus === 'Stopped'}
          />
          <ControlButton 
            label="Reset" 
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

// Reusable Configuration Input Component
const ConfigInput = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-medium text-gray-600">{label}</label>
      <input 
        type="number" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

// Reusable Status Card Component
const StatusCard = ({ label, value, highlight = false }) => {
  return (
    <div className={`p-4 rounded-lg ${highlight ? 'bg-yellow-100' : 'bg-white'} shadow-md`}>
      <div className="text-sm font-medium text-gray-600 mb-2">{label}</div>
      <div className="text-xl font-bold text-gray-800">{value}</div>
    </div>
  );
};

// Reusable Control Button Component
const ControlButton = ({ label, onClick, className, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-md text-white font-semibold 
        transition duration-300 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-opacity-50
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
        ${className}
      `}
    >
      {label}
    </button>
  );
};

export default TicketPoolApp;