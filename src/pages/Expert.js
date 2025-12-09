import React, { useState, useEffect } from 'react';
import '../css/Expert.css'; 
import ExpertHeroImage from '../images/expert.png'; 
import ExpertMatchImage from '../images/expert1.png'; 
import Layout from '../components/Layout';
import { API_BASE_URL } from '../api/baseurl'; 


const faqs = [
  {
    id: 1,
    question: "Why should I hire a web designer for my project?",
    answer: "Hiring a professional web designer ensures your site is aesthetically pleasing, user-friendly (UX/UI), optimized for performance (speed and SEO), and built to meet your specific business goals. They bring technical expertise and design sensibility that often saves time and delivers better results than DIY solutions.",
    description: null 
  },
  {
    id: 2,
    question: "What should I prepare before hiring a web designer?",
    answer: "Websites come in many shapes and sizes, so it’s good to know what you’re looking for before you hire a web designer. Consider gathering the following: website goals, required features, available content (written copy and images), desired timeline and budget. These items will help you fill out your project brief.",
    description: "Websites come in many shapes and sizes, so it’s good to know what you’re looking for before you hire a web designer. Consider gathering the following: website goals, required features, available content (written copy and images), desired timeline and budget. These items will help you fill out your project brief. Learn more"
  },
  {
    id: 3,
    question: "What should I look for in a web designer?",
    answer: "Look for designers with a strong portfolio relevant to your industry, positive client testimonials, clear communication skills, and expertise in the platform you plan to use (like Squarespace). Clarity on project scope and pricing is also key.",
    description: null
  },
  {
    id: 4,
    question: "I found an Expert I want to hire. What do I do now?",
    answer: "Great! The next step is usually to click the 'Contact' or 'Hire Now' button on their profile to start a conversation. Be prepared to share your detailed project brief and discuss timelines and cost directly with the Expert.",
    description: null
  }
];

// FAQ Item Component (Unchanged)
const FAQItem = ({ faq, isOpen, toggleFAQ }) => (
  <div className="devkni-faq-item">
    <button className="devkni-faq-question-button" onClick={() => toggleFAQ(faq.id)}>
      <span className="devkni-faq-question">{faq.question}</span>
      <span className="devkni-faq-icon">{isOpen ? '−' : '+'}</span>
    </button>
    
    <div className={`devkni-faq-answer-container ${isOpen ? 'open' : ''}`}>
      {faq.description && (
        <div className="devkni-faq-description-content">
           <p>{faq.description}</p>
        </div>
      )}
      {!faq.description && (
        <div className="devkni-faq-description-content">
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  </div>
);


const Expert = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFAQId, setOpenFAQId] = useState(2); 

  // Project Fetching Logic (Unchanged)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}projects/`); 
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);
  
  // FAQ Toggle Logic (Unchanged)
  const toggleFAQ = (id) => {
    setOpenFAQId(openFAQId === id ? null : id); 
  };

  return (
    <Layout>
      <div className="devkni-expert-container">
        
        {/* 1. Hire an Expert Hero Section */}
        <div className="devkni-expert-hero-section">
          <div className="devkni-expert-text-column">
            <h1 className="devkni-expert-heading">
              Hire a Devknit Expert
            </h1>
            <p className="devkni-expert-subtext">
              Let us do the work of finding you the perfect Expert so that you can stand out online.
            </p>
            <button className="devkni-expert-button">
              GET MATCHED
            </button>
          </div>
          
          <div className="devkni-expert-image-column">
            <img 
              src={ExpertHeroImage} 
              alt="Squarespace experts working together on a laptop" 
              className="devkni-expert-hero-image"
            />
          </div>
        </div>
        
        {/* 2. Projects Section (Show Experts by project type) */}
        <div className="devkni-projects-section">
          {/* ... (Projects Content) ... */}
          <div className="devkni-projects-content-wrapper">
            <h2 className="devkni-projects-heading">
              Show Experts by <br />project type
            </h2>
            <p className="devkni-projects-subtext">
              Get started by clicking into a category to find additional <br /> filtering options.
            </p>
            
            {loading && <p className="devkni-loading-text">Loading projects...</p>}
            {error && <p className="devkni-error-text">Error: {error}. Could not load projects.</p>}
            
            {!loading && !error && projects.length > 0 && (
              <div className="devkni-projects-grid">
                {projects.map((project) => (
                  <div key={project.id} className="devkni-project-card">
                    <div className="devkni-project-image-wrapper">
                      {project.about_images.length > 0 ? (
                        <img 
                          src={project.about_images[0].image} 
                          alt={project.title} 
                          className="devkni-project-image"
                        />
                      ) : (
                         <div className="devkni-no-image-placeholder">No Image</div>
                      )}
                    </div>
                    
                    <div className="devkni-project-text-content">
                      <h4 className="devkni-project-title">{project.title}</h4>
                      <p className="devkni-project-description">
                        {project.short_description || "No description provided."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* 3. FAQs Section */}
        <div className="devkni-faqs-section">
          <div className="devkni-faqs-wrapper">
            <div className="devkni-faqs-heading-column">
              <h2 className="devkni-faqs-heading">Frequently Asked <br /> Questions</h2>
            </div>
            
            <div className="devkni-faqs-accordion-column">
              {faqs.map((faq) => (
                <FAQItem 
                  key={faq.id}
                  faq={faq}
                  isOpen={openFAQId === faq.id}
                  toggleFAQ={toggleFAQ}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* 🛑 4. NEW Match Section (Reverse Layout) */}
        <div className="devkni-match-section">
          
          {/* Left Column: Image (Slanted) */}
          <div className="devkni-match-image-column">
            <img 
              src={ExpertMatchImage} 
              alt="Two experts discussing a project on a laptop" 
              className="devkni-match-hero-image"
            />
          </div>
          
          {/* Right Column: Text Content */}
          <div className="devkni-match-text-column">
            <h2 className="devkni-match-heading">
              Looking to get <br /> matched?
            </h2>
            <p className="devkni-match-subtext">
              Let us do the work in finding you the perfect Expert for your project.
            </p>
            <button className="devkni-match-button">
              GET MATCHED
            </button>
          </div>
          
        </div>

      </div>
    </Layout>
  );
};

export default Expert;