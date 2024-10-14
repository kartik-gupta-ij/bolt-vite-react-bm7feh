import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const CreateBooking: React.FC = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  const fetchVehicleTypes = async () => {
    try {
      const response = await api.get('/logistics/vehicle-types/');
      setVehicleTypes(response.data.map((vt: { type: string }) => vt.type));
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/logistics/bookings/create/', {
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        vehicle_type: vehicleType,
        scheduled_time: scheduledTime,
      });
      navigate(`/user/booking/${response.data.booking_id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
    }
  };

  const handleEstimatePrice = async () => {
    try {
      const response = await api.post('/logistics/price-estimate/', {
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        vehicle_type: vehicleType,
      });
      setEstimatedPrice(response.data.estimated_price);
    } catch (err) {
      console.error('Error estimating price:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Create a New Booking</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pickupLocation">
            Pickup Location
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="pickupLocation"
            type="text"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dropoffLocation">
            Dropoff Location
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="dropoffLocation"
            type="text"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleType">
            Vehicle Type
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="vehicleType"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            required
          >
            <option value="">Select a vehicle type</option>
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scheduledTime">
            Scheduled Time
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="scheduledTime"
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <button
            type="button"
            onClick={handleEstimatePrice}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Estimate Price
          </button>
          {estimatedPrice !== null && (
            <p className="mt-2 text-gray-700">Estimated Price: ${estimatedPrice}</p>
          )}
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBooking;