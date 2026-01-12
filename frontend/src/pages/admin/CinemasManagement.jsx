import { useState } from 'react';
import { API_BASE_URL } from '../../utils/api';
import { toast } from 'react-toastify';

export default function CinemasManagement() {
  const [form, setForm] = useState({ name: '', city: '', address: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFile = (e) => setImageFile(e.target.files[0]);

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
      toast.success('Cinema created');
      setForm({ name: '', city: '', address: '', description: '' });
      setImageFile(null);
    } catch (err) {
      toast.error(err.message || 'Failed to create cinema');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Cinemas</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full p-2 bg-surface-600 border border-secondary-400 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input name="city" value={form.city} onChange={handleChange} required className="w-full p-2 bg-surface-600 border border-secondary-400 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input name="address" value={form.address} onChange={handleChange} className="w-full p-2 bg-surface-600 border border-secondary-400 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 bg-surface-600 border border-secondary-400 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input type="file" accept="image/*" onChange={handleFile} />
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="py-2 px-4 bg-primary-500 text-white rounded">{loading ? 'Saving...' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
}
