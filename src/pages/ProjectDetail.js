// src/pages/ProjectDetail.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../css/ProjectDetail.css'; 
import { API_BASE_URL } from '../api/baseurl'; 

// Utility function to render HTML content safely
const renderHTML = (htmlString) => {
    return { __html: htmlString };
};

// Function to clean and format text content
const cleanTextContent = (text) => {
    if (!text) return '';
    
    // Remove extra whitespace, normalize line breaks
    return text
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();
};

// Function to extract plain text from HTML for descriptions
const extractPlainText = (htmlString) => {
    if (!htmlString) return '';
    
    // Create temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    // Get text content and clean it
    return cleanTextContent(tempDiv.textContent || tempDiv.innerText || '');
};

// Function to get a random image that hasn't been used yet
const getRandomUniqueImage = (images, usedIndex = -1) => {
    if (!images || images.length === 0) return { image: null, index: -1 };
    
    if (images.length === 1) return { image: images[0].image, index: 0 };
    
    let randomIndex;
    let attempts = 0;
    
    do {
        randomIndex = Math.floor(Math.random() * images.length);
        attempts++;
    } while (randomIndex === usedIndex && attempts < 10);
    
    if (randomIndex === usedIndex) {
        randomIndex = (usedIndex + 1) % images.length;
    }

    return { image: images[randomIndex].image, index: randomIndex };
};

// Utility to extract image and description from a project object
const getProjectContent = (project) => {
    let image = null;
    let description = 'View case study for full details.';

    // Check for GALLERY/IMAGES array first
    if (project.gallery && project.gallery.length > 0) {
        image = project.gallery[0].image; 
    } 
    
    // Check for standard feature image/thumbnail
    if (!image && project.feature_image) {
        image = project.feature_image;
    } 
    
    // Check for description fields and clean the content
    if (project.short_description) {
        description = cleanTextContent(project.short_description);
    } else if (project.description) {
        const plainText = extractPlainText(project.description);
        description = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
    }

    // Handle Mock/Custom Structure
    if (project.content) {
        const imageItem = project.content.find(item => item.type === 'image');
        const descriptionItem = project.content.find(item => item.type === 'description');
        if (imageItem && !image) image = imageItem.value;
        if (descriptionItem && description === 'View case study for full details.') {
            description = cleanTextContent(descriptionItem.value);
        }
    }

    return {
        image: image,
        description: description,
    };
};

const ProjectDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allServices, setAllServices] = useState([]);
    const [allProjects, setAllProjects] = useState([]); 
    
    const sliderRefService = useRef(null);
    const sliderRefProject = useRef(null);
    const featuresSliderRef = useRef(null);
    const [aboutImageIndex, setAboutImageIndex] = useState(-1);
    
    const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Modal functions
    const openModal = useCallback((index) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden'; 
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedImageIndex(-1);
        document.body.style.overflow = 'auto'; 
    }, []);

    const showNextImage = useCallback(() => {
        if (!project || !project.gallery || project.gallery.length === 0) return;
        setSelectedImageIndex((prevIndex) => 
            (prevIndex + 1) % project.gallery.length
        );
    }, [project]);

    const showPrevImage = useCallback(() => {
        if (!project || !project.gallery || project.gallery.length === 0) return;
        setSelectedImageIndex((prevIndex) => 
            (prevIndex - 1 + project.gallery.length) % project.gallery.length
        );
    }, [project]);
    
    // Navigation handlers
    const handleServiceClick = useCallback((serviceSlug) => {
        navigate(`/services/${serviceSlug}`); 
    }, [navigate]);
    
    const handleProjectClick = useCallback((projectSlug) => {
        navigate(`/projects/${projectSlug}`); 
    }, [navigate]);

    // Image error handler
    const handleImageError = useCallback((e) => {
        e.target.onerror = null; 
        e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
    }, []); 

    // Data fetching functions
    const fetchProjectDetail = useCallback(async (currentSlug) => {
        if (!currentSlug) {
            setError("Project slug is missing.");
            setLoading(false);
            return;
        }
    
        const apiUrl = `${API_BASE_URL}projects/${currentSlug}/`;

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch detail for slug: ${currentSlug} (Status: ${response.status})`);
            }

            const data = await response.json();
            setProject(data);

            const aboutImages = data.about_images || [];
            const { index } = getRandomUniqueImage(aboutImages);
            setAboutImageIndex(index);

        } catch (err) {
            console.error("Error fetching project detail:", err);
            setError(err.message);
            setProject(null);
            setAboutImageIndex(-1);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAllServices = useCallback(async () => {
        const apiUrl = `${API_BASE_URL}services/`; 
        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch services (Status: ${response.status})`);
            }

            const data = await response.json();
            setAllServices(Array.isArray(data) ? data : (data.results || []));
        } catch (err) {
            console.error("Error fetching all services:", err);
            setAllServices([]); 
        }
    }, []);
    
    const fetchAllProjects = useCallback(async (currentSlug) => {
        const apiUrl = `${API_BASE_URL}projects/`; 
        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                console.error("Failed to fetch all projects for slider.");
                return;
            }

            const data = await response.json();
            const projectsArray = Array.isArray(data) ? data : (data.results || []);
            const filteredData = projectsArray.filter(p => p.slug !== currentSlug);
            setAllProjects(filteredData);
            
        } catch (err) {
            console.error("Error fetching all projects:", err);
            setAllProjects([]); 
        }
    }, []);

    useEffect(() => {
        fetchProjectDetail(slug);
        fetchAllServices();
        fetchAllProjects(slug);
    }, [slug, fetchProjectDetail, fetchAllServices, fetchAllProjects]);
    
    // Scroll function for features
    const scrollFeatures = (direction) => {
        if (featuresSliderRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300; 
            featuresSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Loading component
    const LoadingComponent = () => (
        <Layout>
            <div className="project-detail-loading">
                <div className="loading-skeleton">
                    <div className="skeleton-hero"></div>
                    <div className="skeleton-content">
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line short"></div>
                    </div>
                </div>
            </div>
        </Layout>
    );

    // Error component
    const ErrorComponent = () => (
        <Layout>
            <div className="project-detail-error">
                <div className="error-icon">⚠️</div>
                <h2>Project Not Found</h2>
                <p>We couldn't find the project you're looking for.</p>
                <p className="error-message">Error: {error}</p>
                <button 
                    className="back-button"
                    onClick={() => navigate('/projects')}
                >
                    Back to Projects
                </button>
            </div>
        </Layout>
    );

    if (loading) {
        return <LoadingComponent />;
    }

    if (error || !project) {
        return <ErrorComponent />;
    }
    
    // Destructure project properties
    const {
        title,
        short_description,
        services,
        industries,
        gallery = [],
        stack_images = [],
        about_project,
        more_about, 
        about_images = [], 
        features = [], 
        result_overview,
        desktop_view_video,
    } = project;

    // Content preparation
    const randomHeroImage = gallery.length > 0 
        ? gallery[Math.floor(Math.random() * gallery.length)].image 
        : null;

    const limitedIndustries = industries?.industries?.slice(0, 3) || [];
    const randomAboutImage = about_images[aboutImageIndex]?.image;
    const randomMoreAboutImage = getRandomUniqueImage(about_images, aboutImageIndex)?.image;
    const filteredServices = allServices.filter(service => service.slug !== slug);
    const currentModalImage = gallery[selectedImageIndex]?.image;

    // Clean text content for display
    const cleanShortDescription = cleanTextContent(short_description);
    const cleanAboutProject = about_project ? extractPlainText(about_project) : '';
    const cleanMoreAbout = more_about ? extractPlainText(more_about) : '';
    const cleanResultOverview = result_overview ? extractPlainText(result_overview) : '';

    return (
        <Layout>
            <article className="project-detail-page">

                {/* Hero Section */}
                <section className="new-project-hero-section">
                    <div className="hero-background-wrapper">
                        {randomHeroImage && (
                            <img
                                src={randomHeroImage}
                                alt={title}
                                className="hero-background-image-new"
                                onError={handleImageError}
                            />
                        )}
                        <div className="hero-overlay-dark"></div>
                    </div>

                    <div className="hero-content-new">
                        <div className="hero-text-area">
                            <h1 className="project-main-title-new">{title}</h1>
                            {cleanShortDescription && (
                                <p className="project-hero-description-new">
                                    {cleanShortDescription}
                                </p>
                            )}
                            
                            <div className="project-meta-container">
                                <div className="meta-block">
                                    <span className="meta-label">Services</span>
                                    <div className="meta-values">
                                        {services?.services?.map((service, index) => (
                                            <span key={index} className="meta-tag service-tag">
                                                {cleanTextContent(service)}
                                            </span>
                                        )) ?? <span className="meta-tag service-tag">N/A</span>}
                                    </div>
                                </div>
                                
                                <div className="meta-block">
                                    <span className="meta-label">Industries</span>
                                    <div className="meta-values">
                                        {limitedIndustries.map((industry, index) => (
                                            <span key={index} className="meta-tag industry-tag">
                                                {cleanTextContent(industry)}
                                            </span>
                                        )) ?? <span className="meta-tag industry-tag">N/A</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Tech Stack Section */}
                {stack_images.length > 0 && (
                    <section className="tech-stack-section">
                        <div className="tech-stack-container">
                            {stack_images.map((stackItem, index) => (
                                <div key={index} className="stack-item">
                                    <img
                                        src={stackItem.image}
                                        alt={stackItem.caption || 'Technology Icon'}
                                        className="stack-icon"
                                        loading="lazy"
                                        onError={handleImageError}
                                    />
                                    {stackItem.caption && (
                                        <p className="stack-caption">
                                            {cleanTextContent(stackItem.caption)}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                
                {/* About the Project Section */}
                {(randomAboutImage || about_project) && (
                    <section className="about-project-section">
                        <div className="about-content-wrapper">
                            {randomAboutImage && (
                                <div className="about-image-side">
                                    <img 
                                        src={randomAboutImage}
                                        alt={`${title} project detail`}
                                        className="about-image"
                                        loading="lazy"
                                        onError={handleImageError}
                                    />
                                </div>
                            )}

                            <div className="about-text-side">
                                <h2 className="about-title">About the Project</h2>
                                {cleanAboutProject && (
                                    <div 
                                        className="about-description"
                                        dangerouslySetInnerHTML={renderHTML(about_project)}
                                    />
                                )}
                            </div>
                        </div>
                    </section>
                )}
                
                {/* More About Section */}
                {(randomMoreAboutImage || more_about) && (
                    <section className="more-about-section">
                        <div className="about-content-wrapper mirrored">
                            {randomMoreAboutImage && (
                                <div className="about-image-side">
                                    <img 
                                        src={randomMoreAboutImage}
                                        alt={`${title} project detail 2`}
                                        className="about-image"
                                        loading="lazy"
                                        onError={handleImageError}
                                    />
                                </div>
                            )}
                            
                            <div className="about-text-side">
                                <h2 className="about-title">More About the Project</h2>
                                {cleanMoreAbout && (
                                    <div 
                                        className="about-description"
                                        dangerouslySetInnerHTML={renderHTML(more_about)}
                                    />
                                )}
                            </div>
                        </div>
                    </section>
                )}
                
                {/* Features Section */}
                {features.length > 0 && (
                    <section className="features-container-wrapper">
                        <div className="features-section">
                            <div className="features-header-content">
                                <h2 className="features-title">Key Features</h2>
                                {cleanShortDescription && (
                                    <p className="features-subtitle">{cleanShortDescription}</p>
                                )}
                            </div>
                            
                            <div className="features-carousel-container">
                                <div className="features-carousel-wrapper" ref={featuresSliderRef}>
                                    {features.map((feature, index) => (
                                        <div key={index} className="feature-card">
                                            <h3 className="feature-card-title">
                                                {cleanTextContent(feature.title)}
                                            </h3>
                                            <p className="feature-card-description">
                                                {cleanTextContent(feature.description)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="carousel-nav">
                                    <button className="nav-button left" onClick={() => scrollFeatures('left')}>
                                        &lt;
                                    </button>
                                    <button className="nav-button right" onClick={() => scrollFeatures('right')}>
                                        &gt;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Result Section */}
                {(result_overview || desktop_view_video) && (
                    <section className="result-section">
                        <div className="result-content-wrapper">
                            <div className="result-text-side">
                                <h2 className="result-title">Project Results</h2>
                                {cleanResultOverview && (
                                    <div 
                                        className="result-description"
                                        dangerouslySetInnerHTML={renderHTML(result_overview)}
                                    />
                                )}
                            </div>

                            {desktop_view_video && (
                                <div className="result-media-side">
                                    {desktop_view_video.toLowerCase().match(/\.(mp4|webm|ogg)$/) ? (
                                        <video 
                                            src={desktop_view_video} 
                                            alt={`${title} result video`}
                                            className="result-media"
                                            autoPlay={true}
                                            loop={true}
                                            muted={true}
                                            controls={false}
                                            onError={handleImageError}
                                        />
                                    ) : (
                                        <img 
                                            src={desktop_view_video}
                                            alt={`${title} result visualization`}
                                            className="result-media"
                                            loading="lazy"
                                            onError={handleImageError}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </section>
                )}
                
                {/* Gallery Section */}
                {gallery.length > 0 && (
                    <section className="gallery-section">
                        <div className="gallery-container">
                            <h2 className="gallery-title">Project Gallery</h2>
                            <p className="gallery-subtitle">
                                A visual journey through the {title} project.
                            </p>
                            
                            <div className="gallery-grid">
                                {gallery.map((item, index) => (
                                    <div 
                                        key={index} 
                                        className="gallery-item"
                                        onClick={() => openModal(index)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => { if (e.key === 'Enter') openModal(index); }}
                                    >
                                        <img
                                            src={item.image}
                                            alt={`Gallery image ${index + 1} for ${title}`}
                                            className="gallery-image"
                                            loading="lazy"
                                            onError={handleImageError}
                                        />
                                        <div className="gallery-zoom-overlay">
                                            View Full Image
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Related Services Slider */}
                {filteredServices.length > 0 && (
                    <section className="related-services-section">
                        <div className="section-header">
                            <h2>Explore Our Services</h2>
                            <p>Discover comprehensive solutions for your business needs</p>
                        </div>
                        <div className="services-slider" ref={sliderRefService}>
                            {filteredServices.map((relatedService) => (
                                <div 
                                    key={relatedService.id} 
                                    className="service-slide-card"
                                    onClick={() => handleServiceClick(relatedService.slug)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="slide-image-wrapper">
                                        <img
                                            src={relatedService.feature_image || "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                                            alt={relatedService.title}
                                            loading="lazy"
                                            onError={handleImageError}
                                        />
                                        <div className="slide-overlay">
                                            <span className="view-details">View Details</span>
                                        </div>
                                    </div>
                                    <div className="slide-content">
                                        <h3>{cleanTextContent(relatedService.title)}</h3>
                                        <p>{cleanTextContent(relatedService.short_description)}</p>
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

                {/* Related Projects Slider */}
                {allProjects.length > 0 && (
                    <section className="related-services-section">
                        <div className="section-header">
                            <h2>Featured Case Studies</h2>
                            <p>Explore more of our successful projects and achievements</p>
                        </div>
                        <div className="services-slider" ref={sliderRefProject}>
                            {allProjects.map((projectItem) => {
                                const { image, description } = getProjectContent(projectItem);
                                
                                return (
                                    <div 
                                        key={`project-${projectItem.id}`} 
                                        className="service-slide-card" 
                                        onClick={() => handleProjectClick(projectItem.slug)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                handleProjectClick(projectItem.slug);
                                            }
                                        }}
                                    >
                                        <div className="slide-image-wrapper">
                                            <img
                                                src={image || "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                                                alt={projectItem.title}
                                                loading="lazy"
                                                onError={handleImageError}
                                            />
                                            <div className="slide-overlay">
                                                <span className="view-details">View Case Study</span>
                                            </div>
                                        </div>
                                        <div className="slide-content">
                                            <h3>{cleanTextContent(projectItem.title)}</h3>
                                            <p>{projectItem.description}</p>
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

            </article>

            {/* Gallery Modal */}
            {isModalOpen && currentModalImage && (
                <div className="gallery-modal-overlay" onClick={closeModal}>
                    <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-button" onClick={closeModal}>
                            &times;
                        </button>
                        
                        <img 
                            src={currentModalImage} 
                            alt={`Full view of ${title} gallery item`} 
                            className="modal-full-image" 
                            onError={handleImageError}
                        />

                        {gallery.length > 1 && ( 
                            <>
                                <button className="modal-nav-button modal-prev" onClick={showPrevImage}>
                                    &lt;
                                </button>
                                <button className="modal-nav-button modal-next" onClick={showNextImage}>
                                    &gt;
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ProjectDetail;