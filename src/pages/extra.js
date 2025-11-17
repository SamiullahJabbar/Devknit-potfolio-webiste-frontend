// src/pages/ServiceDetail.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../css/ServiceDetail.css'; 
import { API_BASE_URL } from '../api/baseurl'; 

// Utility function to render HTML content safely
const renderHTML = (htmlString) => {
    return { __html: htmlString };
};

const ServiceDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [allServices, setAllServices] = useState([]); // Related Services
    const [allProjects, setAllProjects] = useState([]); // Related Projects
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    
    // Refs for better performance
    const sliderRefService = useRef(null); // Ref for Services slider
    const sliderRefProject = useRef(null); // Ref for Projects slider
    const scrollIntervalRef = useRef(null);
    const isComponentMounted = useRef(true);
    
    // Function to handle navigation based on type
    const handleNavigationClick = useCallback((itemSlug, type) => {
        // Clear interval on manual interaction to prevent immediate scroll restart
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
        
        if (type === 'service') {
            navigate(`/services/${itemSlug}`);
        } else if (type === 'project') {
            navigate(`/projects/${itemSlug}`); 
        }
    }, [navigate]);

    // Function to handle image error
    const handleImageError = (e, fallbackImage) => {
        e.target.onerror = null;
        e.target.src = fallbackImage || "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
    };

    // Function to fetch the detail of the current service
    const fetchServiceDetail = async (currentSlug) => {
        // ... (Service detail fetching logic remains)
        if (!currentSlug) {
            setError("Service slug is missing.");
            setLoading(false);
            return;
        }

        const apiUrl = `${API_BASE_URL}services/${currentSlug}/`;

        try {
            setLoading(true);
            setError(null);
            setImageLoading(true);
            
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch service details (Status: ${response.status})`);
            }

            const data = await response.json();
            
            if (isComponentMounted.current) {
                setService(data);

                if (data.gallery_images && data.gallery_images.length > 0) {
                    setMainImage(data.gallery_images[0].image);
                } else if (data.feature_image) {
                    setMainImage(data.feature_image);
                } else {
                    setMainImage(null);
                }
            }

        } catch (err) {
            console.error("Error fetching service detail:", err);
            if (isComponentMounted.current) {
                setError(err.message);
                setService(null);
            }
        } finally {
            if (isComponentMounted.current) {
                setLoading(false);
            }
        }
    };
    
    // Function to fetch ALL services (Filtered to exclude current)
    const fetchAllServices = async () => {
        const apiUrl = `${API_BASE_URL}services/`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                console.error("Failed to fetch all services for slider.");
                return;
            }
            const data = await response.json();
            if (isComponentMounted.current) {
                const servicesArray = Array.isArray(data) ? data : (data.results || []);
                // Filter out the current service
                const filteredData = servicesArray.filter(s => s.slug !== slug);
                setAllServices(filteredData); 
            }
        } catch (err) {
            console.error("Error fetching all services:", err);
        }
    };

    // Function to fetch ALL projects
    const fetchAllProjects = async () => {
        const apiUrl = `${API_BASE_URL}projects/`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                console.error("Failed to fetch all projects for slider.");
                return;
            }
            const data = await response.json();
            
            if (isComponentMounted.current) {
                const projectsArray = Array.isArray(data) ? data : (data.results || []);
                setAllProjects(projectsArray); 
            }
        } catch (err) {
            console.error("Error fetching all projects:", err);
        }
    };


    // Initialize auto-scroll for slider (Modified to handle only one slider ref at a time)
    const initAutoScroll = useCallback(() => {
        const servicesCount = allServices.length;
        const projectsCount = allProjects.length;

        // Clear any existing interval
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }

        // We only auto-scroll if one of the lists is populated
        if (servicesCount === 0 && projectsCount === 0) return;

        const cardWidth = 320; 
        const scrollSpeed = 3000; // 3 seconds interval

        const attemptScroll = (sliderRef) => {
            const sliderElement = sliderRef.current;
            if (!sliderElement) return;

            let currentScroll = sliderElement.scrollLeft;
            currentScroll += cardWidth;
            
            // Check if scroll is near the end
            if (currentScroll >= sliderElement.scrollWidth - sliderElement.clientWidth - 5) {
                currentScroll = 0; 
            }
            
            sliderElement.scrollTo({
                left: currentScroll,
                behavior: 'smooth'
            });
        }
        
        // Start interval
        scrollIntervalRef.current = setInterval(() => {
            // Priority: Scroll Services slider first, then Projects slider
            if (sliderRefService.current && servicesCount > 0) {
                 attemptScroll(sliderRefService);
            } else if (sliderRefProject.current && projectsCount > 0) {
                 attemptScroll(sliderRefProject);
            }
        }, scrollSpeed); 
        
    }, [allServices.length, allProjects.length]); 
    
    // Handle manual scroll pause/resume
    const handleSliderInteraction = () => {
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
            
            // Resume auto-scroll after 5 seconds of inactivity
            setTimeout(() => {
                if (isComponentMounted.current) {
                    initAutoScroll();
                }
            }, 5000);
        }
    };

    useEffect(() => {
        isComponentMounted.current = true;
        
        fetchServiceDetail(slug);
        fetchAllServices(); 
        fetchAllProjects();
        
        return () => {
            isComponentMounted.current = false;
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
            }
        };
    }, [slug]); 

    // Auto-scroll effect
    useEffect(() => {
        initAutoScroll();
        
        return () => {
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
            }
        };
    }, [initAutoScroll]);

    // ... (LoadingSkeleton and ErrorComponent remain unchanged)
    const LoadingSkeleton = () => (
        <Layout>
            <div className="detail-loading">
                <div className="skeleton-breadcrumb"></div>
                <div className="skeleton-header">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-subtitle"></div>
                </div>
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                </div>
            </div>
        </Layout>
    );

    const ErrorComponent = () => (
        <Layout>
            <div className="detail-error">
                <div className="error-icon">⚠️</div>
                <h2>Service Not Found</h2>
                <p>We couldn't find the service you're looking for.</p>
                <p className="error-message">Error: {error}</p>
                <button 
                    className="back-button"
                    onClick={() => navigate('/services')}
                >
                    Back to Services
                </button>
            </div>
        </Layout>
    );

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (error || !service) {
        return <ErrorComponent />;
    }

    const {
        title,
        detail_title,
        detail_description,
        gallery_images = [],
        feature_points = [],
        core_services = [],
        benefits = [],
        faqs = []
    } = service;

    // Helper function to get image and description for a Project
    const getProjectContent = (project) => {
        let image = null;
        let description = "View case study for full details.";

        // Priority 1: Gallery (pick first image)
        if (project.gallery && project.gallery.length > 0) {
            image = project.gallery[0].image;
        } 
        // Priority 2: Images (pick first image)
        else if (project.images && project.images.length > 0) {
            image = project.images[0].image;
            // Also grab description if available
            if (project.images[0].description) {
                // Take the first line of the description
                description = project.images[0].description.split('\r\n')[0] || description; 
            }
        }
        
        return { 
            image: image, 
            description: description 
        };
    };

    return (
        <Layout>
            <article className="service-detail-page">

                {/* 🎯 Hero Section */}
                <section className="service-hero-section">
                    <div className="service-hero-container">
                        <nav className="breadcrumb-nav">
                            <a href="/" className="breadcrumb-link">Home</a>
                            <span className="breadcrumb-separator">/</span>
                            <a href="/services" className="breadcrumb-link">Services</a>
                            <span className="breadcrumb-separator">/</span>
                            <span className="breadcrumb-current">{title}</span>
                        </nav>
                        
                        <div className="hero-content">
                            <div className="hero-text">
                                <h1 className="service-main-title">{title}</h1>
                                <p className="service-hero-description">{detail_title}</p>
                                <div className="hero-actions">
                                    <button className="cta-button primary">
                                        Start Your Project
                                    </button>
                                    <button className="cta-button secondary">
                                        View Portfolio
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 🎨 Gallery Section */}
                <section className="gallery-section">
                    <div className="gallery-container">
                        <div className="main-gallery-view">
                            {mainImage ? (
                                <div className="main-image-container">
                                    {imageLoading && (
                                        <div className="image-loading-skeleton"></div>
                                    )}
                                    <img
                                        src={mainImage}
                                        alt={`${title} detail view`}
                                        className={`main-gallery-image ${imageLoading ? 'hidden' : 'visible'}`}
                                        onLoad={() => setImageLoading(false)}
                                        onError={(e) => handleImageError(e, service.feature_image)}
                                    />
                                </div>
                            ) : (
                                <div className="image-placeholder">
                                    <div className="placeholder-icon">📷</div>
                                    <p>No Image Available</p>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Grid */}
                        {gallery_images.length > 0 && (
                            <div className="thumbnail-grid">
                                {gallery_images.map((img, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail-item ${mainImage === img.image ? 'active' : ''}`}
                                        onClick={() => {
                                            setMainImage(img.image);
                                            setImageLoading(true);
                                        }}
                                    >
                                        <img
                                            src={img.image}
                                            alt={img.caption || `${title} gallery ${index + 1}`}
                                            className="thumbnail-image"
                                            loading="lazy"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* 📊 Content Tabs Section */}
                <section className="content-tabs-section">
                    <div className="tabs-container">
                        <div className="tabs-header">
                            <button 
                                className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'features' ? 'active' : ''}`}
                                onClick={() => setActiveTab('features')}
                            >
                                Features
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'benefits' ? 'active' : ''}`}
                                onClick={() => setActiveTab('benefits')}
                            >
                                Benefits
                            </button>
                            {faqs.length > 0 && (
                                <button 
                                    className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('faq')}
                                >
                                    FAQ
                                </button>
                            )}
                        </div>

                        <div className="tab-content">
                            {activeTab === 'overview' && (
                                <div className="tab-panel">
                                    <h3>Service Overview</h3>
                                    <div
                                        className="description-content"
                                        dangerouslySetInnerHTML={renderHTML(detail_description)}
                                    />
                                </div>
                            )}

                            {activeTab === 'features' && (
                                <div className="tab-panel">
                                    <h3>Core Features & Services</h3>
                                    <div className="features-grid">
                                        {core_services.map((item, index) => (
                                            <div key={index} className="feature-card">
                                                <div className="feature-icon">⚡</div>
                                                <h4>Feature {index + 1}</h4>
                                                <p>{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {feature_points.length > 0 && (
                                        <div className="feature-highlights">
                                            <h4>Key Highlights</h4>
                                            <div className="highlight-tags">
                                                {feature_points.map((point, index) => (
                                                    <span key={index} className="highlight-tag">
                                                        {point}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'benefits' && (
                                <div className="tab-panel">
                                    <h3>Client Benefits</h3>
                                    <div className="benefits-list">
                                        {benefits.map((benefit, index) => (
                                            <div key={index} className="benefit-item">
                                                <div className="benefit-number">{index + 1}</div>
                                                <div className="benefit-content">
                                                    <h4>Benefit {index + 1}</h4>
                                                    <p>{benefit}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'faq' && faqs.length > 0 && (
                                <div className="tab-panel">
                                    <h3>Frequently Asked Questions</h3>
                                    <div className="faq-accordion">
                                        {faqs.map((faq, index) => (
                                            <div key={index} className="faq-item">
                                                <div className="faq-question">
                                                    <span>{faq.question}</span>
                                                    <span className="faq-toggle">+</span>
                                                </div>
                                                <div className="faq-answer">
                                                    <p>{faq.answer}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 🚀 1. Related Services Slider (Explore Our Services) */}
                {allServices.length > 0 && (
                    <section className="related-services-section">
                        <div className="section-header">
                            <h2>Explore Our Services</h2>
                            <p>Other solutions tailored for your business needs</p>
                        </div>
                        <div 
                            className="services-slider" 
                            ref={sliderRefService} // ⬅️ Dedicated ref for Services
                            onMouseEnter={handleSliderInteraction}
                            onTouchStart={handleSliderInteraction}
                        >
                            {allServices.map((relatedService) => (
                                <div 
                                    key={`service-${relatedService.id}`}
                                    className="service-slide-card"
                                    onClick={() => handleNavigationClick(relatedService.slug, 'service')}
                                    role="button"
                                    tabIndex={0}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            handleNavigationClick(relatedService.slug, 'service');
                                        }
                                    }}
                                >
                                    <div className="slide-image-wrapper">
                                        <img
                                            src={relatedService.feature_image || "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                                            alt={relatedService.title}
                                            loading="lazy"
                                            onError={(e) => handleImageError(e)}
                                        />
                                        <div className="slide-overlay">
                                            <span className="view-details">View Details</span>
                                        </div>
                                    </div>
                                    <div className="slide-content">
                                        <h3>{relatedService.title}</h3>
                                        <p>{relatedService.short_description}</p>
                                        <div className="slide-cta">
                                            Learn More
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                
                {/* 🚀 2. Related Projects Slider (Featured Case Studies) */}
                {allProjects.length > 0 && (
                    <section className="related-services-section"> {/* Re-using service section CSS */}
                        <div className="section-header">
                            <h2>Featured Case Studies & Projects</h2>
                            <p>See how we deliver results for our clients</p>
                        </div>
                        <div 
                            className="services-slider" // Re-using service slider CSS
                            ref={sliderRefProject} // ⬅️ Dedicated ref for Projects
                            onMouseEnter={handleSliderInteraction}
                            onTouchStart={handleSliderInteraction}
                        >
                            {allProjects.map((project) => {
                                const { image, description } = getProjectContent(project);
                                
                                return (
                                    <div 
                                        key={`project-${project.id}`} 
                                        className="service-slide-card" // Re-using service card CSS
                                        onClick={() => handleNavigationClick(project.slug, 'project')}
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                handleNavigationClick(project.slug, 'project');
                                            }
                                        }}
                                    >
                                        <div className="slide-image-wrapper">
                                            <img
                                                src={image || "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                                                alt={project.title}
                                                loading="lazy"
                                                onError={(e) => handleImageError(e)}
                                            />
                                            <div className="slide-overlay">
                                                <span className="view-details">View Case Study</span>
                                            </div>
                                        </div>
                                        <div className="slide-content">
                                            <h3>{project.title}</h3>
                                            <p>{description}</p>
                                            <div className="slide-cta">
                                                View Project
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}


                {/* 📞 Call to Action */}
                <section className="service-cta-section">
                    <div className="cta-container">
                        <div className="cta-content">
                            <h2>Ready to Transform Your Business?</h2>
                            <p>Let's discuss your project and create something amazing together.</p>
                            <div className="cta-buttons">
                                <button className="cta-button primary large">
                                    Get Free Consultation
                                </button>
                                <button className="cta-button secondary large">
                                    📞 Call: +1 (555) 123-4567
                                </button>
                            </div>
                        </div>
                        <div className="cta-features">
                            <div className="cta-feature">
                                <div className="feature-icon">🎯</div>
                                <span>Custom Solutions</span>
                            </div>
                            <div className="cta-feature">
                                <div className="feature-icon">⚡</div>
                                <span>Fast Delivery</span>
                            </div>
                            <div className="cta-feature">
                                <div className="feature-icon">💎</div>
                                <span>Premium Quality</span>
                            </div>
                        </div>
                    </div>
                </section>

            </article>
        </Layout>
    );
};

export default ServiceDetail;