import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api/baseurl';
import '../css/Webinar.css';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Webinar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [webinars, setWebinars] = useState([]);
  const [filteredWebinars, setFilteredWebinars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}webinars/`)
      .then((res) => res.json())
      .then((data) => {
        const sortedData = [...data].sort((a, b) => {
          if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
          if (a.status !== 'upcoming' && b.status === 'upcoming') return 1;
          return new Date(b.start_date) - new Date(a.start_date);
        });
        setWebinars(sortedData);
        setFilteredWebinars(sortedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching webinars:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (term === '') {
      setFilteredWebinars(webinars);
    } else {
      const filtered = webinars.filter(webinar =>
        webinar.title.toLowerCase().includes(term) ||
        (webinar.short_description && webinar.short_description.toLowerCase().includes(term))
      );
      setFilteredWebinars(filtered);
    }
  }, [searchTerm, webinars]);

  const formatBackendDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const getSuffix = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };
    return `${day}${getSuffix(day)} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}, ${date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  };

  return (
    <Layout>

    <div className="webinar-page">
      <header className="help-center-header">
        <div className="header-content-container">
          <div className="header-left-section">
            <h1 className="header-title">Devknit Webinars</h1>
            <div className="search-bar-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Find answers and resources"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="header-right-section">
            <div className="hero-image-placeholder"></div>
          </div>
        </div>
      </header>

      <section className="webinar-listing-section">
        <div className="webinar-container">
          <h2 className="main-section-title">Webinars</h2>
          
          {loading ? (
            <div className="loading-container"><p>Loading webinars...</p></div>
          ) : filteredWebinars.length === 0 ? (
            <div className="no-results"><p>No webinars found.</p></div>
          ) : (
            <div className="webinar-grid">
              {filteredWebinars.map((item) => (
                <Link to={`/webinar/${item.slug}`} key={item.id} className="webinar-card-link">
                  <div className={`webinar-card ${item.status === 'upcoming' ? 'card-upcoming' : 'card-past'}`}>
                    <div className="card-header-label">
                      {item.status === 'upcoming' ? '● Upcoming Webinar' : 'Past Webinar'}
                    </div>

                    <div className="card-banner">
                      <img 
                        src={item.feature_image || 'https://via.placeholder.com/400x220'} 
                        alt={item.title} 
                        className="banner-img" 
                      />
                     
                    </div>

                    <div className="card-content">
                      <h3 className="webinar-title">{item.title}</h3>
                      <p className="webinar-desc">{item.short_description}</p>
                      <div className="webinar-date">
                        {formatBackendDate(item.start_date)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
    </Layout>
  );
};

export default Webinar;