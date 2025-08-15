import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Globe } from 'lucide-react';

const OnboardingStepOne = ({ data, onUpdate, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    website: '',
    ...data,
  });

  const [errors, setErrors] = useState({});

  // Update parent when form changes
  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phone && !/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website =
        'Please enter a valid URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="onboarding-form">
      <div className="form-section">
        <div className="form-section-header">
          <h2 className="form-section-title">
            <User className="inline mr-2" size={24} />
            Personal Information
          </h2>
          <p className="form-section-description">
            Let's start with your basic contact information. This will appear at
            the top of your resume.
          </p>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className={`form-input ${errors.firstName ? 'error' : ''}`}
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <div className="form-error">{errors.firstName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className={`form-input ${errors.lastName ? 'error' : ''}`}
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <div className="form-error">{errors.lastName}</div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Mail className="inline mr-1" size={16} />
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              <Phone className="inline mr-1" size={16} />
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
            />
            {errors.phone && <div className="form-error">{errors.phone}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city" className="form-label">
              <MapPin className="inline mr-1" size={16} />
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className="form-input"
              value={formData.city}
              onChange={handleChange}
              placeholder="New York"
            />
          </div>

          <div className="form-group">
            <label htmlFor="state" className="form-label">
              State/Province
            </label>
            <input
              type="text"
              id="state"
              name="state"
              className="form-input"
              value={formData.state}
              onChange={handleChange}
              placeholder="NY"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="website" className="form-label">
            <Globe className="inline mr-1" size={16} />
            Website/Portfolio (Optional)
          </label>
          <input
            type="url"
            id="website"
            name="website"
            className={`form-input ${errors.website ? 'error' : ''}`}
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourportfolio.com"
          />
          {errors.website && <div className="form-error">{errors.website}</div>}
        </div>
      </div>

      <div className="onboarding-actions">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          ← Back to Resumes
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleNext}
          disabled={
            !formData.firstName || !formData.lastName || !formData.email
          }
        >
          Continue to Job Target →
        </button>
      </div>
    </div>
  );
};

export default OnboardingStepOne;
