import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

interface Vehicle {
  id: number;
  type: string;
  license_plate: string;
  capacity: number;
  is_available: boolean;
}

const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/logistics/admin/vehicles/');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Failed to load vehicles');
    }
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/logistics/admin/vehicles/create', newVehicle);
      fetchVehicles();
      setNewVehicle({});
    } catch (error) {
      console.error('Error creating vehicle:', error);
      setError('Failed to create vehicle');
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    try {
      await api.delete(`/logistics/admin/vehicles/${id}/`);
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      setError('Failed to delete vehicle');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Vehicle Management</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleCreateVehicle} className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Add New Vehicle</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Type"
            value={newVehicle.type || ''}
            onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
            className="flex-1 border rounded px-2 py-1"
          />
          <input
            type="text"
            placeholder="License Plate"
            value={newVehicle.license_plate || ''}
            onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })}
            className="flex-1 border rounded px-2 py-1"
          />
          <input
            type="number"
            placeholder="Capacity"
            value={newVehicle.capacity || ''}
            onChange={(e) => setNewVehicle({ ...newVehicle, capacity: parseInt(e.target.value) })}
            className="flex-1 border rounded px-2 py-1"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Vehicle</button>
        </div>
      </form>

      <h3 className="text-lg font-semibold mb-2">Vehicle List</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td className="px-6 py-4 whitespace-nowrap">{vehicle.type}</td>
              <td className="px-6 py-4 whitespace-nowrap">{vehicle.license_plate}</td>
              <td className="px-6 py-4 whitespace-nowrap">{vehicle.capacity}</td>
              <td className="px-6 py-4 whitespace-nowrap">{vehicle.is_available ? 'Yes' : 'No'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleManagement;