import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/api';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';

export default function CinemasManagement() {
  const navigate = useNavigate();
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', city: '', address: '', description: '' });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/cinemas`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setCinemas(data.data || []);
      } else {
        toast.error('Failed to fetch cinemas');
      }
    } catch (err) {
      console.error('Error fetching cinemas:', err);
      toast.error('Error fetching cinemas');
    }
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFile = (e) => setImageFile(e.target.files[0]);

  const resetForm = () => {
    setForm({ name: '', city: '', address: '', description: '' });
    setImageFile(null);
    setEditingCinema(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (cinema) => {
    navigate(`/admin-dashboard/cinemas/${cinema._id}/edit`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('city', form.city);
      fd.append('address', form.address);
      fd.append('description', form.description);
      if (imageFile) fd.append('image', imageFile);

      const res = await fetch(`${API_BASE_URL}/cinemas`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create cinema');

      toast.success('Cinema created successfully');
      setShowModal(false);
      resetForm();
      fetchCinemas();
    } catch (err) {
      toast.error(err.message || 'Failed to create cinema');
    } finally {
      setLoading(false);
    }
  };

  const deleteCinema = async (cinemaId) => {
    if (!confirm('Are you sure you want to delete this cinema?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/cinemas/${cinemaId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Cinema deleted successfully');
        fetchCinemas();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete cinema');
      }
    } catch (err) {
      console.error('Error deleting cinema:', err);
      toast.error('Error deleting cinema');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Manage Cinemas</h2>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium"
        >
          Add Cinema
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cinemas.map((cinema) => (
          <div key={cinema._id} className="bg-surface-500 p-4 rounded-lg border border-surface-400/30">
            {cinema.image && (
              <img
                src={`${API_BASE_URL}${cinema.image}`}
                alt={cinema.name}
                className="w-full h-32 object-cover rounded mb-3"
              />
            )}
            <h3 className="text-lg font-semibold text-text-primary mb-2">{cinema.name}</h3>
            <p className="text-text-secondary text-sm mb-1"><strong>City:</strong> {cinema.city}</p>
            {cinema.address && <p className="text-text-secondary text-sm mb-1"><strong>Address:</strong> {cinema.address}</p>}
            {cinema.description && <p className="text-text-secondary text-sm mb-3"><strong>Description:</strong> {cinema.description}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(cinema)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCinema(cinema._id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {cinemas.length === 0 && !loading && (
        <p className="text-text-muted text-center py-8">No cinemas found.</p>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showModal}
        title="Add Cinema"
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-2 bg-surface-600 border border-surface-400 rounded focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">City *</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full p-2 bg-surface-600 border border-surface-400 rounded focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-2 bg-surface-600 border border-surface-400 rounded focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 bg-surface-600 border border-surface-400 rounded focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full p-2 bg-surface-600 border border-surface-400 rounded"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-surface-600 hover:bg-surface-700 text-text-primary rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
