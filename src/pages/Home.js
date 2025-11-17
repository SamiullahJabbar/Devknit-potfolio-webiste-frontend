// src/pages/Home.js

import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout'; 
import '../css/HeroSection.css'; 
import { Link } from 'react-router-dom';
import '../css/articles.css';

// --- BASE URL IMPORT ---
import { API_BASE_URL } from '../api/baseurl'; 

// Image Imports (fallback ke liye rakhte hain)
import p1 from '../images/p1.webp'; 
import p2 from '../images/p2.webp'; 
import p3 from '../images/p3.webp'; 
import p4 from '../images/p4.webp'; 
import grid_img_1 from '../images/p5.webp';
import grid_img_2 from '../images/p6.webp';
import grid_img_3 from '../images/p7.webp';
import grid_img_4 from '../images/p8.webp';
import grid_img_5 from '../images/p9.webp';
import grid_img_6 from '../images/p10.webp';
import grid_img_7 from '../images/p13.webp';
import grid_img_8 from '../images/p12.webp';
import drink_finder_image from '../images/p11.webp'; 

// --- STATIC DATA (remove kiya) ---
const scrollProjects = [];

// --- COMPONENT DEFINITIONS ---
const HeroSection = () => { 
    return (
        <section className="hero-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
            <div className="hero-content">
                <div className="hero-badge" style={{ backgroundColor: '#f8f8f8ff', color: '#ffffff' }}>
                    <span>Creative developer with a focus on user-friendly digital experiences.</span>
                </div>
                <h1 className="hero-heading" style={{ color: '#000000' }}>
                    Creating high-quality websites that deliver real results. <span className="hero-accent" style={{ color: '#000000' }}></span> 
                </h1>
                <p className="hero-description" style={{ color: '#000000' }}>
                    we help businesses grow with smart design, fast performance, and user-friendly development.
                </p>
                <div className="hero-actions">
                    <a href="ContactUs" className="hero-cta primary" style={{ backgroundColor: '#ffffffff', color: '#fcfcfcff' }}>
                        Start Your Project
                    </a>
                    <a href="Projects" className="hero-cta secondary" style={{ backgroundColor: 'transparent', color: '#000000', border: '2px solid #000000' }}>
                        View Portfolio
                    </a>
                </div>
            </div>
        </section>
    );
};

const ScrollIndicator = ({ projects, activeIndex, isGalleryActive }) => { 
    return (
        <div className="scroll-indicator">
            {projects.map((project, index) => (
                <div 
                    key={project.id}
                    className={`indicator-dot ${activeIndex === index ? 'active' : ''}`}
                    style={{
                        backgroundColor: activeIndex === index ? '#0e0c01ff' : '#666666'
                    }}
                    data-title={project.title}
                    onClick={() => {
                        const element = document.getElementById(`project-${project.id}`);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                ></div>
            ))}
        </div>
    );
};

const ProgressBar = ({ progress, isGalleryActive }) => { 
    return (
        <div className="progress-container" style={{ backgroundColor: '#333333' }}>
            <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: '#ffd700' }}></div>
        </div>
    );
};

const ScrollHint = ({ isGalleryActive }) => { 
    return (
        <div className="scroll-hint" style={{ color: '#ffffff' }}>
            <span>Scroll to Discover</span>
            <div className="scroll-arrow" style={{ color: '#ffffff' }}>↓</div>
        </div>
    );
};

// --- NEW: API-based Gallery Section ---
const ApiGallerySection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isGalleryActive, setIsGalleryActive] = useState(false);
    const [galleryProjects, setGalleryProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const galleryRef = useRef(null);
    const observerRef = useRef(null);

    // API se services fetch karna
    useEffect(() => {
        const fetchServicesForGallery = async () => {
            const apiUrl = `${API_BASE_URL}services/`;
            try {
                setLoading(true);
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                let servicesData = Array.isArray(data) ? data : (data.results || data.data || []);
                
                // Random 4 services select karna
                const shuffled = [...servicesData].sort(() => 0.5 - Math.random());
                const randomServices = shuffled.slice(0, 4);
                
                // Gallery projects format karna
                const galleryData = randomServices.map(service => ({
                    id: service.id,
                    title: service.title,
                    image: service.gallery_images && service.gallery_images.length > 0 
                        ? service.gallery_images[0].image 
                        : service.feature_image,
                    link: `/services/${service.slug}`
                }));
                
                setGalleryProjects(galleryData);
            } catch (error) {
                console.error("❌ Failed to fetch services for gallery:", error);
                // Fallback: agar API fail ho to static data use karo
                setGalleryProjects(scrollProjects);
            } finally {
                setLoading(false);
            }
        };

        if (API_BASE_URL) {
            fetchServicesForGallery();
        } else {
            // Agar API_BASE_URL nahi hai to static data use karo
            setGalleryProjects(scrollProjects);
            setLoading(false);
        }
    }, []);

    // Scroll effects
    useEffect(() => {
        const handleScroll = () => {
            if (!galleryRef.current) return;
            const gallery = galleryRef.current;
            const scrollTop = gallery.scrollTop;
            const scrollHeight = gallery.scrollHeight - gallery.clientHeight;
            
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            setScrollProgress(progress);
            
            const slideHeight = gallery.clientHeight;
            const newActiveIndex = Math.round(scrollTop / slideHeight);
            setActiveIndex(Math.min(newActiveIndex, galleryProjects.length - 1));
        };

        const galleryElement = galleryRef.current; 
        if (galleryElement) {
            galleryElement.addEventListener('scroll', handleScroll);
            return () => galleryElement.removeEventListener('scroll', handleScroll);
        }
    }, [galleryProjects.length]);

    useEffect(() => {
        const galleryElement = galleryRef.current; 
        if (!galleryElement) return;

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                setIsGalleryActive(entry.isIntersecting); 
            },
            { threshold: 0.1 }
        );

        observerRef.current.observe(galleryElement);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect(); 
            }
        };
    }, []);

    if (loading) {
        return (
            <section className="projects-gallery-section" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
                <div className="section-header">
                    <div className="loading-spinner"></div>
                    <h2 className="section-title" style={{ color: '#ffffff' }}>Loading Gallery...</h2>
                </div>
            </section>
        );
    }

    return (
        <section className="projects-gallery-section" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
            <div className="section-header">
                <div className="section-badge" style={{ backgroundColor: '#ffd700', color: '#000000' }}>Portfolio</div>
                <h2 className="section-title" style={{ color: '#ffffff' }}>
                    Premium Featured Projects
                </h2>
                <p className="section-description" style={{ color: '#ffffff' }}>
                    Explore modern, clean, and conversion-focused website designs.
                </p>
            </div>

            <ProgressBar progress={scrollProgress} isGalleryActive={isGalleryActive} />
            <ScrollHint isGalleryActive={isGalleryActive} />

            <div className="project-gallery" ref={galleryRef}>
                {galleryProjects.map((project, index) => (
                    <div 
                        key={project.id} 
                        id={`project-${project.id}`}
                        className="project-slide"
                        style={{ backgroundColor: '#000000' }}
                    >
                        <div className="project-image-container">
                            <img 
                                src={project.image} 
                                alt={project.title} 
                                className="project-image" 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    // Fallback image agar API image load na ho
                                    e.target.src = p1;
                                }}
                            />
                            <div className="project-info-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                                <div className="project-content">
                                    <h3 className="project-title" style={{ color: '#ffffff' }}>{project.title}</h3>
                                    <Link to={project.link} className="project-cta" style={{ backgroundColor: '#ffd700', color: '#000000' }}>
                                        View Service Details
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ScrollIndicator 
                projects={galleryProjects} 
                activeIndex={activeIndex} 
                isGalleryActive={isGalleryActive}
            />
        </section>
    );
};

// --- API-based Project Grid Section ---
const ProjectGrid = () => {
    const [gridProjects, setGridProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API se projects fetch karna
    useEffect(() => {
        const fetchProjectsForGrid = async () => {
            const apiUrl = `${API_BASE_URL}projects/`;
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                let projectsData = Array.isArray(data) ? data : (data.results || data.data || []);
                
                // Exactly 8 images ke liye logic
                const gridData = [];
                let projectIndex = 0;
                let imagesCollected = 0;
                const totalImagesNeeded = 8;

                while (imagesCollected < totalImagesNeeded && projectsData.length > 0) {
                    const currentProject = projectsData[projectIndex % projectsData.length];
                    
                    // Current project se available images collect karna
                    let availableImages = [];
                    
                    // Gallery images add karo
                    if (currentProject.gallery && currentProject.gallery.length > 0) {
                        availableImages = availableImages.concat(
                            currentProject.gallery.map(img => ({
                                image: img.image,
                                title: currentProject.title,
                                id: currentProject.id,
                                slug: currentProject.slug
                            }))
                        );
                    }
                    
                    // About images add karo
                    if (currentProject.about_images && currentProject.about_images.length > 0) {
                        availableImages = availableImages.concat(
                            currentProject.about_images.map(img => ({
                                image: img.image,
                                title: currentProject.title,
                                id: currentProject.id,
                                slug: currentProject.slug
                            }))
                        );
                    }
                    
                    // Stack images add karo (agar chahiye to)
                    if (currentProject.about_images && currentProject.about_images.length > 0) {
                        availableImages = availableImages.concat(
                            currentProject.about_images.map(img => ({
                                image: img.image,
                                title: currentProject.title,
                                id: currentProject.id,
                                slug: currentProject.slug
                            }))
                        );
                    }
                    
                    // More images add karo
                    if (currentProject.more_images && currentProject.more_images.length > 0) {
                        availableImages = availableImages.concat(
                            currentProject.more_images.map(img => ({
                                image: img.image,
                                title: currentProject.title,
                                id: currentProject.id,
                                slug: currentProject.slug
                            }))
                        );
                    }
                    
                    // Agar koi image available nahi hai to fallback image use karo
                    if (availableImages.length === 0) {
                        availableImages.push({
                            image: p1,
                            title: currentProject.title,
                            id: currentProject.id,
                            slug: currentProject.slug
                        });
                    }
                    
                    // Available images se required number of images le lo
                    const imagesToTake = Math.min(
                        availableImages.length,
                        totalImagesNeeded - imagesCollected
                    );
                    
                    // Random images select karo
                    const shuffledImages = [...availableImages].sort(() => 0.5 - Math.random());
                    const selectedImages = shuffledImages.slice(0, imagesToTake);
                    
                    // Grid data mein add karo
                    selectedImages.forEach(img => {
                        gridData.push({
                            id: `${img.id}-${imagesCollected}`, // Unique ID ensure karne ke liye
                            title: img.title,
                            image: img.image,
                            link: `/projects/${img.slug}`
                        });
                        imagesCollected++;
                    });
                    
                    projectIndex++;
                    
                    // Infinite loop se bachne ke liye - agar sab projects check kar liye aur abhi bhi images kam hain
                    if (projectIndex >= projectsData.length * 2 && imagesCollected < totalImagesNeeded) {
                        // Fallback: static images add karo
                        const fallbackImages = [p1, p2, p3, p4, grid_img_1, grid_img_2, grid_img_3, grid_img_4];
                        const remainingImages = totalImagesNeeded - imagesCollected;
                        
                        for (let i = 0; i < remainingImages; i++) {
                            gridData.push({
                                id: `fallback-${i}`,
                                title: "Featured Project",
                                image: fallbackImages[i % fallbackImages.length],
                                link: "#"
                            });
                            imagesCollected++;
                        }
                        break;
                    }
                }
                
                setGridProjects(gridData);
            } catch (error) {
                console.error("❌ Failed to fetch projects for grid:", error);
                setError(error.message);
                // Fallback: static images use karo
                const fallbackImages = [
                    { id: 1, title: "Pink/Gray Object Detail", image: grid_img_1, link: "#" },
                    { id: 2, title: "Yellow/Pink Products", image: grid_img_2, link: "#" },
                    { id: 3, title: "Dog and Flowers Scene", image: grid_img_3, link: "#" },
                    { id: 4, title: "Restaurant Menu Close-up", image: grid_img_4, link: "#" },
                    { id: 5, title: "Woman Washing Face", image: grid_img_5, link: "#" },
                    { id: 6, title: "Cat Portrait", image: grid_img_6, link: "#" },
                    { id: 7, title: "Leather Jacket Model", image: grid_img_7, link: "#" },
                    { id: 8, title: "Man on Sofa with Drink", image: grid_img_8, link: "#" }
                ];
                setGridProjects(fallbackImages);
            } finally {
                setLoading(false);
            }
        };

        if (API_BASE_URL) {
            fetchProjectsForGrid();
        } else {
            // Agar API_BASE_URL nahi hai to static data use karo
            const staticImages = [
                { id: 1, title: "Pink/Gray Object Detail", image: grid_img_1, link: "#" },
                { id: 2, title: "Yellow/Pink Products", image: grid_img_2, link: "#" },
                { id: 3, title: "Dog and Flowers Scene", image: grid_img_3, link: "#" },
                { id: 4, title: "Restaurant Menu Close-up", image: grid_img_4, link: "#" },
                { id: 5, title: "Woman Washing Face", image: grid_img_5, link: "#" },
                { id: 6, title: "Cat Portrait", image: grid_img_6, link: "#" },
                { id: 7, title: "Leather Jacket Model", image: grid_img_7, link: "#" },
                { id: 8, title: "Man on Sofa with Drink", image: grid_img_8, link: "#" }
            ];
            setGridProjects(staticImages);
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <section className="project-grid-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                <div className="section-header">
                    <div className="loading-spinner"></div>
                    <h2 className="section-title" style={{ color: '#000000' }}>Loading Projects...</h2>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="project-grid-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                <div className="section-header">
                    <h2 className="section-title" style={{ color: '#000000' }}>Error Loading Projects</h2>
                    <p style={{ color: '#ff0000' }}>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="project-grid-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
            <div className="section-header">
                <h2 className="section-title" style={{ color: '#000000' }}>
                    Featured <span className="accent" style={{ color: '#000000' }}>Design Projects</span>
                </h2>
                <p className="section-description" style={{ color: '#000000' }}>
                    A selection of recent work built with solid UI and reliable performance.
                </p>
            </div>
            <div className="project-grid">
                {gridProjects.map((project, index) => (
                    <div 
                        key={project.id} 
                        className="grid-item"
                        style={{ backgroundColor: '#ffffff' }}
                    >
                        <div className="grid-image-container">
                            <img 
                                src={project.image} 
                                alt={project.title} 
                                className="grid-item-image" 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    // Fallback image agar API image load na ho
                                    e.target.src = p1;
                                }}
                            />
                            <div className="grid-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                                <div className="grid-content">
                                    <h3 className="grid-title" style={{ color: '#ffffff' }}>{project.title}</h3>
                                    <Link to={project.link} className="grid-cta" style={{ backgroundColor: '#ffd700', color: '#000000' }}>
                                        View Project
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// --- BAKI SAB COMPONENTS WITHOUT LIMITS ---
const DrinkFinderSection = () => { 
    return (
        <section className="drink-finder-section" style={{ backgroundColor: '#ffffff', color: '#ffffffff' }}>
            <div className="section-header">
                <h2 className="section-title" style={{ color: '#000000' }}>
                    Real Results from <span className="accent" style={{ color: '#000000' }}>Strategic Design</span>
                </h2>
            </div>
            <div className="df-container">
                <div className="df-image-block">
                    <div className="image-wrapper">
                        <img 
                            src={drink_finder_image} 
                            alt="Drink Finder project showcase" 
                            className="df-image"
                        />
                    </div>
                </div>
                <div className="df-content-block">
                    <div className="project-badge" style={{ backgroundColor: '#fffefeff', color: '#080808ff' }}>Featured Case Study</div>
                    <h3 className="df-title" style={{ color: '#000000' }}>Drink Finder</h3>
                    <p className="df-intro" style={{ color: '#000000' }}>
                        Transforming one of the UK's leading online retailers for fine wines, spirits, and liqueurs with a bespoke Shopify experience.
                    </p>
                    <div className="df-features">
                        <div className="feature-item">
                            <div className="feature-icon" style={{ backgroundColor: '#ffd700', color: '#000000' }}>✓</div>
                            <span style={{ color: '#000000' }}>Modernized digital presence</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon" style={{ backgroundColor: '#ffd700', color: '#000000' }}>✓</div>
                            <span style={{ color: '#000000' }}>Simplified navigation</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon" style={{ backgroundColor: '#ffd700', color: '#000000' }}>✓</div>
                            <span style={{ color: '#000000' }}>Intuitive product discovery</span>
                        </div>
                    </div>
                    <div className="df-stats">
                        <div className="df-stat-item">
                            <span className="df-stat-number" style={{ color: '#ffffffff' }}>27%</span>
                        </div>
                        <div className="df-stat-item">
                            <span className="df-stat-number" style={{ color: '#ffffffff' }}>143%</span>
                            <span className="df-stat-label" style={{ color: '#ffffffff' }}>Growth in Checkout Starts</span>
                        </div>
                    </div>
                    <a href="#drink-finder-case-study" className="df-cta" style={{ backgroundColor: '#ffd700', color: '#000000' }}>
                        Read Full Case Study
                    </a>
                </div>
            </div>
        </section>
    );
};

// --- SERVICES SECTION WITHOUT LIMITS ---
const ShopifyServicesSection = ({ services }) => {
    
    if (!services) {
        return (
            <section className="services-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                <div className="section-header">
                    <div className="loading-spinner"></div>
                    <h2 className="section-title" style={{ color: '#000000' }}>Loading Services</h2>
                </div>
            </section>
        );
    }
    
    if (services.length === 0) {
         return (
            <section className="services-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                <div className="section-header">
                    <h2 className="section-title" style={{ color: '#000000' }}>Shopify Design Services</h2>
                    <p className="section-description" style={{ color: '#000000' }}>
                        We're currently updating our service portfolio. Please check back soon.
                    </p>
                </div>
            </section>
        );
    }
    
    // NO LIMIT - ALL services show karo
    const displayServices = services; // No slice() - all services
    
    return (
        <section className="services-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
            <div className="section-header">
                <div className="section-badge" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Services</div>
                <h2 className="section-title" style={{ color: '#000000' }}>
                    Comprehensive <span className="accent" style={{ color: '#000000' }}>Design Solutions</span>
                </h2>
                <p className="section-description" style={{ color: '#000000' }}>
                    End-to-end  design and development services tailored to elevate your e-commerce performance and user experience.
                </p>
            </div>
            
            <div className="services-grid">
                {displayServices.map((service, index) => (
                    <div 
                        key={service.id || service.slug || index} 
                        className="service-card" 
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0' }}
                    >
                        <div className="service-header">
                            <div className="service-image-wrapper">
                                <img 
                                    src={service.feature_image} 
                                    alt={service.title}
                                    className="service-image"
                                    loading="lazy"
                                    onError={(e) => { 
                                        e.target.onerror = null; 
                                        e.target.src = "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"; 
                                    }}
                                />
                            </div>
                        </div>
                        <div className="service-content">
                            <h3 className="service-title" style={{ color: '#000000' }}>{service.title}</h3>
                            <p className="service-description" style={{ color: '#000000' }}>
                                {service.short_description || "Professional Shopify design service to elevate your e-commerce store."}
                            </p>
                            <div className="service-footer">
                                <Link 
                                    to={`/services/${service.slug}`} 
                                    className="service-cta"
                                    style={{ backgroundColor: '#ffd700', color: '#000000' }}
                                >
                                    <span>Explore Service</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// --- SUCCESS PROJECTS SECTION WITHOUT LIMITS ---
const OurSuccessProjectsSection = ({ projects }) => { 
    
    if (!projects || projects.length === 0) {
        return (
            <section className="success-projects-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                <div className="section-header">
                    <h2 className="section-title" style={{ color: '#000000' }}>Success Projects</h2>
                    <p className="section-description" style={{ color: '#000000' }}>No projects available at the moment.</p>
                </div>
            </section>
        );
    }
    
    // NO LIMIT - ALL projects show karo
    const displayProjects = projects; // No limit

    return (
        <section className="success-projects-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
            <div className="section-header">
                <div className="section-badge" style={{ backgroundColor: '#ffd700', color: '#ffffff' }}>Portfolio</div>
                <h2 className="section-title" style={{ color: '#000000' }}>
                    Our Success Stories 
                </h2>
                <p className="section-description" style={{ color: '#000000' }}>
                    Real results from our collaborative work with brands across various industries.
                </p>
            </div>
            
            <div className="projects-mobile-grid">
                {displayProjects.map((project, index) => (
                    <div key={project.id} className="mobile-project-item" style={{ backgroundColor: '#ffffff' }}>
                        {/* Mobile Display Wrapper */}
                        <div className="project-mobile-display-wrapper">
                            {project.mobile_view_video ? (
                                <video
                                    src={project.mobile_view_video} 
                                    className="project-mobile-video"
                                    autoPlay 
                                    loop 
                                    muted
                                    playsInline 
                                    controls={false}
                                />
                            ) : (
                                <div className="no-video-placeholder" style={{ backgroundColor: '#f0f0f0', color: '#000000' }}>
                                    <span>Project Preview</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Updated Title Box */}
                        <div className="project-info">
                            <Link to={`/projects/${project.slug}`} className="project-link-title">
                                <div className="project-mobile-title" style={{ color: '#f8f8f8ff' }}>
                                    <span className="main-title-line">
                                        {project.title.split(' ').slice(0, 3).join(' ')}
                                    </span>
                                    {project.title.split(' ').length > 3 && (
                                        <span className="subtitle-line">
                                            {project.title.split(' ').slice(3).join(' ')}
                                        </span>
                                    )}
                                </div>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* <div className="section-footer">
                <a href="#view-all" className="view-all-cta" style={{ backgroundColor: '#ffd700', color: '#ffffffff' }}>
                    View All Case Studies
                </a>
            </div> */}
        </section>
    );
};

// --- ARTICLES SECTION WITHOUT LIMITS ---
const ArticlesSection = ({ articles }) => {
    const sliderRef = useRef(null);
    
    if (!articles || articles.length === 0) {
        return (
            <section className="articles-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                <div className="section-header">
                    <h2 className="section-title" style={{ color: '#000000' }}>Latest Articles</h2>
                    <p className="section-description" style={{ color: '#000000' }}>No articles available at the moment.</p>
                </div>
            </section>
        );
    }

    // Function to truncate excerpt
    const truncateExcerpt = (text, maxLength = 120) => {
        if (!text) return "Read our latest insights on e-commerce and Shopify optimization.";
        
        const plainText = text.replace(/<[^>]*>/g, ''); // Remove HTML tags
        if (plainText.length <= maxLength) return plainText;
        
        return plainText.substring(0, maxLength) + '...';
    };

    // NO LIMIT - ALL articles show karo
    const displayArticles = articles; // No limit
    const duplicatedArticles = [...displayArticles, ...displayArticles, ...displayArticles];

    return (
        <section className="articles-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
            <div className="section-header">
                <div className="section-badge" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Insights</div>
                <h2 className="section-title" style={{ color: '#000000' }}>
                    Latest <span className="accent" style={{ color: '#000000' }}>Articles & Guides</span>
                </h2>
                <p className="section-description" style={{ color: '#000000' }}>
                    Expert insights and practical guides to help you optimize your Shopify store and grow your e-commerce business.
                </p>
            </div>
            
            <div className="articles-slider-container">
                {/* Articles Slider with Auto-scroll */}
                <div className="articles-slider-wrapper">
                    {duplicatedArticles.map((article, index) => (
                        <div 
                            key={`${article.id}-${index}`} 
                            className="article-card" 
                            style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0' }}
                        >
                            <div className="article-header">
                                {/* Optional: Add badges or meta info here */}
                            </div>

                            {/* Article Image */}
                            {article.image && (
                                <div className="article-image-container">
                                    <img 
                                        src={article.image} 
                                        alt={article.title}
                                        className="article-image"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                            
                            <div className="article-content">
                                <h3 className="article-title" style={{ color: '#000000' }}>
                                    {article.title}
                                </h3>
                                <p className="article-excerpt" style={{ color: '#666666' }}>
                                    {truncateExcerpt(article.meta_description || article.content)}
                                </p>
                            </div>
                            
                            <div className="article-footer">
                                <Link 
                                    to={`/articles/${article.slug}`}
                                    className="article-cta"
                                    style={{ color: '#000000', borderBottom: '2px solid #ffd700' }}
                                >
                                    Read Article
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Home Page Component - ALL SECTIONS WITHOUT LIMITS
const Home = () => {
    const [shopifyServices, setShopifyServices] = useState(null); 
    const [successProjects, setSuccessProjects] = useState(null);
    const [articles, setArticles] = useState(null);
    const [loadingServices, setLoadingServices] = useState(true);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingArticles, setLoadingArticles] = useState(true);
    const [errorServices, setErrorServices] = useState(null);
    const [errorProjects, setErrorProjects] = useState(null);
    const [errorArticles, setErrorArticles] = useState(null);

    // API Calls for Services (baki sections ke liye)
    useEffect(() => {
        const fetchServices = async () => {
            const apiUrl = `${API_BASE_URL}services/`;
            try {
                setLoadingServices(true);
                setErrorServices(null);
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                let servicesData = Array.isArray(data) ? data : (data.results || data.data || []);
                setShopifyServices(servicesData);
            } catch (error) {
                console.error("❌ Failed to fetch Shopify services:", error);
                setErrorServices(error.message);
                setShopifyServices([]);
            } finally {
                setLoadingServices(false);
            }
        };

        if (API_BASE_URL) {
            fetchServices();
        } else {
            setLoadingServices(false);
            setShopifyServices([]);
        }
    }, []); 

    // API Calls for Projects
    useEffect(() => {
        const fetchProjects = async () => {
            const apiUrl = `${API_BASE_URL}projects/`;
            try {
                setLoadingProjects(true);
                setErrorProjects(null);
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                let projectsData = Array.isArray(data) ? data : (data.results || data.data || []);
                setSuccessProjects(projectsData);
            } catch (error) {
                console.error("❌ Failed to fetch Success Projects:", error);
                setErrorProjects(error.message);
                setSuccessProjects([]);
            } finally {
                setLoadingProjects(false);
            }
        };

        if (API_BASE_URL) {
            fetchProjects();
        } else {
            setLoadingProjects(false);
            setSuccessProjects([]);
        }
    }, []);

    // API Calls for Articles
    useEffect(() => {
        const fetchArticles = async () => {
            const apiUrl = `${API_BASE_URL}articles/`;
            try {
                setLoadingArticles(true);
                setErrorArticles(null);
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                let articlesData = Array.isArray(data) ? data : (data.results || data.data || []);
                setArticles(articlesData);
            } catch (error) {
                console.error("❌ Failed to fetch Articles:", error);
                setErrorArticles(error.message);
                setArticles([]);
            } finally {
                setLoadingArticles(false);
            }
        };

        if (API_BASE_URL) {
            fetchArticles();
        } else {
            setLoadingArticles(false);
            setArticles([]);
        }
    }, []);

    return (
        <Layout>
            {/* 1. Modern Hero Section - WHITE */}
            <HeroSection />
            
            {/* 2. NEW: API-based Gallery Section - BLACK BACKGROUND */}
            <ApiGallerySection />

            {/* 3. NEW: API-based Grid Section - WHITE */}
            <ProjectGrid />

            {/* 4. Drink Finder Success Story - WHITE */}
            <DrinkFinderSection />
            
            {/* 5. Services Section - WHITE (NO LIMITS) */}
            {loadingServices && !shopifyServices ? (
                <div className="loading-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <div className="loading-spinner"></div>
                    <p>Loading Services...</p>
                </div>
            ) : errorServices ? (
                <div className="error-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <p>Service Error: {errorServices}</p>
                </div>
            ) : (
                <ShopifyServicesSection services={shopifyServices} />
            )}
            
            {/* 6. Success Projects Section - WHITE (NO LIMITS) */}
            {loadingProjects && !successProjects ? (
                <div className="loading-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <div className="loading-spinner"></div>
                    <p>Loading Success Projects...</p>
                </div>
            ) : errorProjects ? (
                <div className="error-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <p>Project Error: {errorProjects}</p>
                </div>
            ) : (
                <OurSuccessProjectsSection projects={successProjects} />
            )}

            {/* 7. Articles Section - WHITE (NO LIMITS) */}
            {loadingArticles && !articles ? (
                <div className="loading-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <div className="loading-spinner"></div>
                    <p>Loading Articles...</p>
                </div>
            ) : errorArticles ? (
                <div className="error-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <p>Articles Error: {errorArticles}</p>
                </div>
            ) : (
                <ArticlesSection articles={articles} />
            )}
            
        </Layout>
    );
};

export default Home;