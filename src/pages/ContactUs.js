import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { API_BASE_URL } from '../api/baseurl';
import EXPERT_PROFILE_IMAGE from '../images/man.png'; 
import '../css/ContactUs.css';

// Countries list with Add option
const COUNTRIES = [
  { code: '+1', name: 'United States' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+91', name: 'India' },
  { code: '+92', name: 'Pakistan' },
  { code: '+86', name: 'China' },
  { code: '+81', name: 'Japan' },
  { code: '+49', name: 'Germany' },
  { code: '+33', name: 'France' },
  { code: '+39', name: 'Italy' },
  { code: '+34', name: 'Spain' },
  { code: '+7', name: 'Russia' },
  { code: '+61', name: 'Australia' },
  { code: '+55', 'name': 'Brazil' },
  { code: '+52', name: 'Mexico' },
  { code: '+27', name: 'South Africa' },
  { code: '+20', name: 'Egypt' },
  { code: '+971', name: 'UAE' },
  { code: '+966', name: 'Saudi Arabia' },
  { code: '+65', name: 'Singapore' },
  { code: '+82', name: 'South Korea' },
  { code: '+60', name: 'Malaysia' },
  { code: '+63', name: 'Philippines' },
  { code: '+84', name: 'Vietnam' },
  { code: '+66', name: 'Thailand' },
  { code: '+62', name: 'Indonesia' },
  { code: 'add', name: '+ Add Country Code' },
];

const TIMELINE_OPTIONS = [
  { value: '', label: 'Select Project Timeline' },
  { value: 'immediate', label: 'Immediate Start' },
  { value: '1-2_weeks', label: '1-2 Weeks' },
  { value: '2-4_weeks', label: '2-4 Weeks' },
  { value: '1-2_months', label: '1-2 Months' },
  { value: '2-4_months', label: '2-4 Months' },
  { value: '4+_months', label: '4+ Months' },
  { value: 'custom', label: 'Custom Timeline' },
];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', 
    project_timeline: '', 
    message: ''
  });
  const [companyInfo, setCompanyInfo] = useState(null);
  const [developerInfo, setDeveloperInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDeveloper, setLoadingDeveloper] = useState(true);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const [countryCode, setCountryCode] = useState('+7'); 
  const [customTimeline, setCustomTimeline] = useState('');

  useEffect(() => {
    fetchCompanyInfo();
    fetchDeveloperInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}contact/company-info/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCompanyInfo(data);
    } catch (error) {
      console.error('Error fetching company info:', error);
    }
  };

  const fetchDeveloperInfo = async () => {
    try {
      setLoadingDeveloper(true);
      const response = await fetch(`${API_BASE_URL}developers/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Assuming the API returns an array, take the first developer
      if (data && data.length > 0) {
        setDeveloperInfo(data[0]);
      }
    } catch (error) {
      console.error('Error fetching developer info:', error);
    } finally {
      setLoadingDeveloper(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneChange = (e) => {
    // Allow only numbers and basic phone characters - NO + sign restriction
    const sanitizedValue = e.target.value.replace(/[^\d\s\-()]/g, '');
    setFormData({
      ...formData,
      phone: sanitizedValue
    });
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  const handleTimelineChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      project_timeline: value
    });
    
    if (value !== 'custom') {
      setCustomTimeline('');
    }
  };

  const handleCustomTimelineChange = (e) => {
    setCustomTimeline(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage('');

    // Prepare final data - countryCode already includes the + sign
    const finalFormData = {
      ...formData,
      // Combine country code and phone number, only if both exist
      phone: countryCode && formData.phone ? `${countryCode}${formData.phone}`.trim() : '',
      // Use custom timeline if selected, otherwise use the dropdown value
      project_timeline: formData.project_timeline === 'custom' ? customTimeline : formData.project_timeline
    };

    // Validation for custom timeline
    if (formData.project_timeline === 'custom' && !customTimeline) {
      setSubmitMessage('Please specify your custom timeline.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}contact/client/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData)
      });

      if (response.ok) {
        setSubmitMessage('Thank you! Your message has been sent successfully.');
        // Reset form
        setFormData({ name: '', email: '', phone: '', project_timeline: '', message: '' });
        setCountryCode('+92');
        setCustomTimeline('');
      } else {
        // Attempt to read server error if available
        const errorData = await response.json();
        setSubmitMessage(`Error sending message: ${errorData.detail || 'Please try again.'}`);
      }
    } catch (error) {
      setSubmitMessage('Network error sending message. Please check your connection and try again.');
      console.error('Submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format the title by removing "Developer Expert" from the beginning if it exists
  const formatDeveloperTitle = (title) => {
    if (!title) return '';
    // Remove "Developer Expert" from the start of the title
    return title.replace(/^Developer Expert\s*/i, '');
  };

  return (
    <Layout>
      <div className="contact-us-page">
        
        {/* Contact Hero Section */}
        <section className="contact-hero"> 
          <div className="contact-hero-container"> 
            <div className="contact-hero-content"> 
              <span className="contact-hero-badge">GET IN TOUCH</span>
              <h2 className="contact-hero-title">
                Let's Start<br /><span className="contact-accent-text">Something</span><br />Amazing Together
              </h2>
              <p className="contact-hero-description">
                Ready to transform your ideas into reality? We're here to help. Tell us about your project and let's create something extraordinary.
              </p>
              <div className="contact-hero-features">
                <div className="contact-feature">
                  <div className="contact-feature-icon">✓</div>
                  <span>24-48 Hour Response Time</span>
                </div>
                <div className="contact-feature">
                  <div className="contact-feature-icon">✓</div>
                  <span>Free Project Consultation</span>
                </div>
                <div className="contact-feature">
                  <div className="contact-feature-icon">✓</div>
                  <span>Custom Tailored Solutions</span>
                </div>
              </div>
            </div>

            <div className="contact-hero-visual">
              <div className="contact-visual-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Team working on project" 
                  className="contact-hero-image" 
                />
                <div className="contact-floating-card contact-card-1">
                  <div className="contact-card-icon">💬</div>
                  <div className="contact-card-text">
                    <strong>Quick Response</strong>
                    <span>We'll get back within hours</span>
                  </div>
                </div>
                <div className="contact-floating-card contact-card-2">
                  <div className="contact-card-icon">⭐️</div>
                  <div className="contact-card-text">
                    <strong>Expert Team</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="contact-form-section-image-3">
          <div className="container form-container-slim">
            <h2 className="form-title">Ready to elevate your business? Let's discuss your project and business goals</h2>
            
            <p className="form-intro">
              I'm a freelance web Designer and CRO Specialist based in Falmouth, Cornwall, UK. I work with brands of all sizes, from local businesses to international companies, from Cornwall to Canada. No matter what you sell, your business store is in expert hands.
            </p>
            {companyInfo && (
              <p className="form-intro contact-email">
                Email: <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
              </p>
            )}

            <form onSubmit={handleSubmit} className="contact-form-image-3">
              <div className="input-group">
                <label htmlFor="name" className="visually-hidden">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="email" className="visually-hidden">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* SIMPLIFIED Phone Field - Only Country Code Dropdown */}
              <div className="phone-field-group">
                <div className="country-code-selector">
                  <label htmlFor="countryCode" className="visually-hidden">Country Code</label>
                  <select
                    id="countryCode"
                    name="countryCode"
                    value={countryCode}
                    onChange={handleCountryCodeChange}
                    required
                    className="country-code-select"
                  >
                    {COUNTRIES.map((country) => (
                      <option 
                        key={country.code} 
                        value={country.code}
                        // Use className for styling the 'Add Country Code' option
                        className={country.code === 'add' ? 'add-option' : ''}
                      >
                        {country.code === 'add' ? country.name : `${country.code} ${country.name}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="phone-input-container">
                  <label htmlFor="phone" className="visually-hidden">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    required
                    className="phone-number-input"
                  />
                </div>
              </div>

              {/* Timeline Field */}
              <div className="timeline-field-group">
                {/* Conditional rendering: Show input field if 'Custom Timeline' is selected */}
                {formData.project_timeline === 'custom' ? (
                  <div className="custom-timeline-input">
                    <label htmlFor="customTimeline" className="visually-hidden">Custom Timeline</label>
                    <input
                      type="text"
                      id="customTimeline"
                      name="customTimeline"
                      placeholder="Specify your timeline (e.g., 3-6 months)"
                      value={customTimeline}
                      onChange={handleCustomTimelineChange}
                      required
                      className="custom-timeline-field"
                    />
                  </div>
                ) : (
                  // Show the dropdown if 'Custom Timeline' is NOT selected
                  <select
                    id="project_timeline"
                    name="project_timeline"
                    value={formData.project_timeline}
                    onChange={handleTimelineChange}
                    required
                    className="timeline-select"
                  >
                    {TIMELINE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} disabled={option.value === ''}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <label htmlFor="message" className="visually-hidden">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell us about your project requirements, goals, and any specific details you'd like to share..."
                rows="6"
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>

              <button type="submit" disabled={loading} className="submit-btn-yellow">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            {submitMessage && (
              <div className={`message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
                {submitMessage}
              </div>
            )}
          </div>
        </section>

        {/* Rest of the component remains the same */}
        {/* {companyInfo && (
          <section className="company-info-section-footer">
            <div className="container">
              <div className="info-card-wrapper">
                <div className="info-grid-footer">
                  <div className="info-item-footer">
                    <h3>Email</h3>
                    <p>{companyInfo.email}</p>
                  </div>
                  <div className="info-item-footer">
                    <h3>Phone</h3>
                    <p>{companyInfo.phone}</p>
                  </div>
                  <div className="info-item-footer">
                    <h3>Address</h3>
                    <p>{companyInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )} */}

        {companyInfo && companyInfo.map_iframe && (
          <section className="map-section-footer">
            <div className="container">
              <div 
                className="map-container-footer"
                // WARNING: Use dangerouslySetInnerHTML only when necessary and the content is trusted
                dangerouslySetInnerHTML={{ __html: companyInfo.map_iframe }}
              />
            </div>
          </section>
        )}
        
        {/* Expert Profile Section - Now dynamic from API */}
        <section className="expert-profile-section-top">
          <div className="container">
            {loadingDeveloper ? (
              <div className="expert-card-image-1 loading">
                <div className="profile-image-round loading-skeleton"></div>
                <div className="profile-content-image-1">
                  <div className="loading-skeleton title-skeleton"></div>
                  <div className="loading-skeleton text-skeleton"></div>
                  <div className="loading-skeleton text-skeleton"></div>
                  <div className="loading-skeleton button-skeleton"></div>
                </div>
              </div>
            ) : developerInfo ? (
              <div className="expert-card-image-1">
                {/* Use API image if available, otherwise fallback to local image */}
                <img 
                  src={developerInfo.pic || EXPERT_PROFILE_IMAGE} 
                  alt={developerInfo.title || "Developer Expert"} 
                  className="profile-image-round" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = EXPERT_PROFILE_IMAGE;
                  }}
                />
                <div className="profile-content-image-1">
                  <h1>{developerInfo.title || "Developer Expert"}</h1>
                  <p>{developerInfo.detail || "I'm a conversion-focused Web Designer with a proven track record of delivering world-class websites for brands across the globe."}</p>
                  <button className="expert-tag-button">Developer Expert</button>
                </div>
              </div>
            ) : (
              <div className="expert-card-image-1">
                {/* Fallback to static content if API fails */}
                <img src={EXPERT_PROFILE_IMAGE} alt="Developer Expert" className="profile-image-round" />
                <div className="profile-content-image-1">
                  <h1>Developer Expert Falmouth, Cornwall, UK</h1>
                  <p>I'm a conversion-focused Web Designer with a proven track record of delivering world-class websites for brands across the globe. I collaborate with the best developers and Designer specialists to ensure your store performs at its highest potential.</p>
                  <button className="expert-tag-button">Developer Expert</button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ContactUs;