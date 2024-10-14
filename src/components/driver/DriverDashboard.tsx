import React, { useState, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import AvailableBookings from './AvailableBookings';
import CurrentBooking from './CurrentBooking';
import DriverProfile from './DriverProfile';

const DriverDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    checkDriverRegistration();
  }, []);

  const checkDriverRegistration = async () => {
    try {
      await api.get('/logistics/driver/profile/');
      setIsRegistered(true);
    } catch (error) {
      setIsRegistered(false);
    }
  };

  const handleRegisterDriver = async (driverData: any) => {
    try {
      await api.post('/logistics/driver/register', driverData);
      setIsRegistered(true);
    } catch (error) {
      console.error('Error registering driver:', error);
    }
  };

  if (!isRegistered) {
    return <DriverRegistration onRegister={handleRegisterDriver} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-600">Driver Dashboard</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/driver" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Available Bookings
                </Link>
                <Link to="/driver/current" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Current Booking
                </Link>
                <Link to="/driver/profile" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Profile
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <span className="text-gray-700 mr-4">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<AvailableBookings />} />
          <Route path="/current" element={<CurrentBooking />} />
          <Route path="/profile" element={<DriverProfile />} />
        </Routes>
      </div>
    </div>
  );
};

const DriverRegistration: React.FC<{ onRegister: (data: any) => void }> = ({ onRegister }) => {
  const [vehicleId, setVehicleId] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister({ vehicle_id: vehicleId, license_number: licenseNumber, current_location: currentLocation });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register as a Driver
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="vehicle-id" className="sr-only">
                Vehicle ID
              </label>
              <input
                id="vehicle-id"
                name="vehicle-id"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Vehicle ID"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="license-number" className="sr-only">
                License Number
              </label>
              <input
                id="license-number"
                name="license-number"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="License Number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="current-location" className="sr-only">
                Current Location
              </label>
              <input
                id="current-location"
                name="current-location"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Current Location"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverDashboard;