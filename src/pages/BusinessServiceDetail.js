// src/pages/BusinessServiceDetail.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { API_BASE_URL } from '../api/baseurl';
import '../css/BusinessServiceDetail.css'; // Class names updated here

const PointImagesGrid = ({ images, pointTitle }) => {
  if (!images || images.length === 0) return null;

  const numImages = images.length;
  const getImageClassName = (index) => {
    if (numImages === 1) return 'bsd-point-image--single';
    if (numImages === 2) return 'bsd-point-image--double';
    if (numImages === 3) return index === 0 ? 'bsd-point-image--large-3' : 'bsd-point-image--small-3';
    if (numImages >= 4) return 'bsd-point-image--equal-4';
    return '';
  };

  return (
    <div className={`bsd-point-visual-wrapper bsd-grid-count-${numImages}`}>
      <div className="bsd-point-images-grid">
        {images.map((img, index) => (
          <div key={index} className={`bsd-image-item ${getImageClassName(index)}`}>
            <img src={img.image} alt={img.caption || pointTitle} />
            {img.caption && <div className="bsd-image-caption">{img.caption}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const BusinessServiceDetail = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePointSlug, setActivePointSlug] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [faqHeights, setFaqHeights] = useState({});

  const pointRefs = useRef({});
  const pointsNavRef = useRef(null);
  const faqAnswerRefs = useRef([]);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchServiceDetail = async () => {
      if (!slug) {
        setLoading(false);
        setError("Service slug missing.");
        return;
      }
      const apiUrl = `${API_BASE_URL}business-services/${slug}/`;
      try {
        setLoading(true);
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setService(data);
        if (data.points?.length > 0) setActivePointSlug(data.points[0].slug);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load service details.");
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetail();
  }, [slug]);

  // Calculate FAQ answer heights after content is fully loaded
  useEffect(() => {
    if (!service?.faqs) return;

    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      const heights = {};
      service.faqs.forEach((faq, index) => {
        const element = faqAnswerRefs.current[index];
        if (element) {
          heights[index] = element.scrollHeight + 50; // Extra padding for safety
        }
      });
      setFaqHeights(heights);
    }, 100);

    return () => clearTimeout(timer);
  }, [service]);

  const handlePointNavClick = useCallback((pointSlug) => {
    setActivePointSlug(pointSlug);
    const ref = pointRefs.current[pointSlug];
    if (ref) {
      // Use pointsNavRef.current.offsetHeight to account for the sticky nav height
      const offset = ref.getBoundingClientRect().top + window.pageYOffset - (pointsNavRef.current ? pointsNavRef.current.offsetHeight : 150) - 20; // 20px extra margin
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!service?.points) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActivePointSlug(entry.target.getAttribute('data-slug'));
          }
        });
      },
      { rootMargin: '0px 0px -50% 0px', threshold: 0.1 }
    );

    service.points.forEach((point) => {
      if (pointRefs.current[point.slug]) observer.observe(pointRefs.current[point.slug]);
    });

    return () => observer.disconnect();
  }, [service]);

  if (loading) return <Layout><div className="bsd-loading-state">Loading...</div></Layout>;
  if (error) return <Layout><div className="bsd-error-state">Error: {error}</div></Layout>;
  if (!service) return <Layout><div className="bsd-error-state">Service not found.</div></Layout>;

  const { title, feature_image, video, points, faqs } = service;

  return (
    <Layout>
      {/* HERO */}
      <section className="bsd-hero-section" style={{ backgroundImage: `url(${feature_image})` }}>
        <div className="bsd-hero-overlay"></div>
        <div className="bsd-hero-content">
          <h1>{title}</h1>
          {video && (
            <div className="bsd-hero-video-wrapper">
              <video src={video} className="bsd-hero-video" autoPlay muted loop playsInline />
            </div>
          )}
        </div>
      </section>

      {/* STICKY NAV */}
      {points && points.length > 0 && (
        <nav className="bsd-points-nav-container bsd-sticky-nav" ref={pointsNavRef}>
          <div className="bsd-points-nav-wrapper">
            {points.map((point) => (
              <button
                key={point.slug}
                className={`bsd-point-nav-item ${point.slug === activePointSlug ? 'active' : ''}`}
                onClick={() => handlePointNavClick(point.slug)}
              >
                {point.title}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* POINTS */}
      <section className="bsd-service-points-section">
        {points.map((point, pointIndex) => (
          <div
            key={point.slug}
            className="bsd-point-detail-block"
            ref={(el) => (pointRefs.current[point.slug] = el)}
            data-slug={point.slug}
          >
            {point.description && (
              <div className="bsd-point-description" dangerouslySetInnerHTML={{ __html: point.description }} />
            )}
            {point.images && point.images.length > 0 && (
              <div className="bsd-point-visual-content-container">
                <PointImagesGrid images={point.images} pointTitle={point.title} />
              </div>
            )}
          </div>
        ))}
      </section>

      {/* FAQS - COMPLETELY FIXED TOGGLE */}
      {faqs && faqs.length > 0 && (
        <section className="bsd-service-faqs-section">
          <div className="bsd-faqs-container">
            <h2>Frequently Asked Questions</h2>
            <div className="bsd-faqs-accordion">
              {faqs.map((faq, index) => (
                <div key={index} className={`bsd-faq-item ${openFaqIndex === index ? 'open' : ''}`}>
                  <button
                    className="bsd-faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openFaqIndex === index}
                  >
                    <span>Q: {faq.question}</span>
                    <span className="bsd-faq-icon">{openFaqIndex === index ? '−' : '+'}</span>
                  </button>

                  <div
                    className="bsd-faq-answer-wrapper"
                    style={{
                      maxHeight: openFaqIndex === index ? `${faqHeights[index] || 1000}px` : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 0.55s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <div 
                      ref={el => faqAnswerRefs.current[index] = el}
                      className="bsd-faq-answer" 
                      dangerouslySetInnerHTML={{ __html: faq.answer }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default BusinessServiceDetail;