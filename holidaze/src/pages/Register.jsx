import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../components/api';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    avatarUrl: '',
    avatarAlt: '',
    bannerUrl: '',
    bannerAlt: '',
    venueManager: false,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleVenueManagerChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      venueManager: !prevData.venueManager,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error state on form submission

    const registerData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      bio: formData.bio || undefined,
      avatar: formData.avatarUrl
        ? { url: formData.avatarUrl, alt: formData.avatarAlt || '' }
        : undefined,
      banner: formData.bannerUrl
        ? { url: formData.bannerUrl, alt: formData.bannerAlt || '' }
        : undefined,
      venueManager: formData.venueManager,
    };

    try {
      const data = await registerUser(registerData); 

      alert('Registration successful!');
      setFormData({
        name: '',
        email: '',
        password: '',
        bio: '',
        avatarUrl: '',
        avatarAlt: '',
        bannerUrl: '',
        bannerAlt: '',
        venueManager: false,
      }); 

      navigate('/login'); 
    } catch (err) {
      setError(err.message || 'Registration failed'); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {/* Name */}
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Bio (Optional) */}
        <div>
          <label className="block font-medium">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Avatar URL (Optional) */}
        <div>
          <label className="block font-medium">Avatar URL</label>
          <input
            type="text"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Avatar Alt Text (Optional) */}
        <div>
          <label className="block font-medium">Avatar Alt Text</label>
          <input
            type="text"
            name="avatarAlt"
            value={formData.avatarAlt}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Banner URL (Optional) */}
        <div>
          <label className="block font-medium">Banner URL</label>
          <input
            type="text"
            name="bannerUrl"
            value={formData.bannerUrl}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Banner Alt Text (Optional) */}
        <div>
          <label className="block font-medium">Banner Alt Text</label>
          <input
            type="text"
            name="bannerAlt"
            value={formData.bannerAlt}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Venue Manager */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.venueManager}
              onChange={handleVenueManagerChange}
              className="mr-2"
            />
            Become a Venue Manager
          </label>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
