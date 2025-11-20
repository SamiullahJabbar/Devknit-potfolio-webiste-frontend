// src/pages/ContactUs.js

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import '../css/ContactUs.css'; 
// Make sure you have this import for your base URL
import { API_BASE_URL } from '../api/baseurl'; 

const ContactUs = () => {
    // State for form data
    const [formData, setFormData] = useState({
        full_name: '', // Updated to match API payload
        email: '',
        phone: '',
        company: '',
        service: '', // Will hold the service ID
        project_details: '', // Updated to match API payload (was 'message')
        estimated_budget: '', // Updated to match API payload (was 'budget')
        project_timeline: '' // Updated to match API payload (was 'timeline')
    });

    // State for dynamic content from company-info API
    const [companyInfo, setCompanyInfo] = useState({
        email: 'loading...',
        phone: 'loading...',
        address: 'loading...',
        location: '',
        social_links: [],
        faqs: []
    });

    // State for services from services API
    const [services, setServices] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
    const [dataLoadingError, setDataLoadingError] = useState(false);

    // --- Data Fetching Logic (useEffect) ---
    useEffect(() => {
        // 1. Fetch Company Info & FAQs
        const fetchCompanyInfo = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}contact/company-info/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch company info');
                }
                const data = await response.json();
                
                // Map the fetched data to the component's state structure
                setCompanyInfo({
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    location: data.location,
                    social_links: data.social_links || [],
                    faqs: data.faqs || []
                });
            } catch (error) {
                console.error("Error fetching company info:", error);
                setDataLoadingError(true);
            }
        };

        // 2. Fetch Services
        const fetchServices = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}contact/services/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch services');
                }
                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error("Error fetching services:", error);
                setDataLoadingError(true);
            }
        };

        fetchCompanyInfo();
        fetchServices();
    }, []);

    // --- Static Data (Keep only non-API dependent data) ---
    
    // Contact information (Dynamically generated now, but keeping structure for reference)
    // NOTE: The map in the JSX will use the data from the 'companyInfo' state.

    // Budget and Timeline Options (Still static as per your previous code)
    const budgetRanges = [
        "$5,000 - $10,000",
        "$10,000 - $25,000",
        "$25,000 - $50,000",
        "$50,000 - $100,000",
        "$100,000+",
        "Not sure yet"
    ];

    const timelineOptions = [
        "ASAP (Within 2 weeks)",
        "1-2 months",
        "2-4 months",
        "4-6 months",
        "6+ months",
        "Flexible timeline"
    ];

    // --- Event Handlers ---

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null); // Clear previous status

        // Prepare payload for /contact/client/ API
        const payload = {
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone || null, // Allow null if not provided
            company: formData.company || null, // Allow null
            service: parseInt(formData.service), // Convert selected service ID to integer
            estimated_budget: formData.estimated_budget || null,
            project_timeline: formData.project_timeline || null,
            project_details: formData.project_details,
        };

        try {
            const response = await fetch(`${API_BASE_URL}contact/client/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // Read the error message from the response body if available
                const errorData = await response.json();
                console.error("Submission Error Details:", errorData);
                throw new Error(`Server responded with status: ${response.status}`);
            }

            // Successful submission
            setSubmitStatus('success');
            
            // Clear the form
            setFormData({
                full_name: '',
                email: '',
                phone: '',
                company: '',
                service: '',
                project_details: '',
                estimated_budget: '',
                project_timeline: ''
            });

        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Render JSX ---

    // Define a simplified contact info list based on fetched data for rendering
    const dynamicContactInfo = [
        {
            icon: "📧",
            title: "Email Us",
            details: companyInfo.email,
            description: "Send us an email anytime",
            link: `mailto:${companyInfo.email}`
        },
        {
            icon: "📞",
            title: "Call Us",
            details: companyInfo.phone,
            description: "Mon to Fri, 9am to 6pm",
            link: `tel:${companyInfo.phone}`
        },
        {
            icon: "📍",
            title: "Visit Us",
            details: companyInfo.address,
            description: companyInfo.location,
            link: companyInfo.address && companyInfo.location ? 
                  `http://googleusercontent.com/maps.google.com/search?q=${encodeURIComponent(companyInfo.address + ', ' + companyInfo.location)}` : 
                  '#'
        },
    ];


    return (
        <Layout>
            <div className="contact-us-page">
                
                {/* Hero Section (No change needed here) */}
                <section className="contact-hero">
                    <div className="contact-hero-container">
                        <div className="contact-hero-content">
                            <div className="contact-hero-badge">Get In Touch</div>
                            <h1 className="contact-hero-title">
                                Let's Start Something 
                                <span className="contact-accent-text"> Amazing Together</span>
                            </h1>
                            <p className="contact-hero-description">
                                Ready to transform your ideas into reality? We're here to help. 
                                Tell us about your project and let's create something extraordinary.
                            </p>
                            <div className="contact-hero-features">
                                <div className="contact-feature">
                                    <div className="contact-hero-features contact-feature-icon">⚡</div>
                                    <span>24-48 Hour Response Time</span>
                                </div>
                                <div className="contact-feature">
                                    <div className="contact-hero-features contact-feature-icon">🎯</div>
                                    <span>Free Project Consultation</span>
                                </div>
                                <div className="contact-feature">
                                    <div className="contact-hero-features contact-feature-icon">💎</div>
                                    <span>Custom Tailored Solutions</span>
                                </div>
                            </div>
                        </div>
                        <div className="contact-hero-visual">
                            <div className="contact-visual-wrapper">
                                <img 
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                                    alt="Contact Us" 
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
                                    <div className="contact-card-icon">⭐</div>
                                    <div className="contact-card-text">
                                        <strong>Expert Team</strong>
                                        <span>{/* You can add a static or dynamic value here */}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Form & Info Section */}
                <section className="contact-main-section">
                    <div className="contact-container">
                        <div className="contact-main-grid">
                            
                            {/* Contact Information Sidebar */}
                            <div className="contact-sidebar">
                                <div className="contact-sidebar-header">
                                    <h2>Get in Touch</h2>
                                    <p>Multiple ways to connect with us</p>
                                </div>
                                
                                {/* Dynamically rendered Contact Methods */}
                                <div className="contact-method-list">
                                    {dynamicContactInfo.map((item, index) => (
                                        <a 
                                            key={index} 
                                            href={item.link} 
                                            className="contact-method-item"
                                            target={item.link.startsWith('http') ? '_blank' : '_self'}
                                            rel={item.link.startsWith('http') ? 'noopener noreferrer' : ''}
                                        >
                                            <div className="contact-method-icon">{item.icon}</div>
                                            <div className="contact-method-content">
                                                <h4>{item.title}</h4>
                                                <div className="contact-method-details">{item.details}</div>
                                                <div className="contact-method-description">{item.description}</div>
                                            </div>
                                            <div className="contact-method-arrow"></div>
                                        </a>
                                    ))}
                                </div>

                                {/* Dynamically rendered Social Links */}
                                <div className="contact-social-section">
                                    <h3>Follow Us</h3>
                                    <div className="contact-social-links">
                                        {companyInfo.social_links.map((social, index) => (
                                            <a 
                                                key={index} 
                                                href={social.url} 
                                                className="contact-social-link"
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                <span className="contact-social-icon">
                                                    {social.platform.substring(0, 2).toLowerCase()}
                                                </span>
                                                <span>{social.platform}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="contact-form-wrapper">
                                <div className="contact-form-header">
                                    <h2>Start Your Project</h2>
                                    <p>Fill out the form below and we'll get back to you within 24 hours</p>
                                </div>

                                {submitStatus === 'success' && (
                                    <div className="contact-success-message">
                                        <div className="contact-success-icon">✓</div>
                                        <div className="contact-success-content">
                                            <h3>Thank You!</h3>
                                            <p>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                                        </div>
                                    </div>
                                )}

                                {submitStatus === 'error' && (
                                    <div className="contact-error-message">
                                        <div className="contact-error-icon">⚠</div>
                                        <div className="contact-error-content">
                                            <h3>Something went wrong</h3>
                                            <p>There was an issue sending your message. Please try again or contact us directly via email/phone.</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="contact-form-body">
                                    <div className="contact-form-row">
                                        <div className="contact-form-group">
                                            <label htmlFor="full_name">Full Name *</label>
                                            <input
                                                type="text"
                                                id="full_name"
                                                name="full_name" // Matched API key
                                                value={formData.full_name}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div className="contact-form-group">
                                            <label htmlFor="email">Email Address *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="your.email@company.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="contact-form-row">
                                        <div className="contact-form-group">
                                            <label htmlFor="phone">Phone Number</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                        <div className="contact-form-group">
                                            <label htmlFor="company">Company</label>
                                            <input
                                                type="text"
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                placeholder="Your company name"
                                            />
                                        </div>
                                    </div>

                                    <div className="contact-form-group">
                                        <label htmlFor="service">Project Type *</label>
                                        <select
                                            id="service"
                                            name="service" // Matched API key
                                            value={formData.service}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select a service</option>
                                            {/* Dynamically rendered services from API */}
                                            {services.map((service) => (
                                                <option key={service.id} value={service.id}>
                                                    {service.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="contact-form-row">
                                        <div className="contact-form-group">
                                            <label htmlFor="estimated_budget">Estimated Budget</label>
                                            <select
                                                id="estimated_budget"
                                                name="estimated_budget" // Matched API key
                                                value={formData.estimated_budget}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select budget range</option>
                                                {budgetRanges.map((range, index) => (
                                                    <option key={index} value={range}>
                                                        {range}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="contact-form-group">
                                            <label htmlFor="project_timeline">Project Timeline</label>
                                            <select
                                                id="project_timeline"
                                                name="project_timeline" // Matched API key
                                                value={formData.project_timeline}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select timeline</option>
                                                {timelineOptions.map((timeline, index) => (
                                                    <option key={index} value={timeline}>
                                                        {timeline}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="contact-form-group">
                                        <label htmlFor="project_details">Project Details *</label>
                                        <textarea
                                            id="project_details"
                                            name="project_details" // Matched API key
                                            value={formData.project_details}
                                            onChange={handleInputChange}
                                            required
                                            rows="6"
                                            placeholder="Tell us about your project, goals, and any specific requirements..."
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="contact-submit-button"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="contact-loading-spinner"></div>
                                                Sending Message...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="contact-faq-section">
                    <div className="contact-container">
                        <div className="contact-section-header">
                            <div className="contact-section-badge">FAQ</div>
                            <h2>Frequently Asked Questions</h2>
                            <p>Quick answers to common questions about working with us</p>
                        </div>
                        
                        {/* Dynamically rendered FAQs from API */}
                        <div className="contact-faq-grid">
                            {companyInfo.faqs.length > 0 ? (
                                companyInfo.faqs.map((faq, index) => (
                                    <div key={index} className="contact-faq-item">
                                        <h3>{faq.question}</h3>
                                        <p>{faq.answer}</p>
                                    </div>
                                ))
                            ) : (
                                // Fallback/loading state for FAQs
                                dataLoadingError ? (
                                    <div className="contact-faq-item">
                                        <h3>Error loading FAQs</h3>
                                        <p>Could not fetch questions. Please check your API connection.</p>
                                    </div>
                                ) : (
                                    // Static or previous FAQs while loading
                                    <>
                                        <div className="contact-faq-item">
                                            <h3>What's your typical response time?</h3>
                                            <p>We respond to all inquiries within 24 hours, usually much faster. For urgent matters, call us directly.</p>
                                        </div>
                                        <div className="contact-faq-item">
                                            <h3>Do you offer free consultations?</h3>
                                            <p>Yes! We provide free initial consultations to understand your project and discuss how we can help.</p>
                                        </div>
                                    </>
                                )
                            )}
                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="map-section">
                    <div className="contact-container">
                        <div className="contact-map-container">
                            <div className="contact-map-placeholder">
                                <div className="contact-map-content">
                                    <h3>Visit Our Office</h3>
                                    <p>{companyInfo.address}<br/>{companyInfo.location}</p>
                                    <div className="contact-map-features">
                                        <div className="contact-map-feature">
                                            <div className="contact-map-feature-icon">🕒</div>
                                            <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
                                        </div>
                                        <div className="contact-map-feature">
                                            <div className="contact-map-feature-icon">🅿️</div>
                                            <span>Parking Available</span>
                                        </div>
                                        <div className="contact-map-feature">
                                            <div className="contact-map-feature-icon">🚇</div>
                                            <span>Near Subway Station</span>
                                        </div>
                                    </div>
                                    <a 
                                        href={dynamicContactInfo.find(i => i.title === "Visit Us")?.link || '#'} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="contact-map-cta-button"
                                    >
                                        Get Directions 
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </Layout>
    );
};

export default ContactUs;