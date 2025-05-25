import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { registerUser } from '../../components/api';

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

  // Use an object for errors per field
  const [errors, setErrors] = useState({});
  // Separate state for backend or general error messages
  const [generalError, setGeneralError] = useState('');
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

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (data) => {
    const validationErrors = {};

    if (!/^[\w]+$/.test(data.name)) {
      validationErrors.name = 'Name can only contain letters, numbers, and underscores (_).';
    }

    if (!/^[^\s@]+@[^\s@]+\.stud\.noroff\.no$/.test(data.email)) {
      validationErrors.email = 'Email must be a valid @gmail address.';
    }

    if (data.password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters.';
    }

    if (data.bio && data.bio.length > 160) {
      validationErrors.bio = 'Bio must be less than 160 characters.';
    }

    if (data.avatarUrl && !isValidUrl(data.avatarUrl)) {
      validationErrors.avatarUrl = 'Avatar URL must be a valid URL.';
    }

    if (data.avatarUrl && data.avatarAlt.length > 120) {
      validationErrors.avatarAlt = 'Avatar alt text must be less than 120 characters.';
    }

    if (data.bannerUrl && !isValidUrl(data.bannerUrl)) {
      validationErrors.bannerUrl = 'Banner URL must be a valid URL.';
    }

    if (data.bannerUrl && data.bannerAlt.length > 120) {
      validationErrors.bannerAlt = 'Banner alt text must be less than 120 characters.';
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError('');
    setErrors({});

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

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
      // Show backend or general error message
      setGeneralError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-container">
      <div className="auth-form my-6">
        {/* Header */}
        <div className="top-line-container">
          <IoMdCloseCircleOutline
            size={24}
            className="cursor-pointer"
            onClick={() => navigate(-1)}
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
        <div className="logo-text">
          <div className="center-logo">
            SnapBook
            <div className="logo-circle-dot"></div>
          </div>
        </div>

        <p className="under-text">Create your account and start booking.</p>

        {/* General error from backend or submit */}
        {generalError && <p className="text-red-500 mb-4 text-center">{generalError}</p>}

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
                <>
                  <textarea
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="input-styling mt-1 mx-auto"
                  />
                  {errors[name] && (
                    <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
                  )}
                </>
              ) : (
                <>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required={required}
                    className="input-styling mt-1 mx-auto"
                    placeholder={`Enter your ${label.toLowerCase()}`}
                  />
                  {errors[name] && (
                    <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
                  )}
                </>
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
