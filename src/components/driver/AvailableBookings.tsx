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

const AvailableBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailableBookings();
  }, []);

  const fetchAvailableBookings = async () => {
    try {
      const response = await api.get('/logistics/driver/bookings/available/');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching available bookings:', error);
      setError('Failed to load available bookings');
    }
  };

  const handleAcceptBooking = async (bookingId: number) => {
    try {
      await api.post(`/logistics/driver/bookings/${bookingId}/accept/`);
      fetchAvailableBookings();
    } catch (error) {
      console.error('Error accepting booking:', error);
      setError('Failed to accept booking');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Available Bookings</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {bookings.length === 0 ? (
        <p>No available bookings at the moment.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <li key={booking.id} className="py-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-lg font-medium text-gray-900">Booking #{booking.id}</p>
                  <p className="text-sm text-gray-500">From: {booking.pickup_location}</p>
                  <p className="text-sm text-gray-500">To: {booking.dropoff_location}</p>
                  <p className="text-sm text-gray-500">Vehicle Type: {booking.vehicle_type}</p>
                  <p className="text-sm text-gray-500">Scheduled: {new Date(booking.scheduled_time).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Estimated Price: ${booking.estimated_price}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleAcceptBooking(booking.id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AvailableBookings;