import React, { useState, useEffect } from 'react';
import './Footer.css';
import HeaderLogoImage from '../images/1.svg'; // Aapka logo

// API Base URL (Aapki file se import kiya gaya)
import { API_BASE_URL } from '../api/baseurl'; 

// Static Footer Data (No Change here, we will flatten it in the component)
const StaticFooterData = [
  { 
    heading: 'Products', 
    links: [
      'Website Templates', 'Webinars', 'Domains', 'AI Website Builder', 'Design Intelligence', 
      'Online Stores', 'Services', 'Invoicing', 'Scheduling', 'Content & Memberships', 
      'Donations', 'Payments', 'Marketing Tools', 'Email Campaigns', 'Professional Email', 
      'Feature List', 'Pricing'
    ]
  },
  { 
    heading: 'Solutions', 
    links: [
      'Customer Examples', 'Squarespace Collection', 'Fitness', 'Beauty', 'Photography', 
      'Restaurants', 'Art & Design', 'Wedding', 'Creators', 'Enterprise', 'Squarespace for Pros',
    ],
    sections: [
        { 
            subHeading: 'SECURITY', 
            links: ['Web Audit', 'SSL & Encryption', 'Code Review', 'Vulnerability Assessment'] 
        },
        { 
            subHeading: 'BUSINESS TOOLS', 
            links: ['Technical SEO', 'Optimization', 'Content Strategy', 'Technical Support'] 
        }
    ]
  },
  
  
  { 
    heading: 'Programs', 
    links: ['Circle', 'Affiliates'],
    sections: [ 
      { subHeading: 'Support', links: ['Help Center', 'Forum', 'Webinars', 'Hire an Expert', 'Developer Blog', 'Developer Platform', 'System Status'] },
      { subHeading: 'Resources', links: ['Extensions', 'Squarespace Blog', 'Free Tools', 'Business Name Generator', 'Logo Maker'] }
    ]
  },
  { 
    heading: 'Company', 
    links: [
      'About', 'Careers', 'Our History', 'Our Brand', 'Accessibility', 'Newsroom', 
      'Press & Media', 'Contact Us'
    ],
    sections: [
      { subHeading: 'Follow', links: ['Instagram', 'Youtube', 'LinkedIn', 'Facebook', 'X'] }
    ]
  }
];


const Footer = () => {
  const [footerData, setFooterData] = useState(StaticFooterData);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const fetchServices = async () => {
    const url = `${API_BASE_URL}services/`; 
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const services = await response.json();
      
      if (services && services.length > 0) {
        const totalServices = services.length;
        const half = Math.ceil(totalServices / 2);
        
        const productsServices = services.slice(0, half);
        const solutionsServices = services.slice(half);

        const updatedFooterData = StaticFooterData.map(col => {
            if (col.heading === 'Products') {
                return {
                    ...col,
                    links: productsServices.map(s => ({ title: s.title, slug: s.slug })),
                };
            }
            if (col.heading === 'Solutions') {
                return {
                    ...col,
                    links: solutionsServices.map(s => ({ title: s.title, slug: s.slug })),
                };
            }
            return col; 
        });
        
        setFooterData(updatedFooterData);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    
    const handleResize = () => {
        const mobileCheck = window.innerWidth <= 768;
        setIsMobile(mobileCheck);
        if (!mobileCheck) {
            setOpenIndex(null);
        }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  
  const getFlattenedAccordionData = () => {
    let flattened = [];
    let linkIndex = 0;

    footerData.forEach(col => {
        // 1. Main Heading as an Accordion Item
        flattened.push({
            id: linkIndex++,
            heading: col.heading,
            links: col.links,
            type: 'main',
        });

        // 2. Sub-headings (Sections) as separate Accordion Items
        if (col.sections) {
            col.sections.forEach(sec => {
                flattened.push({
                    id: linkIndex++,
                    heading: sec.subHeading,
                    links: sec.links,
                    type: 'sub',
                });
            });
        }
    });

    return flattened;
  };
  
  const renderLinks = (links, isAccordion = false) => {
    return links.map((link, i) => {
        const title = typeof link === 'string' ? link : link.title;
        const slug = typeof link === 'string' ? link.toLowerCase().replace(/ /g, '-') : link.slug;
        
        const href = typeof link === 'string' 
                     ? `` 
                     : `/services/${slug}`;

        return (
            <li key={i}>
                <a href={href} className={isAccordion ? 'footer-accordion-link' : ''}>{title}</a>
            </li>
        );
    });
  };

  // 🔥 NEW: Render Branding Section (reusable for both mobile and desktop)
  const renderBrandingSection = (isMobileView) => (
    <div className={`sq-footer-branding ${isMobileView ? 'sq-footer-branding-mobile' : ''}`}>
        <img src={HeaderLogoImage} alt="Devknit Logo" className="sq-footer-logo" />
        {/* Logo ke saath text agar image mein nahi hai toh */}
        {/* <span className="sq-footer-logo-text">Devknit</span> */} 
        <p className="sq-footer-tagline">A website makes it real</p>
    </div>
  );

  const renderAccordion = () => {
    const flattenedData = getFlattenedAccordionData();

    return (
        <div className="footer-accordion-container">
            {/* Branding section yahan render hoga */}
            {renderBrandingSection(true)} 
            
            <div className="footer-main-mobile">
                {flattenedData.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div key={item.id} className="footer-accordion-item">
                            <div 
                                className={`footer-accordion-title ${isOpen ? 'open' : ''}`}
                                onClick={() => toggleAccordion(index)}
                            >
                                {item.heading}
                                <span className="footer-accordion-icon">{isOpen ? '▲' : '▼'}</span> 
                            </div>
                            
                            <div 
                                className="footer-accordion-content"
                                style={{ maxHeight: isOpen ? '500px' : '0' }} 
                            >
                                <ul className="sq-footer-list">
                                    {renderLinks(item.links, true)}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
  };


  const renderDesktopGrid = () => (
    <div className="sq-footer-top-section">
        
        {/* Left Side: Logo and Tagline (Using reusable renderBrandingSection) */}
        {renderBrandingSection(false)}
        
        {/* Right Side: Links Grid */}
        <div className="sq-footer-links-grid">
          {footerData.map((col, index) => (
            <div key={index} className="sq-footer-column">
              <h4 className="sq-footer-heading">{col.heading}</h4>
              <ul className="sq-footer-list">
                {renderLinks(col.links)}
              </ul>

              {col.sections && col.sections.map((sec, secIndex) => (
                <div key={secIndex} className="sq-footer-sub-section">
                  <h4 className="sq-footer-heading sq-footer-sub-heading">{sec.subHeading}</h4>
                  <ul className="sq-footer-list">
                    {renderLinks(sec.links)}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
  );


  // ⬇️ MAIN FOOTER RENDER
  return (
    <footer className={`sq-footer-container ${isMobile ? 'footer-mobile' : ''}`}>
      
      {isMobile ? renderAccordion() : renderDesktopGrid()}
      
      <div className="sq-footer-bottom-bar">
        <div className="sq-footer-bottom-left">
          
        </div>
        
        <hr className="sq-footer-separator" />

        <div className="sq-footer-bottom-content">
          <div className="sq-footer-language">
            {/* <span>🌐 English </span> */}
          </div>
          <div className="sq-footer-legal-links">
            <div className={`sq-footer-legal-top-line ${isMobile ? 'bottom-links-mobile' : ''}`}> 
              <a href="#terms">Terms</a>
              <a href="#privacy">Privacy</a>
              <a href="#security">Security Measures</a>
              <a href="#sitemap">Sitemap</a>
              <span className={isMobile ? 'copyright-text-mobile' : ''}><strong> © 2025 Devknit, Inc.</strong></span>
            </div>
            <p className={`sq-footer-time-license ${isMobile ? 'extra-copyright-mobile' : ''}`}>From TIME. © 2025 TIME USA LLC. All rights reserved Used under license.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;