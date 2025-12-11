// src/pages/ServiceDetail.js

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import '../css/ServiceDetail.css'; 
import { API_BASE_URL } from '../api/baseurl'; 
import dotvideo from '../images/dotvideo.mp4';

// Utility function to render HTML content safely
const renderHTML = (htmlString) => {
    return { __html: htmlString };
};

const ServiceDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFaq, setActiveFaq] = useState(null);
    const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
    
    // 2. Define state for Related Services (allServices) and Projects (allProjects)
    const [allServices, setAllServices] = useState([]);
    const [allProjects, setAllProjects] = useState([]);

    // 3. Define refs for the sliders
    const sliderRefService = useRef(null);
    const sliderRefProject = useRef(null);
    
    // =========================================================================
    // 1. DEDICATED API FETCH FUNCTIONS
    // =========================================================================
    
    // Function to fetch ALL services (Filtered to exclude current)
    const fetchAllServices = async (currentSlug) => {
        const apiUrl = `${API_BASE_URL}services/`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const servicesArray = Array.isArray(data) ? data : (data.results || []);
            const filteredData = servicesArray.filter(s => s.slug !== currentSlug);
            setAllServices(filteredData); 
        } catch (err) {
            console.error("Error fetching all services:", err);
        }
    };

    // Function to fetch ALL projects
    const fetchAllProjects = async () => {
        const apiUrl = `${API_BASE_URL}projects/`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const projectsArray = Array.isArray(data) ? data : (data.results || []);
            setAllProjects(projectsArray); 
        } catch (err) {
            console.error("Error fetching all projects:", err);
        }
    };
    
    // Function to fetch the detail of the current service
    const fetchServiceDetail = async (currentSlug) => {
        if (!currentSlug) {
            setError("Service slug is missing.");
            setLoading(false);
            return;
        }

        const apiUrl = `${API_BASE_URL}services/${currentSlug}/`;

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch service details (Status: ${response.status})`);
            }

            const data = await response.json();
            setService(data);
            
        } catch (err) {
            console.error("Error fetching service detail:", err);
            setError(err.message);
            setService(null);
        } finally {
            setLoading(false);
        }
    };

    // Toggle FAQ accordion
    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    // Navigate gallery images (keeping original utility functions)
    const nextGalleryImage = () => {
        if (service?.gallery_images?.length) {
            setCurrentGalleryIndex((prev) => 
                prev === service.gallery_images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevGalleryImage = () => {
        if (service?.gallery_images?.length) {
            setCurrentGalleryIndex((prev) => 
                prev === 0 ? service.gallery_images.length - 1 : prev - 1
            );
        }
    };
    
    // Utility for handling navigation to related services/projects
    const handleNavigationClick = (targetSlug, type) => {
        const path = type === 'service' ? `/services/${targetSlug}` : `/projects/${targetSlug}`;
        navigate(path);
    };

    // Utility for handling image errors
    const handleImageError = (e) => {
        e.target.onerror = null; 
        e.target.src = "https://via.placeholder.com/500x300?text=Image+Not+Found"; 
    };
    
    // Utility for handling slider interaction 
    const handleSliderInteraction = () => {
        console.log("Slider interaction detected (mouse or touch)");
    };

    // Utility to extract image and description from a project object
    const getProjectContent = (project) => {
        let image = null;
        let description = 'View case study for full details.';

        if (project.gallery && project.gallery.length > 0) {
            image = project.gallery[0].image;
        } 
        
        if (!image && project.feature_image) {
            image = project.feature_image;
        } 
        
        if (!image && project.gallery_images && project.gallery_images.length > 0) {
            image = project.gallery_images[0].image;
        } else if (!image && project.images && project.images.length > 0) {
            image = project.images[0].image;
        }

        if (project.short_description) {
            description = project.short_description;
        } else if (project.description) {
            description = project.description.substring(0, 100) + '...'; 
        }

        if (project.content) {
             const imageItem = project.content.find(item => item.type === 'image');
             const descriptionItem = project.content.find(item => item.type === 'description');
             if (imageItem && !image) image = imageItem.value;
             if (descriptionItem && description === 'View case study for full details.') description = descriptionItem.value;
        }

        return {
            image: image,
            description: description,
        };
    };
    
    useEffect(() => {
        fetchServiceDetail(slug);
        fetchAllServices(slug); 
        fetchAllProjects(); 
    }, [slug]);

    const LoadingSkeleton = () => (
        <Layout>
            <div className="detail-loading">
                <div className="skeleton-breadcrumb"></div>
                <div className="skeleton-header">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-subtitle"></div>
                </div>
                <div className="skeleton-content-section">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-text"></div>
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
        feature_image,
        gallery_images = [],
        feature_points = [],
        core_services = [],
        benefits = [],
        faqs = []
    } = service;


    return (
        <Layout>
            <article className="service-detail-page">

                {/* 🎯 Hero Section */}
                <section 
                    className="new-service-hero-section"
                    style={{ backgroundImage: `url(${feature_image})` }}
                >
                    <div className="hero-overlay"></div>
                    <div className="service-hero-container center-content-container"> 
                        
                        <div className="hero-content text-center"> 
                            
                            <div className="hero-text">
                                {/* 1. Main Title */}
                                <h1 className="service-main-title">{title}</h1>
                                
                                {/* 2. Subtitle (detail_title) */}
                                <p className="service-hero-description detail-title-text">{detail_title}</p>

                                {/* 3. Full Detail Description (Larger Content) */}
                                <div className="hero-full-description-wrapper">
                                    <div 
                                        className="hero-full-description-content"
                                        dangerouslySetInnerHTML={renderHTML(detail_description)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* ⭐ WHITE SPACE/GAP SECTION (Feature Points) - Placed after Hero, before Gallery */}
                {feature_points.length > 0 && (
                    <div className="seo-features-container-wrapper white-section-spacing"> 
                        <section className="seo-features-section"> 
                            
                            <div className="seo-features-header-content">
                                <h2 className="seo-features-title">Why Choose Our {title} Service?</h2>
                                <p className="seo-features-subtitle">
                                    Discover the core advantages and unique value propositions of partnering with us.
                                </p>
                            </div>

                            <div className="seo-features-carousel-container">
                                <div className="seo-features-carousel-wrapper"> 
                                    {feature_points.map((feature, index) => (
                                        <div key={index} className="seo-feature-card">
                                            <div className="seo-feature-content">
                                                <h3 className="seo-feature-card-title">Feature {index + 1}</h3> 
                                                <p className="seo-feature-card-description">{feature}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </section>
                    </div>
                )}
                
                {/* 🎨 Gallery Images Section - Dark Brown Background with Caption Hover */}
                {gallery_images.length > 0 && (
                    <section className="new-gallery-section dark-brown-bg">
                        <div className="gallery-container tight-grid"> 
                            {gallery_images.map((gallery, index) => (
                                <div 
                                    key={index} 
                                    className="gallery-item"
                                >
                                    <div className="gallery-image-wrapper">
                                        <img
                                            src={gallery.image}
                                            alt={gallery.caption || `${title} gallery image ${index + 1}`}
                                            className="gallery-image"
                                            onError={handleImageError}
                                        />
                                        {/* ⭐ New Caption Element */}
                                        {gallery.caption && (
                                            <div className="gallery-caption">
                                                <p>{gallery.caption}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}


                {/* 🛠️ Enhanced Core Services Section */}
                {core_services.length > 0 && (
                    <section className="core-services-main-section">
                        <div className="core-services-wrapper">
                            <h2 className="core-services-main-title">Our Core Services</h2>
                            <div className="core-services-cards-grid">
                                {core_services.map((service, index) => (
                                    <div key={index} className="core-service-single-card">
                                        <div className="core-service-card-header">
                                            <div className="core-service-card-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="core-service-card-content">
                                            <h3 className="core-service-card-title">{service}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
                
                {/* 💎 Enhanced Benefits Section */}
                {/* {benefits.length > 0 && (
                    <section className="enhanced-benefits-section">
                        <div className="benefits-container">
                            <h2 className="section-title">Client Benefits</h2>
                            <div className="benefits-grid">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="benefit-card">
                                        <div className="benefit-icon-wrapper">
                                        </div>
                                        <div className="benefit-content">
                                            <h3 className="benefit-title">Benefit 0{index + 1}</h3>
                                            <p className="benefit-description">{benefit}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )} */}

                // ❓ Enhanced FAQ Section
{faqs.length > 0 && (
    <section className="enhanced-faq-section">
        <div className="faq-container">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="faq-grid">
                {faqs.map((faq, index) => (
                    <div 
                        key={index} 
                        className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                    >
                        <div 
                            className="faq-question"
                            onClick={() => toggleFaq(index)}
                        >
                            <h3>{faq.question}</h3>
                            <div className="faq-toggle">
                                <span className="toggle-icon">
                                    {activeFaq === index ? '−' : '+'}
                                </span>
                            </div>
                        </div>
                        <div className="faq-answer">
                            <p>{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
)}

                {/* 🚀 2. Related Projects Slider (Featured Case Studies) */}
                {allProjects.length > 0 && (
                    <section className="related-services-section"> 
                        <div className="section-header">
                            <h2>Featured Case Studies & Projects</h2>
                            <p>See how we deliver results for our clients</p>
                        </div>
                        <div 
                            className="services-slider" 
                            ref={sliderRefProject} 
                            onMouseEnter={handleSliderInteraction}
                            onTouchStart={handleSliderInteraction}
                        >
                            {allProjects.map((project) => {
                                const { image, description } = getProjectContent(project);
                                
                                return (
                                    <div 
                                        key={`project-${project.id}`} 
                                        className="service-slide-card project-slide-card" 
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
                <section className="trial-section-updated">
            <div className="video-background-wrapper">
                <video
                    src={dotvideo}
                    className="dot-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                />
            </div>
            
            <div className="trial-content">
                {/* Mobile ke liye bhi space ensure karo */}
                <h2 className="trial-heading">
                    Start your free website trial<br /> today
                </h2>
                <p className="trial-subheading">
                    No credit card required. Satisfactions guaranteed.
                </p>
                <Link to="/ContactUs" className="trial-cta">
                    GET STARTED
                </Link>
            </div>
        </section>

                
                

            </article>
        </Layout>
    );
};

export default ServiceDetail;