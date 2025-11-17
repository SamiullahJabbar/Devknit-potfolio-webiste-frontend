// src/pages/ContactUs.js

import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../css/ContactUs.css'; // Make sure this CSS file is also updated!

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        budget: '',
        timeline: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    // Contact information
    const contactInfo = [
        {
            icon: "📧",
            title: "Email Us",
            details: "hello@company.com",
            description: "Send us an email anytime",
            link: "mailto:hello@company.com"
        },
        {
            icon: "📞",
            title: "Call Us",
            details: "+1 (555) 123-4567",
            description: "Mon to Fri, 9am to 6pm",
            link: "tel:+15551234567"
        },
        {
            icon: "📍",
            title: "Visit Us",
            details: "123 Business Ave, Suite 100",
            description: "New York, NY 10001",
            link: "https://maps.google.com"
        },
        {
            icon: "💬",
            title: "Live Chat",
            details: "Start Conversation",
            description: "Available 24/7 for urgent matters",
            link: "#chat"
        }
    ];

    // Service options
    const services = [
        "Web Design & Development",
        "UI/UX Design",
        "Mobile App Development",
        "Digital Marketing",
        "Brand Strategy",
        "E-commerce Solutions",
        "Custom Software",
        "Other"
    ];

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
        
        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                subject: '',
                message: '',
                budget: '',
                timeline: ''
            });
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="contact-us-page">
                
                {/* Hero Section */}
                <section className="contact-hero">
                    {/* UPDATED: hero-container -> contact-hero-container */}
                    <div className="contact-hero-container">
                        {/* UPDATED: hero-content -> contact-hero-content */}
                        <div className="contact-hero-content">
                            {/* UPDATED: hero-badge -> contact-hero-badge */}
                            <div className="contact-hero-badge">Get In Touch</div>
                            {/* UPDATED: hero-title -> contact-hero-title */}
                            <h1 className="contact-hero-title">
                                Let's Start Something 
                                {/* UPDATED: accent -> contact-accent-text */}
                                <span className="contact-accent-text"> Amazing Together</span>
                            </h1>
                            {/* UPDATED: hero-description -> contact-hero-description */}
                            <p className="contact-hero-description">
                                Ready to transform your ideas into reality? We're here to help. 
                                Tell us about your project and let's create something extraordinary.
                            </p>
                            {/* UPDATED: hero-features -> contact-hero-features */}
                            <div className="contact-hero-features">
                                {/* UPDATED: feature -> contact-feature */}
                                <div className="contact-feature">
                                    {/* UPDATED: feature-icon -> contact-feature-icon */}
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
                        {/* UPDATED: hero-visual -> contact-hero-visual */}
                        <div className="contact-hero-visual">
                            {/* UPDATED: visual-wrapper -> contact-visual-wrapper */}
                            <div className="contact-visual-wrapper">
                                {/* UPDATED: hero-image -> contact-hero-image */}
                                <img 
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                                    alt="Contact Us" 
                                    className="contact-hero-image"
                                />
                                {/* UPDATED: floating-card card-1 -> contact-floating-card contact-card-1 */}
                                <div className="contact-floating-card contact-card-1">
                                    {/* UPDATED: card-icon -> contact-card-icon */}
                                    <div className="contact-card-icon">💬</div>
                                    {/* UPDATED: card-text -> contact-card-text */}
                                    <div className="contact-card-text">
                                        <strong>Quick Response</strong>
                                        <span>We'll get back within hours</span>
                                    </div>
                                </div>
                                {/* UPDATED: floating-card card-2 -> contact-floating-card contact-card-2 */}
                                <div className="contact-floating-card contact-card-2">
                                    <div className="contact-card-icon">⭐</div>
                                    <div className="contact-card-text">
                                        <strong>Expert Team</strong>
                                        <span>15+ years experience</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Form & Info Section */}
                <section className="contact-main-section">
                    {/* UPDATED: container -> contact-container */}
                    <div className="contact-container">
                        {/* UPDATED: contact-grid -> contact-main-grid */}
                        <div className="contact-main-grid">
                            
                            {/* Contact Information */}
                            {/* UPDATED: contact-info-sidebar -> contact-sidebar */}
                            <div className="contact-sidebar">
                                {/* UPDATED: sidebar-header -> contact-sidebar-header */}
                                <div className="contact-sidebar-header">
                                    <h2>Get in Touch</h2>
                                    <p>Multiple ways to connect with us</p>
                                </div>
                                
                                {/* UPDATED: contact-methods -> contact-method-list */}
                                <div className="contact-method-list">
                                    {contactInfo.map((item, index) => (
                                        <a 
                                            key={index} 
                                            href={item.link} 
                                            /* UPDATED: contact-method -> contact-method-item */
                                            className="contact-method-item"
                                            target={item.link.startsWith('http') ? '_blank' : '_self'}
                                            rel={item.link.startsWith('http') ? 'noopener noreferrer' : ''}
                                        >
                                            {/* UPDATED: method-icon -> contact-method-icon */}
                                            <div className="contact-method-icon">{item.icon}</div>
                                            {/* UPDATED: method-content -> contact-method-content */}
                                            <div className="contact-method-content">
                                                <h4>{item.title}</h4>
                                                {/* UPDATED: method-details -> contact-method-details */}
                                                <div className="contact-method-details">{item.details}</div>
                                                {/* UPDATED: method-description -> contact-method-description */}
                                                <div className="contact-method-description">{item.description}</div>
                                            </div>
                                            {/* UPDATED: method-arrow -> contact-method-arrow */}
                                            <div className="contact-method-arrow">→</div>
                                        </a>
                                    ))}
                                </div>

                                {/* Social Links */}
                                {/* UPDATED: social-section -> contact-social-section */}
                                <div className="contact-social-section">
                                    <h3>Follow Us</h3>
                                    {/* UPDATED: social-links -> contact-social-links */}
                                    <div className="contact-social-links">
                                        {/* UPDATED: social-link -> contact-social-link */}
                                        <a href="#" className="contact-social-link">
                                            {/* UPDATED: social-icon -> contact-social-icon */}
                                            <span className="contact-social-icon">in</span>
                                            <span>LinkedIn</span>
                                        </a>
                                        <a href="#" className="contact-social-link">
                                            <span className="contact-social-icon">𝕏</span>
                                            <span>Twitter</span>
                                        </a>
                                        <a href="#" className="contact-social-link">
                                            <span className="contact-social-icon">fb</span>
                                            <span>Facebook</span>
                                        </a>
                                        <a href="#" className="contact-social-link">
                                            <span className="contact-social-icon">ig</span>
                                            <span>Instagram</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            {/* UPDATED: contact-form-container -> contact-form-wrapper */}
                            <div className="contact-form-wrapper">
                                {/* UPDATED: form-header -> contact-form-header */}
                                <div className="contact-form-header">
                                    <h2>Start Your Project</h2>
                                    <p>Fill out the form below and we'll get back to you within 24 hours</p>
                                </div>

                                {submitStatus === 'success' && (
                                    /* UPDATED: success-message -> contact-success-message */
                                    <div className="contact-success-message">
                                        {/* UPDATED: success-icon -> contact-success-icon */}
                                        <div className="contact-success-icon">✓</div>
                                        {/* UPDATED: success-content -> contact-success-content */}
                                        <div className="contact-success-content">
                                            <h3>Thank You!</h3>
                                            <p>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                                        </div>
                                    </div>
                                )}

                                {submitStatus === 'error' && (
                                    /* UPDATED: error-message -> contact-error-message */
                                    <div className="contact-error-message">
                                        {/* UPDATED: error-icon -> contact-error-icon */}
                                        <div className="contact-error-icon">⚠</div>
                                        {/* UPDATED: error-content -> contact-error-content */}
                                        <div className="contact-error-content">
                                            <h3>Something went wrong</h3>
                                            <p>Please try again or contact us directly via email/phone.</p>
                                        </div>
                                    </div>
                                )}

                                {/* UPDATED: contact-form -> contact-form-body */}
                                <form onSubmit={handleSubmit} className="contact-form-body">
                                    {/* UPDATED: form-row -> contact-form-row */}
                                    <div className="contact-form-row">
                                        {/* UPDATED: form-group -> contact-form-group */}
                                        <div className="contact-form-group">
                                            <label htmlFor="name">Full Name *</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
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
                                        <label htmlFor="subject">Project Type *</label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select a service</option>
                                            {services.map((service, index) => (
                                                <option key={index} value={service}>
                                                    {service}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="contact-form-row">
                                        <div className="contact-form-group">
                                            <label htmlFor="budget">Estimated Budget</label>
                                            <select
                                                id="budget"
                                                name="budget"
                                                value={formData.budget}
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
                                            <label htmlFor="timeline">Project Timeline</label>
                                            <select
                                                id="timeline"
                                                name="timeline"
                                                value={formData.timeline}
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
                                        <label htmlFor="message">Project Details *</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows="6"
                                            placeholder="Tell us about your project, goals, and any specific requirements..."
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit" 
                                        /* UPDATED: submit-button -> contact-submit-button */
                                        className="contact-submit-button"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                {/* UPDATED: loading-spinner -> contact-loading-spinner */}
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
                    {/* UPDATED: container -> contact-container */}
                    <div className="contact-container">
                        {/* UPDATED: section-header -> contact-section-header */}
                        <div className="contact-section-header">
                            {/* UPDATED: section-badge -> contact-section-badge */}
                            <div className="contact-section-badge">FAQ</div>
                            <h2>Frequently Asked Questions</h2>
                            <p>Quick answers to common questions about working with us</p>
                        </div>
                        
                        {/* UPDATED: faq-grid -> contact-faq-grid */}
                        <div className="contact-faq-grid">
                            {/* UPDATED: faq-item -> contact-faq-item */}
                            <div className="contact-faq-item">
                                <h3>What's your typical response time?</h3>
                                <p>We respond to all inquiries within 24 hours, usually much faster. For urgent matters, call us directly.</p>
                            </div>
                            <div className="contact-faq-item">
                                <h3>Do you offer free consultations?</h3>
                                <p>Yes! We provide free initial consultations to understand your project and discuss how we can help.</p>
                            </div>
                            <div className="contact-faq-item">
                                <h3>What industries do you work with?</h3>
                                <p>We've worked with clients across various industries including tech, healthcare, finance, e-commerce, and more.</p>
                            </div>
                            <div className="contact-faq-item">
                                <h3>What's your project process?</h3>
                                <p>Our process includes discovery, strategy, design, development, testing, and launch with regular client check-ins.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="map-section">
                    {/* UPDATED: container -> contact-container */}
                    <div className="contact-container">
                        {/* UPDATED: map-container -> contact-map-container */}
                        <div className="contact-map-container">
                            {/* UPDATED: map-placeholder -> contact-map-placeholder */}
                            <div className="contact-map-placeholder">
                                {/* UPDATED: map-content -> contact-map-content */}
                                <div className="contact-map-content">
                                    <h3>Visit Our Office</h3>
                                    <p>123 Business Avenue, Suite 100<br/>New York, NY 10001</p>
                                    {/* UPDATED: map-features -> contact-map-features */}
                                    <div className="contact-map-features">
                                        {/* UPDATED: map-feature -> contact-map-feature */}
                                        <div className="contact-map-feature">
                                            {/* UPDATED: feature-icon -> contact-map-feature-icon */}
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
                                    {/* UPDATED: map-cta -> contact-map-cta-button */}
                                    <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="contact-map-cta-button">
                                        Get Directions →
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