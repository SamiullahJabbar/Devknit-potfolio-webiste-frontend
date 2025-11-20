import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { API_BASE_URL } from '../api/baseurl';
import '../css/Projects.css';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Projects Data
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}projects/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                const data = await response.json();
                const projectsData = Array.isArray(data) ? data : (data.results || data.data || []);
                setProjects(projectsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Fetch Services Data
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}services/`);
                if (response.ok) {
                    const data = await response.json();
                    const servicesData = Array.isArray(data) ? data : (data.results || data.data || []);
                    setServices(servicesData);
                }
            } catch (err) {
                console.error('Failed to fetch services:', err);
            }
        };

        fetchServices();
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="projects-page-loading">
                    <div className="projects-loading-spinner"></div>
                    <p>Loading Projects...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="projects-page-error">
                    <h2>Error Loading Projects</h2>
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="projects-try-again-btn"
                    >
                        Try Again
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Projects Hero Section */}
            <section className="projects-page-hero">
                <div className="projects-hero-container">
                    <h1 className="projects-hero-title">
                        Our Projects
                    </h1>
                    <p className="projects-hero-subtitle">
                        Discover our latest work and innovative solutions that drive success for our clients
                    </p>
                </div>
            </section>

            {/* Projects Grid Section */}
            <section className="projects-display-section">
                <div className="projects-page-container">
                    <div className="projects-section-header">
                        <span className="projects-section-badge">Featured Work</span>
                        <h2 className="projects-section-title">
                            Success Stories
                        </h2>
                        <p className="projects-section-description">
                            Explore our portfolio of innovative projects that showcase our expertise and commitment to excellence
                        </p>
                    </div>

                    {projects.length === 0 ? (
                        <div className="projects-empty-state">
                            <h3>No Projects Found</h3>
                            <p>Check back later for new projects.</p>
                        </div>
                    ) : (
                        <>
                            {/* Projects Grid */}
                            <div className="projects-grid-container">
                                {projects.map((project, index) => (
                                    <div key={project.id} className="project-item-card">
                                        {/* Mobile Display Wrapper */}
                                        <div className="project-preview-wrapper">
                                            {project.mobile_view_video ? (
                                                <video
                                                    src={project.mobile_view_video}
                                                    className="project-preview-video"
                                                    autoPlay 
                                                    loop 
                                                    muted
                                                    playsInline 
                                                    controls={false}
                                                />
                                            ) : (
                                                <div className="project-preview-placeholder">
                                                    <span>Project Preview</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Project Info */}
                                        <div className="project-info-section">
                                            <Link 
                                                to={`/projects/${project.slug}`}
                                                className="project-title-link"
                                            >
                                                <div className="project-title-content">
                                                    <span className="project-main-title">
                                                        {project.title}
                                                    </span>
                                                </div>
                                                {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg> */}
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* <div className="projects-section-footer">
                                <Link to="/projects" className="projects-view-all-btn">
                                    View All Projects
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Link>
                            </div> */}
                        </>
                    )}
                </div>
            </section>

           
            
        </Layout>
    );
};

export default Projects;