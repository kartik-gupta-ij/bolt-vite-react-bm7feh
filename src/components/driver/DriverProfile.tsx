import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

interface DriverProfile {
  id: number;
  user: number;
  vehicle: string | null;
  license_number: string;
  current_location: string;
}

interface AccountDetails {
  id: number;
  user: number;
  phone_number: string;
  username: string;
  is_admin: boolean;
}

const DriverProfile: React.FC = () => {
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDriverProfile();
  }, []);

  const fetchDriverProfile = async () => {
    try {
      const response = await api.get('/logistics/driver/profile/');
      setProfile(response.data.driver_details);
      setAccountDetails(response.data.account_details);
    } catch (error) {
      console.error('Error fetching driver profile:', error);
      setError('Failed to load driver profile');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.put('/logistics/driver/profile/update/', {
        license_number: profile?.license_number,
        current_location: profile?.current_location,
        phone_number: accountDetails?.phone_number,
      });
      setProfile(response.data.driver_details);
      setAccountDetails(response.data.account_details);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating driver profile:', error);
      setError('Failed to update driver profile');
    }
  };

  if (!profile || !accountDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Driver Profile</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleUpdateProfile} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="license_number">
            License Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="license_number"
            type="text"
            value={profile.license_number}
            onChange={(e) => setProfile({ ...profile, license_number: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="current_location">
            Current Location
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="current_location"
            type="text"
            value={profile.current_location}
            onChange={(e) => setProfile({ ...profile, current_location: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone_number">
            Phone Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="phone_number"
            type="text"
            value={accountDetails.phone_number}
            onChange={(e) => setAccountDetails({ ...accountDetails, phone_number: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverProfile;