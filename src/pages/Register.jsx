import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoMdCloseCircleOutline } from 'react-icons/io';
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
    setError('');

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
      await registerUser(registerData);
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
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center min-h-screen bg-greySecond"
    >
      <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md my-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <IoMdCloseCircleOutline
              size={24}
              className="cursor-pointer"
              onClick={() => navigate('/')}
            />

          <div>
            <Link className="py-2 font-medium px-5 text-sm" to="/login">
              Log in
            </Link>
            <Link className="auth-button" to="/register">
              Sign up
            </Link>
          </div>
        </div>

        {/* Logo */}
        <div className="text-4xl font-montserrat font-semibold mb-2 text-center">
          <p className="flex items-center justify-center">
            Holidaze
            <div className="h-8 w-8 bg-yellowMain border-2 border-blackMain rounded-full ml-2" />
          </p>
        </div>

        <p className="text-lg text-gray-second mb-4 text-center">
          Create your account and start booking.
        </p>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* Form inputs */}
        <div className="content-center space-y-4">
          {[
            { label: 'Name', name: 'name', type: 'text', required: true },
            { label: 'Email', name: 'email', type: 'email', required: true },
            { label: 'Password', name: 'password', type: 'password', required: true },
            { label: 'Bio', name: 'bio', type: 'textarea', required: false },
            { label: 'Avatar URL', name: 'avatarUrl', type: 'text', required: false },
            { label: 'Avatar Alt Text', name: 'avatarAlt', type: 'text', required: false },
            { label: 'Banner URL', name: 'bannerUrl', type: 'text', required: false },
            { label: 'Banner Alt Text', name: 'bannerAlt', type: 'text', required: false },
          ].map(({ label, name, type, required }) => (
            <label key={name} className="label-container">
              <p className="input-text">{label}</p>
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="input-styling mt-1 mx-auto"
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={required}
                  className="input-styling mt-1 mx-auto"
                  placeholder={`Enter your ${label.toLowerCase()}`}
                />
              )}
            </label>
          ))}

          {/* Venue Manager Checkbox */}
          <label className="label-container flex-row justify-start gap-2">
            <input
              type="checkbox"
              checked={formData.venueManager}
              onChange={handleVenueManagerChange}
              className="w-5 h-5"
            />
            <span className="text-sm">Become a Venue Manager</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="standard-button w-full mt-6"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
}

export default Register;
