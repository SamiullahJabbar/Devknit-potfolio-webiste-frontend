// src/pages/AboutUs.js

import React from 'react';
import Layout from '../components/Layout';
import '../css/AboutUs.css';

const AboutUs = () => {
    // Team members data
    const teamMembers = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "CEO & Founder",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            description: "15+ years in digital transformation and business strategy."
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Creative Director",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            description: "Award-winning designer with passion for user-centered design."
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            role: "Lead Developer",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            description: "Full-stack developer specializing in modern web technologies."
        },
        {
            id: 4,
            name: "David Kim",
            role: "Project Manager",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            description: "Expert in agile methodologies and client relationship management."
        }
    ];

    // Values data
    const values = [
        {
            icon: "🎯",
            title: "Excellence",
            description: "We strive for perfection in every project, delivering nothing but the highest quality results."
        },
        {
            icon: "💡",
            title: "Innovation",
            description: "Constantly pushing boundaries with creative solutions and cutting-edge technologies."
        },
        {
            icon: "🤝",
            title: "Collaboration",
            description: "Working closely with clients as partners to achieve shared success and goals."
        },
        {
            icon: "⚡",
            title: "Efficiency",
            description: "Delivering projects on time and within budget without compromising quality."
        }
    ];

    // Stats data
    const stats = [
        { number: "150+", label: "Projects Completed" },
        { number: "50+", label: "Happy Clients" },
        { number: "5+", label: "Years Experience" },
        { number: "98%", label: "Client Satisfaction" }
    ];

    return (
        <Layout>
            <div className="about-us-page">
                
                {/* Hero Section */}
                <section className="about-hero">
                    <div className="hero-container">
                        <div className="hero-content">
                            {/* Renamed: hero-badge -> about-hero-badge */}
                            <div className="about-hero-badge">About Our Company</div>
                            <h1 className="hero-title">
                                Crafting Digital Excellence 
                                {/* Renamed: accent -> about-accent-text */}
                                <span className="about-accent-text"> Since 2018</span>
                            </h1>
                            <p className="hero-description">
                                We are a passionate team of designers, developers, and strategists 
                                dedicated to creating exceptional digital experiences that drive 
                                business growth and user engagement.
                            </p>
                            <div className="hero-stats">
                                {stats.map((stat, index) => (
                                    // FIX: Directly returning JSX inside () for implicit return.
                                    // The previous issue was likely an extra { or a misplaced comment.
                                    <div key={index} className="about-stat-item"> 
                                        <div className="stat-number">{stat.number}</div>
                                        <div className="stat-label">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="hero-visual">
                            <div className="visual-wrapper">
                                <img 
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                                    alt="Our Team" 
                                    className="hero-image"
                                />
                                <div className="floating-element element-1">🚀</div>
                                <div className="floating-element element-2">💎</div>
                                <div className="floating-element element-3">⭐</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                {/* Renamed: story-section -> about-story-section */}
                <section className="about-story-section">
                    {/* Renamed: container -> about-container-wrapper */}
                    <div className="about-container-wrapper"> 
                        {/* Renamed: story-content -> about-story-content */}
                        <div className="about-story-content">
                            {/* Renamed: story-text -> about-story-text */}
                            <div className="about-story-text">
                                <h2>Our Journey</h2>
                                <p>
                                    Founded in 2018, we started as a small team with a big vision: 
                                    to transform how businesses connect with their audiences through 
                                    digital innovation. What began as a passion project has evolved 
                                    into a full-service digital agency trusted by brands worldwide.
                                </p>
                                <p>
                                    Over the years, we've helped startups find their voice, 
                                    established brands reinvent themselves, and everything in between. 
                                    Our approach combines creative thinking with technical expertise 
                                    to deliver solutions that not only look beautiful but also drive 
                                    measurable results.
                                </p>
                                {/* Renamed: story-highlights -> about-story-highlights */}
                                <div className="about-story-highlights">
                                    {/* Renamed: highlight -> about-highlight */}
                                    <div className="about-highlight">
                                        {/* Renamed: highlight-icon -> about-highlight-icon */}
                                        <div className="about-highlight-icon">🏆</div>
                                        {/* Renamed: highlight-text -> about-highlight-text */}
                                        <div className="about-highlight-text">
                                            <strong>15+ Industry Awards</strong>
                                            <span>Recognized for excellence</span>
                                        </div>
                                    </div>
                                    {/* Renamed: highlight -> about-highlight */}
                                    <div className="about-highlight">
                                        <div className="about-highlight-icon">🌍</div>
                                        <div className="about-highlight-text">
                                            <strong>Global Reach</strong>
                                            <span>Clients in 20+ countries</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Renamed: story-visual -> about-story-visual */}
                            <div className="about-story-visual">
                                {/* Renamed: story-image -> about-story-image */}
                                <img 
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                                    alt="Our Office" 
                                    className="about-story-image"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                {/* Renamed: values-section -> about-values-section */}
                <section className="about-values-section">
                    {/* Renamed: container -> about-container-wrapper */}
                    <div className="about-container-wrapper">
                        {/* Renamed: section-header -> about-section-header */}
                        <div className="about-section-header">
                            {/* Renamed: section-badge -> about-section-badge */}
                            <div className="about-section-badge">Our Values</div>
                            <h2>The Principles That Guide Us</h2>
                            <p>These core values shape everything we do and how we work with our clients.</p>
                        </div>
                        {/* Renamed: values-grid -> about-values-grid */}
                        <div className="about-values-grid">
                            {values.map((value, index) => (
                                // FIX: Directly returning JSX inside () for implicit return.
                                <div key={index} className="about-value-card">
                                    {/* Renamed: value-card -> about-value-card */}
                                    {/* Renamed: value-icon -> about-value-icon */}
                                    <div className="about-value-icon">{value.icon}</div>
                                    <h3>{value.title}</h3>
                                    <p>{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                {/* Renamed: team-section -> about-team-section */}
                <section className="about-team-section">
                    {/* Renamed: container -> about-container-wrapper */}
                    <div className="about-container-wrapper">
                        {/* Renamed: section-header -> about-section-header */}
                        <div className="about-section-header">
                            {/* Renamed: section-badge -> about-section-badge */}
                            <div className="about-section-badge">Meet Our Team</div>
                            <h2>The Minds Behind the Magic</h2>
                            <p>Our diverse team brings together expertise from various disciplines to deliver exceptional results.</p>
                        </div>
                        {/* Renamed: team-grid -> about-team-grid */}
                        <div className="about-team-grid">
                            {teamMembers.map((member) => (
                                // FIX: Directly returning JSX inside () for implicit return.
                                <div key={member.id} className="about-team-card">
                                    {/* Renamed: team-card -> about-team-card */}
                                    {/* Renamed: member-image -> about-member-image */}
                                    <div className="about-member-image">
                                        <img src={member.image} alt={member.name} />
                                        {/* Renamed: image-overlay -> about-image-overlay */}
                                        <div className="about-image-overlay">
                                            {/* Renamed: social-links -> about-social-links */}
                                            <div className="about-social-links">
                                                <a href="#" aria-label="LinkedIn">in</a>
                                                <a href="#" aria-label="Twitter">tw</a>
                                                <a href="#" aria-label="Email">@</a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Renamed: member-info -> about-member-info */}
                                    <div className="about-member-info">
                                        <h3>{member.name}</h3>
                                        {/* Renamed: member-role -> about-member-role */}
                                        <div className="about-member-role">{member.role}</div>
                                        <p>{member.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section (Classes were mostly unique, but container is updated) */}
                <section className="about-cta">
                    {/* Renamed: container -> about-container-wrapper */}
                    <div className="about-container-wrapper">
                        <div className="cta-content">
                            <h2>Ready to Start Your Project?</h2>
                            <p>Let's collaborate to bring your vision to life with our expertise and passion.</p>
                            <div className="cta-buttons">
                                <a href="/contact" className="cta-button primary">
                                    Get Started Today
                                </a>
                                <a href="/portfolio" className="cta-button secondary">
                                    View Our Work
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </Layout>
    );
};

export default AboutUs;