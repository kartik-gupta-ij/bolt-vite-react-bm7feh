import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

interface Booking {
  id: number;
  pickup_location: string;
  dropoff_location: string;
  vehicle_type: string;
  status: string;
  scheduled_time: string;
  estimated_price: number;
}

const CurrentBooking: React.FC = () => {
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCurrentBooking();
  }, []);

  const fetchCurrentBooking = async () => {
    try {
      const response = await api.get('/logistics/driver/bookings/current/');
      setCurrentBooking(response.data[0] || null);
    } catch (error) {
      console.error('Error fetching current booking:', error);
      setError('Failed to load current booking');
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!currentBooking) return;

    try {
      await api.put(`/logistics/driver/bookings/${currentBooking.id}/status/`, { status });
      fetchCurrentBooking();
    } catch (error) {
      console.error('Error updating booking status:', error);
      setError('Failed to update booking status');
    }
  };

  const handleUpdateLocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          await api.post('/logistics/driver/location/update/', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          alert('Location updated successfully');
        } catch (error) {
          console.error('Error updating location:', error);
          setError('Failed to update location');
        }
      }, () => {
        setError('Unable to get current location');
      });
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  if (!currentBooking) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Current Booking</h2>
        <p>No active booking at the moment.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Current Booking</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Booking #{currentBooking.id}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and actions for the current booking.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Pickup Location</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentBooking.pickup_location}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Dropoff Location</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentBooking.dropoff_location}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Vehicle Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentBooking.vehicle_type}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentBooking.status}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Scheduled Time</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{new Date(currentBooking.scheduled_time).toLocaleString()}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Estimated Price</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${currentBooking.estimated_price}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => handleUpdateStatus('EN_ROUTE')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Start Journey
        </button>
        <button
          onClick={() => handleUpdateStatus('DELIVERED')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Complete Booking
        </button>
        <button
          onClick={handleUpdateLocation}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Update Location
        </button>
      </div>
    </div>
  );
};

export default CurrentBooking;