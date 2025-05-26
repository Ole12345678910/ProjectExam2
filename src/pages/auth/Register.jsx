import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { registerUser } from '../../components/api';

function Register() {
  const navigate = useNavigate();

  // State to hold all form inputs together in one object
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

  // Object to hold validation errors for each input field
  const [errors, setErrors] = useState({});
  // General error message for backend or unexpected errors
  const [generalError, setGeneralError] = useState('');
  // Loading state for disabling submit button during registration
  const [loading, setLoading] = useState(false);

  // Handle change for text inputs and textarea
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle toggle of the venue manager checkbox
  const handleVenueManagerChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      venueManager: !prevData.venueManager,
    }));
  };

  // Helper function to check if a string is a valid URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validate all fields, returning an object with error messages per field
  const validateForm = (data) => {
    const validationErrors = {};

    // Name: only letters, numbers, underscores
    if (!/^[\w]+$/.test(data.name)) {
      validationErrors.name = 'Name can only contain letters, numbers, and underscores (_).';
    }

    // Email must be a valid student email ending with stud.noroff.no
    if (!/^[^\s@]+@[^\s@]+\.stud\.noroff\.no$/.test(data.email)) {
      validationErrors.email = 'Email must be a valid @gmail address.';
    }

    // Password minimum length 8
    if (data.password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters.';
    }

    // Bio max length 160 characters
    if (data.bio && data.bio.length > 160) {
      validationErrors.bio = 'Bio must be less than 160 characters.';
    }

    // Validate avatar URL if provided
    if (data.avatarUrl && !isValidUrl(data.avatarUrl)) {
      validationErrors.avatarUrl = 'Avatar URL must be a valid URL.';
    }

    // Avatar alt text max length 120
    if (data.avatarUrl && data.avatarAlt.length > 120) {
      validationErrors.avatarAlt = 'Avatar alt text must be less than 120 characters.';
    }

    // Validate banner URL if provided
    if (data.bannerUrl && !isValidUrl(data.bannerUrl)) {
      validationErrors.bannerUrl = 'Banner URL must be a valid URL.';
    }

    // Banner alt text max length 120
    if (data.bannerUrl && data.bannerAlt.length > 120) {
      validationErrors.bannerAlt = 'Banner alt text must be less than 120 characters.';
    }

    return validationErrors;
  };

  // Submit handler for the registration form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);          // Show loading state
    setGeneralError('');       // Clear previous general errors
    setErrors({});             // Clear previous validation errors

    // Validate form inputs
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Show validation errors to user
      setLoading(false);
      return;                      // Stop submission if errors
    }

    // Prepare data to send to backend
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
      // Call API to register user
      await registerUser(registerData);
      alert('Registration successful!');   // Inform the user
      // Reset form to initial empty state
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
      navigate('/login');                   // Redirect to login page
    } catch (err) {
      // If registration fails, show error message
      setGeneralError(err.message || 'Registration failed');
    } finally {
      setLoading(false);                   // Reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-container">
      <div className="auth-form my-6">
        {/* Header with close icon and navigation links */}
        <div className="top-line-container">
          <IoMdCloseCircleOutline
            size={24}
            className="cursor-pointer"
            onClick={() => navigate(-1)} // Go back to previous page on close
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

        {/* App logo and slogan */}
        <div className="logo-text">
          <div className="center-logo">
            SnapBook
            <div className="logo-circle-dot"></div>
          </div>
        </div>

        <p className="under-text">Create your account and start booking.</p>

        {/* Show any general errors from backend or submission */}
        {generalError && <p className="text-red-500 mb-4 text-center">{generalError}</p>}

        {/* Form inputs dynamically generated from an array */}
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
                  {/* Show field-specific validation error */}
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
                  {/* Show field-specific validation error */}
                  {errors[name] && (
                    <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
                  )}
                </>
              )}
            </label>
          ))}

          {/* Checkbox for Venue Manager */}
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

        {/* Submit button disables while loading */}
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
