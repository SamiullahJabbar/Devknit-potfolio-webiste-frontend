import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../api/baseurl';
import '../css/WebinarDetail.css';
import Layout from '../components/Layout';

const WebinarDetail = () => {
  const { slug } = useParams();
  const [webinar, setWebinar] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', phone_number: '' });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}webinars/${slug}/`)
      .then(res => res.json())
      .then(data => setWebinar(data))
      .catch(err => console.error("Error:", err));
  }, [slug]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const payload = { ...formData, webinar: webinar.id };

    try {
      const res = await fetch(`${API_BASE_URL}Webnar-register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setShowPopup(true);
        setFormData({ username: '', email: '', phone_number: '' });
        e.target.reset();
        
        setTimeout(() => {
          setShowPopup(false);
        }, 5000);
      }
    } catch (err) {
      alert("Registration failed!");
    }
  };

  if (!webinar) return <div className="loading">Loading...</div>;

  return (
    <Layout>
      <div className="detail-page-container">
        {showPopup && (
          <div className="registration-popup">
            <div className="popup-content">
              <span className="popup-icon"></span>
              <div>
                <p className="popup-title">Registration Successful!</p>
                <p className="popup-subtext">Check your email for webinar details.</p>
              </div>
            </div>
          </div>
        )}

        <div className="detail-wrapper">
          <div className="detail-left">
            <span className="breadcrumb">Webinar</span>
            <h1 className="detail-title">{webinar.title}</h1>
            <p className="detail-short-desc">{webinar.short_description}</p>
            <p className="detail-date-time">
              {new Date(webinar.start_date).toLocaleString()} 
            </p>

            <div className="detail-feature-img">
              <img src={webinar.feature_image} alt="Banner" />
            </div>

            <div 
              className="detail-long-desc" 
              dangerouslySetInnerHTML={{ __html: webinar.detail_description }} 
            />

            <hr className="divider" />

            {/* UPDATED: Speakers Section to handle Multiple Speakers */}
            <div className="speakers-section">
              <h2>Our speakers</h2>
              {webinar.speakers && webinar.speakers.length > 0 ? (
                webinar.speakers.map((speaker) => (
                  <div className="speaker-item" key={speaker.id}>
                    <img src={speaker.image} alt={speaker.name} className="speaker-img" />
                    <div className="speaker-info">
                      <h3>{speaker.name}</h3>
                      <p>{speaker.short_description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No speakers listed.</p>
              )}
            </div>
          </div>

          <div className="detail-right">
            <div className="registration-card">
              <h2>Register here</h2>
              <p>Please fill out the fields below to secure your place!</p>
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label>Full Name*</label>
                  <input type="text" name="username" required onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Work Email*</label>
                  <input type="email" name="email" required onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Phone Number*</label>
                  <input type="text" name="phone_number" required onChange={handleInputChange} />
                </div>
                <button type="submit" className="submit-btn">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WebinarDetail;