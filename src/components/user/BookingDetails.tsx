import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

interface Booking {
  booking_id: number;
  pickup_location: string;
  dropoff_location: string;
  vehicle_type: string;
  status: string;
  scheduled_time: string;
  estimated_price: number;
  driver_id: number | null;
}

const BookingDetails: React.FC = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });
  const [error, setError] = useState('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const response = await api.get(`/logistics/bookings/${id}/`);
      setBooking(response.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setError('Failed to load booking details');
    }
  };

  const handleCancel = async () => {
    try {
      await api.post(`/logistics/bookings/${id}/cancel/`);
      fetchBookingDetails();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking');
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/logistics/bookings/${id}/feedback/`, feedback);
      alert('Feedback submitted successfully');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Failed to submit feedback');
    }
  };

  if (!booking) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <p><strong>Booking ID:</strong> {booking.booking_id}</p>
        <p><strong>Pickup Location:</strong> {booking.pickup_location}</p>
        <p><strong>Dropoff Location:</strong> {booking.dropoff_location}</p>
        <p><strong>Vehicle Type:</strong> {booking.vehicle_type}</p>
        <p><strong>Status:</strong> {booking.status}</p>
        <p><strong>Scheduled Time:</strong> {new Date(booking.scheduled_time).toLocaleString()}</p>
        <p><strong>Estimated Price:</strong> ${booking.estimated_price}</p>
        {booking.driver_id && <p><strong>Driver ID:</strong> {booking.driver_id}</p>}
      </div>
      {booking.status === 'PENDING' && (
        <button
          onClick={handleCancel}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
        >
          Cancel Booking
        </button>
      )}
      <button
        onClick={() => navigate('/user')}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Back to Bookings
      </button>
      {booking.status === 'DELIVERED' && (
        <form onSubmit={handleSubmitFeedback} className="mt-8">
          <h3 className="text-xl font-bold mb-4">Submit Feedback</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
              Rating (1-5)
            </label>
            <input
              type="number"
              id="rating"
              min="1"
              max="5"
              value={feedback.rating}
              onChange={(e) => setFeedback({ ...feedback, rating: parseInt(e.target.value) })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
              Comment
            </label>
            <textarea
              id="comment"
              value={feedback.comment}
              onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={4}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default BookingDetails;