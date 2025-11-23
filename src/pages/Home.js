// src/pages/Home.js

import React, { useState, useEffect, useRef, useCallback } from 'react';

import Layout from '../components/Layout';


import '../css/HeroSection.css';
import { Link } from 'react-router-dom';
import '../css/articles.css';


// --- IMAGE IMPORTS (UNCHANGED) ---
import background from '../images/hero.png';
import logo from '../images/icon-logo.png';
import dotvideo from '../images/dotvideo.mp4';

// --- BASE URL IMPORT (UNCHANGED) ---
import { API_BASE_URL } from '../api/baseurl';


// --- COMPONENT DEFINITIONS (UNCHANGED) ---

const HeroSection = () => {
    // ... (UNCHANGED CODE)
    return (
        <section
            className="hero-section"
            style={{
                backgroundImage: `url(${background})`,
                backgroundColor: '#000000', 
                color: '#ffffff', 
            }}
        >
            <div className="hero-background-overlay"></div>

            <div className="hero-content">
                <img
                    src={logo}
                    alt="Logo"
                    className="hero-logo"
                />

                <h1 className="hero-heading" style={{ color: '#ffffffff' }}>
                    Creating high-quality websites<br />that deliver real results
                </h1>

                <div className="hero-actions">
                    <Link to="/ContactUs" className="hero-cta primary" style={{
                        backgroundColor: '#ffffff',
                        color: '#000000',
                    }}>
                        GET STARTED
                    </Link>

                    <Link to="/Projects" className="hero-cta secondary" style={{
                        backgroundColor: '#000000ff',
                        color: '#ffffff',
                        border: '1px solid #ffffff',
                    }}>
                        VIEW PORTFOLIO
                    </Link>
                </div>
            </div>
        </section>
    );
};



// --- GrowBusinessSection COMPONENT (UPDATED WITH ROUND WHITE BACKGROUND) ---
const GrowBusinessSection = ({ services, activeServiceSlug, onServiceSelect }) => {
    if (!services || services.length === 0) {
        return null;
    }

    return (
        <section 
            className="grow-business-section"
            style={{ 
                backgroundColor: '#ffffff', 
                padding: '60px 20px 30px', 
                textAlign: 'center',
                color: '#000000'
            }}
        >
            <h2 
                className="grow-business-heading"
                style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'bold', 
                    marginBottom: '10px',
                    color: '#000000'
                }}
            >
                Grow your business
            </h2>
            <p 
                className="grow-business-subheading"
                style={{ 
                    fontSize: '1.1rem', 
                    color: '#555555', 
                    marginBottom: '50px' 
                }}
            >
                You deserve a website that can do it all.
            </p>

            {/* Slider-like navigation for services */}
            <div 
                className="grow-business-nav"
                style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    flexWrap: 'wrap', 
                    gap: '15px', 
                    marginBottom: '40px',
                    overflowX: 'auto', 
                    paddingBottom: '10px', 
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                <style>
                    {`
                        .grow-business-nav::-webkit-scrollbar {
                            display: none;
                        }
                    `}
                </style>
                {services.map((service) => (
                    <button
                        key={service.slug}
                        className={`grow-business-nav-item ${service.slug === activeServiceSlug ? 'active' : ''}`}
                        onClick={() => onServiceSelect(service.slug)}
                        style={{
                            background: service.slug === activeServiceSlug ? 'rgba(185, 174, 174, 0.43)' : 'transparent',
                            border: 'none',
                            padding: '12px 20px',
                            fontSize: '1rem',
                            fontWeight: service.slug === activeServiceSlug ? 'bold' : 'normal',
                            color: '#000000',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            borderRadius: '50px',
                            boxShadow: service.slug === activeServiceSlug ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
                            outline: 'none',
                            whiteSpace: 'nowrap', 
                        }}
                    >
                        {service.title}
                    </button>
                ))}
            </div>
        </section>
    );
};


// --- SERVICE IMAGE SLIDER COMPONENT (DOTS ADDED) ---
const ServicesImageSlider = ({ services, activeServiceSlug, setActiveServiceSlug }) => {
    // --- 1. HOOKS MUST BE CALLED FIRST ---
    const sliderRef = useRef(null);
    const intervalRef = useRef(null);
    
    // Find the current active index based on the slug from the parent
    const initialIndex = services.findIndex(service => service.slug === activeServiceSlug);
    const [activeIndex, setActiveIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
    const servicesCount = services ? services.length : 0; 

    // --- 2. CALLBACKS ---
    
    // Auto-scroll logic (memoized)
    const startAutoScroll = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (servicesCount > 0) {
            intervalRef.current = setInterval(() => {
                setActiveIndex(prevIndex => {
                    const nextIndex = (prevIndex + 1) % servicesCount;
                    // Update parent state (activeServiceSlug) when auto-scrolling
                    if (services[nextIndex]) {
                        setActiveServiceSlug(services[nextIndex].slug);
                    }
                    return nextIndex;
                });
            }, 3000); 
        }
    }, [servicesCount, services, setActiveServiceSlug]);


    // Scroll logic (memoized)
    const scrollToActiveSlide = useCallback((index) => {
        if (sliderRef.current && servicesCount > 0) {
            const activeSlide = sliderRef.current.children[index];
            if (activeSlide) {
                // Scroll to the START of the active item
                const scrollLeft = activeSlide.offsetLeft - 20; // Subtract padding for better alignment
                
                sliderRef.current.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth',
                });
            }
        }
    }, [servicesCount]);


    // --- 3. USE EFFECTS ---

    // Effect 1: Handle Auto-scrolling and Cleanup
    useEffect(() => {
        startAutoScroll();
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [startAutoScroll]);
    
    
    // Effect 2: Handle Scrolling when activeIndex changes
    useEffect(() => {
        scrollToActiveSlide(activeIndex);
    }, [activeIndex, scrollToActiveSlide]); 
    

    // Effect 3: Handle External Service Selection (from GrowBusinessSection)
    useEffect(() => {
        const newIndex = services.findIndex(service => service.slug === activeServiceSlug);
        
        if (newIndex !== -1 && newIndex !== activeIndex) {
            // Update local state, which triggers Effect 2 (scrolling)
            setActiveIndex(newIndex);
            
            // Stop auto-scroll on external service selection
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                setTimeout(startAutoScroll, 5000); // Re-start after a delay
            }
        }
    }, [activeServiceSlug, services, activeIndex, startAutoScroll]);


    const handleManualSlideClick = (index) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            setTimeout(startAutoScroll, 5000);
        }
        setActiveIndex(index);
        // Also update parent state
        if (services[index]) {
            setActiveServiceSlug(services[index].slug);
        }
    };

    // --- 4. EARLY RETURN (Data Check) ---
    if (!services || services.length === 0) {
        return null;
    }

    
    return (
        <section 
            className="services-slider-section" 
            style={{ 
                backgroundColor: '#ffffff', 
                padding: '0', 
                width: '100%', 
                overflow: 'hidden' 
            }}
        >
            <div 
                className="image-slider-container"
                style={{
                    overflow: 'hidden',
                    padding: '0', 
                    marginBottom: '80px', 
                }}
            >
                <div 
                    ref={sliderRef} 
                    className="image-slider-wrapper"
                    // This class must be defined in your CSS file
                >
                    {services.map((service, index) => (
                        <Link 
                            key={service.slug} 
                            to={`/business-services/${service.slug}`} 
                            className={`slider-item ${index === activeIndex ? 'active' : ''}`}
                            onClick={(e) => {
                                // Prevent link navigation on click for the active slide (optional)
                                // e.preventDefault(); 
                                handleManualSlideClick(index);
                            }}
                            style={{
                                opacity: index === activeIndex ? '1' : '0.5',
                                transition: 'opacity 0.5s ease-in-out',
                                height: '70vh', 
                                borderRadius: '12px',
                                overflow: 'hidden',
                                position: 'relative',
                                textDecoration: 'none',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                                background: '#f8f8f8', 
                            }}
                        >
                            <img
                                src={service.feature_image}
                                alt={service.title}
                                className="slider-image"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover', 
                                }}
                            />
                            <div 
                                className="image-title-overlay"
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    left: '0',
                                    right: '0',
                                    padding: '15px',
                                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))',
                                    color: 'white',
                                }}
                            >
                                <h4 style={{ margin: '0', fontSize: '1.5rem' }}>{service.title}</h4>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* DOTS INDICATOR ADDED HERE */}
                <div className="slider-dots" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '20px',
                    paddingBottom: '30px'
                }}>
                    {services.map((_, index) => (
                        <button
                            key={index}
                            className={`slider-dot ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => handleManualSlideClick(index)}
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                border: 'none',
                                backgroundColor: index === activeIndex ? '#000000' : '#dddddd',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                padding: '0'
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};





const OurSuccessProjectsSection = ({ projects }) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const CARD_PER_VIEW = 4; // Used for desktop and tablet views

    const handleNext = () => {
        if (!projects) return;
        // For mobile, cycle through one project at a time
        if (window.innerWidth <= 768) {
            setActiveIndex((prevIndex) =>
                prevIndex + 1 >= projects.length ? 0 : prevIndex + 1
            );
        } else {
            // Original desktop/tablet logic
            const maxIndex = Math.max(0, projects.length - CARD_PER_VIEW);
            setActiveIndex((prevIndex) =>
                prevIndex >= maxIndex ? 0 : prevIndex + 1
            );
        }
    };

    const handlePrev = () => {
        if (!projects) return;
        // For mobile, cycle through one project at a time
        if (window.innerWidth <= 768) {
            setActiveIndex((prevIndex) =>
                prevIndex - 1 < 0 ? projects.length - 1 : prevIndex - 1
            );
        } else {
            // Original desktop/tablet logic
            const maxIndex = Math.max(0, projects.length - CARD_PER_VIEW);
            setActiveIndex((prevIndex) =>
                prevIndex === 0 ? maxIndex : prevIndex - 1
            );
        }
    };

    const handleDotClick = (index) => {
        setActiveIndex(index);
    };

    if (!projects || projects.length === 0) {
        return (
            <section className="success-projects-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                <div className="section-header">
                    <h2 className="section-title" style={{ color: '#000000' }}>Successfully Completed Projects</h2>
                    <p className="section-description" style={{ color: '#000000' }}>No projects available at the moment.</p>
                </div>
            </section>
        );
    }

    const displayProjects = projects;

    // Calculate total pages for dots
    // Mobile: One dot per project; Desktop: Based on CARD_PER_VIEW
    const totalPages = window.innerWidth <= 768 ? displayProjects.length : Math.max(1, displayProjects.length - CARD_PER_VIEW + 1);

    // For mobile view, calculate previous and next indices
    const prevIndex = activeIndex - 1 < 0 ? projects.length - 1 : activeIndex - 1;
    const nextIndex = activeIndex + 1 >= projects.length ? 0 : activeIndex + 1;

    // Placeholder for Link
    const Link = ({ to, children, className, style }) => <a href={to} className={className} style={style}>{children}</a>;

    return (
        <section className="success-projects-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
            <div className="section-content-wrapper">
                <div className="section-header">
                    <h1 className="section-title" style={{ color: '#000000ff' }}>
                        Featured Design Projects
                    </h1>
                  <p className="section-description" style={{ color: '#000000' }}>
    A selection of recent work built with solid UI and reliable performance.
</p>
        </div>

                <div className="projects-slider-container">
                    <div
                        className="projects-mobile-grid"
                        style={window.innerWidth > 768 ? { transform: `translateX(calc(-${activeIndex * 100}vw / 4))` } : {}}
                    >
                        {window.innerWidth <= 768 ? (
                            // Mobile View: Render previous, current, next projects
                            <>
                                <div
                                    className="mobile-project-item mobile-project-item--prev"
                                    key={displayProjects[prevIndex].id}
                                    style={{ backgroundColor: '#ffffff' }}
                                >
                                    <div className="project-mobile-display-wrapper">
                                        {displayProjects[prevIndex].mobile_view_video ? (
                                            <video
                                                src={displayProjects[prevIndex].mobile_view_video}
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
                                        <Link to={`/projects/${displayProjects[prevIndex].slug}`} className="mobile-overlay-title top-overlay">
                                            <div className="project-mobile-title" style={{ color: '#f8f8f8ff' }}>
                                                <span className="main-title-line">
                                                    {displayProjects[prevIndex].title.split(' ').slice(0, 3).join(' ')}
                                                </span>
                                                {displayProjects[prevIndex].title.split(' ').length > 3 && (
                                                    <span className="subtitle-line">
                                                        {displayProjects[prevIndex].title.split(' ').slice(3).join(' ')}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="overlay-cta-arrow">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                <div
                                    className="mobile-project-item mobile-project-item--current"
                                    key={displayProjects[activeIndex].id}
                                    style={{ backgroundColor: '#ffffff' }}
                                >
                                    <div className="project-mobile-display-wrapper">
                                        {displayProjects[activeIndex].mobile_view_video ? (
                                            <video
                                                src={displayProjects[activeIndex].mobile_view_video}
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
                                        <Link to={`/projects/${displayProjects[activeIndex].slug}`} className="mobile-overlay-title top-overlay">
                                            <div className="project-mobile-title" style={{ color: '#f8f8f8ff' }}>
                                                <span className="main-title-line">
                                                    {displayProjects[activeIndex].title.split(' ').slice(0, 3).join(' ')}
                                                </span>
                                                {displayProjects[activeIndex].title.split(' ').length > 3 && (
                                                    <span className="subtitle-line">
                                                        {displayProjects[activeIndex].title.split(' ').slice(3).join(' ')}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="overlay-cta-arrow">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                <div
                                    className="mobile-project-item mobile-project-item--next"
                                    key={displayProjects[nextIndex].id}
                                    style={{ backgroundColor: '#ffffff' }}
                                >
                                    <div className="project-mobile-display-wrapper">
                                        {displayProjects[nextIndex].mobile_view_video ? (
                                            <video
                                                src={displayProjects[nextIndex].mobile_view_video}
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
                                        <Link to={`/projects/${displayProjects[nextIndex].slug}`} className="mobile-overlay-title top-overlay">
                                            <div className="project-mobile-title" style={{ color: '#f8f8f8ff' }}>
                                                <span className="main-title-line">
                                                    {displayProjects[nextIndex].title.split(' ').slice(0, 3).join(' ')}
                                                </span>
                                                {displayProjects[nextIndex].title.split(' ').length > 3 && (
                                                    <span className="subtitle-line">
                                                        {displayProjects[nextIndex].title.split(' ').slice(3).join(' ')}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="overlay-cta-arrow">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </>
                        ) : (
                            // Desktop/Tablet View: Original mapping
                            displayProjects.map((project, index) => (
                                <div
                                    key={project.id}
                                    className="mobile-project-item"
                                    style={{ backgroundColor: '#ffffff' }}
                                >
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
                                        <Link to={`/projects/${project.slug}`} className="mobile-overlay-title top-overlay">
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
                                            <div className="overlay-cta-arrow">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="slider-controls-bottom">
    {/* Previous Arrow/Button */}
    <button className="slider-arrow prev-arrow" onClick={handlePrev}>
        {/* SVG icon removed, text symbol added */}
        &lt; 
    </button>

    <div className="slider-dots">
        {Array.from({ length: totalPages }).map((_, index) => (
            <span
                key={index}
                className={`slider-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
            ></span>
        ))}
    </div>

    {/* Next Arrow/Button */}
    <button className="slider-arrow next-arrow" onClick={handleNext}>
        {/* SVG icon removed, text symbol added */}
        &gt; 
    </button>

                </div>
            </div>
        </section>
    );
};





// --- NEW COMPONENT: CompletedProjectsGridSection (Verification logic added for clarity) ---
const CompletedProjectsGridSection = ({ projects }) => {
    if (!projects || projects.length === 0) {
        return null;
    }

    // Filter projects to only include those with at least one about_image and take the first 4
    const displayProjects = projects
        .filter(p => p.about_images && p.about_images.length > 0)
        .slice(0, 4) // Explicitly limit to 4 projects
        .map(project => ({
            id: project.id,
            title: project.title,
            slug: project.slug,
            image: project.about_images[0].image, 
        }));

    if (displayProjects.length === 0) {
        return null;
    }
    
    // IMPORTANT: If 'displayProjects.length' is less than 4, it means the API is providing 
    // fewer than 4 valid projects (with an image). The display will match the available data.
    
    // To confirm 4 images are attempted, we need 4 valid projects in 'projects' state.

    return (
        <section className="completed-projects-section">
            {/* UPDATED HEADER STRUCTURE */}
            <div className="section-header">
                {/* Title on the left */}
                <h2 className="section-title">
                   Success Projects
                </h2>
                {/* Button on the right - Hidden on mobile */}
                <Link to="/Projects" className="view-all-projects-cta">
                    VIEW ALL PROJECTS
                </Link>
            </div>
            {/* --- End of Updated Header --- */}
            
            <div className="completed-projects-grid">
                {displayProjects.map((project) => (
                    <Link
                        key={project.id}
                        to={`/projects/${project.slug}`}
                        className="completed-project-item"
                    >
                        <div className="project-image-container">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="project-image"
                            />
                        </div>
                        <div className="project-title-overlay">
                            <h3 className="project-title-text">{project.title}</h3>
                        </div>
                    </Link>
                ))}
            </div>
            {/* CTA to View More (The one below the grid) - Keeping it for now but you may remove it if the top button is enough. */}
             <div className="view-more-container">
                <Link to="/Projects" className="view-more-cta">
                    VIEW MORE WORK
                </Link>
            </div>
        </section>
    );
};

const ArticlesSection = ({ articles }) => {
    
    if (!articles || articles.length === 0) {
        return (
            <section className="articles-section-updated">
                <div className="section-header">
                    <h2 className="section-title">Latest Articles</h2>
                    {/* Updated to use new class */}
                    <div className="section-description">
                        No articles available at the moment.
                    </div>
                </div>
            </section>
        );
    }
    
    const displayArticles = articles.slice(0, 3);

    return (
        <section className="articles-section-updated">
            <div className="section-header">
                {/* 1. Blogs (Title) is on the Left */}
                <h2 className="section-title">Blogs</h2>
                
                {/* 2. Description is in the Center */}
                <div className="section-description">
                    Our latest on design, tech, and entrepreneurship.
                </div>
                
                {/* 3. View All Button is on the Right */}
                <div className="view-all-container">
                    <Link to="/articles" className="view-all-cta">
                        VIEW ALL →
                    </Link>
                </div>
            </div>
            
            <div className="articles-static-grid-wrapper">
                {displayArticles.map((article, index) => (
                    <Link
                        key={article.id}
                        to={`/articles/${article.slug}`}
                        className="article-card-static"
                    >
                        <div className="article-image-container">
                            {article.image ? (
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className={`article-image-static ${index === 0 ? 'large-image' : 'small-image'}`}
                                />
                            ) : (
                                <div className={`article-image-static ${index === 0 ? 'large-image' : 'small-image'}`} 
                                     style={{ 
                                         backgroundColor: '#333333', 
                                         display: 'flex', 
                                         alignItems: 'center', 
                                         justifyContent: 'center',
                                         color: '#999999'
                                     }}>
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="article-content-static">
                            <h3 className="article-title-static">
                                {article.title || "Special Through Checkout with Shop Pay"}
                            </h3>
                            <div className="article-meta">
                                By {article.author || 'Anonymous'} | {article.date || '01 Jan 2025'} 
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};


const TrialSection = () => {
    return (
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
    );
};




// Home Page Component
const Home = () => {
    const [shopifyServices, setShopifyServices] = useState(null);
    const [successProjects, setSuccessProjects] = useState(null);
    const [completedProjects, setCompletedProjects] = useState(null); 
    const [articles, setArticles] = useState(null);
    const [loadingServices, setLoadingServices] = useState(true);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingCompletedProjects, setLoadingCompletedProjects] = useState(true); 
    const [loadingArticles, setLoadingArticles] = useState(true);
    const [errorServices, setErrorServices] = useState(null);
    const [errorProjects, setErrorProjects] = useState(null);
    const [errorCompletedProjects, setErrorCompletedProjects] = useState(null); 
    const [errorArticles, setErrorArticles] = useState(null);

    // State to manage which service is active in GrowBusinessSection and ServicesImageSlider
    const [activeServiceSlug, setActiveServiceSlug] = useState(null);


    // API Calls for Services (UNCHANGED)
    useEffect(() => {
        const fetchServices = async () => {
            const apiUrl = `${API_BASE_URL}business-services/`; 
            try {
                setLoadingServices(true);
                setErrorServices(null);
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                let servicesData = Array.isArray(data) ? data : (data.results || data.data || []);
                
                const validServices = servicesData.filter(service => service.slug && service.feature_image);
                setShopifyServices(validServices);

                // Set the first service as active by default if data is available
                if (validServices.length > 0) {
                    setActiveServiceSlug(validServices[0].slug);
                }

            } catch (error) {
                console.error("❌ Failed to fetch Business Services:", error);
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


    // API Calls for Projects (UNCHANGED)
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

    // NEW API Calls for Completed Projects Grid (UNCHANGED)
    useEffect(() => {
        const fetchCompletedProjects = async () => {
            const apiUrl = `${API_BASE_URL}projects/`; // Assuming the same project endpoint
            try {
                setLoadingCompletedProjects(true);
                setErrorCompletedProjects(null);
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                let projectsData = Array.isArray(data) ? data : (data.results || data.data || []);
                setCompletedProjects(projectsData);
            } catch (error) {
                console.error("❌ Failed to fetch Completed Projects:", error);
                setErrorCompletedProjects(error.message);
                setCompletedProjects([]);
            } finally {
                setLoadingCompletedProjects(false);
            }
        };

        if (API_BASE_URL) {
            fetchCompletedProjects();
        } else {
            setLoadingCompletedProjects(false);
            setCompletedProjects([]);
        }
    }, []);

    // API Calls for Articles (UNCHANGED)
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
            {/* 1. Modern Hero Section - BLACK BACKGROUND */}
            <HeroSection />

            {/* 2. GrowBusinessSection */}
            {loadingServices && !shopifyServices ? (
                <div className="loading-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <div className="loading-spinner"></div>
                    <p>Loading Services...</p>
                </div>
            ) : errorServices ? (
                <div className="error-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <p>Services Error: {errorServices}</p>
                </div>
            ) : (
                <GrowBusinessSection 
                    services={shopifyServices} 
                    activeServiceSlug={activeServiceSlug}
                    onServiceSelect={setActiveServiceSlug} 
                />
            )}


            {/* 3. Services Image Slider Section */}
            {loadingServices && !shopifyServices ? (
                null 
            ) : errorServices ? (
                null
            ) : (
                <ServicesImageSlider 
                    services={shopifyServices} 
                    activeServiceSlug={activeServiceSlug}
                    setActiveServiceSlug={setActiveServiceSlug} 
                />
            )}


            {/* 6. Success Projects Section - WHITE (MOBILE VIEW) */}
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

            {/* 6B. NEW Completed Projects Grid Section - DESKTOP VIEW */}
            {loadingCompletedProjects && !completedProjects ? (
                <div className="loading-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <div className="loading-spinner"></div>
                    <p>Loading Completed Projects...</p>
                </div>
            ) : errorCompletedProjects ? (
                <div className="error-section" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <p>Completed Project Error: {errorCompletedProjects}</p>
                </div>
            ) : (
                <CompletedProjectsGridSection projects={completedProjects} />
            )}

            {loadingArticles && !articles ? (
                <div className="loading-section" style={{ backgroundColor: '#000000', color: '#ffffff', padding: '40px 0' }}>
                    <div className="loading-spinner"></div>
                    <p>Loading Articles...</p>
                </div>
            ) : errorArticles ? (
                <div className="error-section" style={{ backgroundColor: '#000000', color: '#ffffff', padding: '40px 0' }}>
                    <p>Articles Error: {errorArticles}</p>
                </div>
            ) : (
                <ArticlesSection articles={articles} />
            )}
            
            {/* 8. NEW Trial Section with Video */}
            <TrialSection />


        </Layout>
    );
};

export default Home;