import React, { useState, useEffect } from 'react';
import './Footer.css';
import HeaderLogoImage from '../images/1.svg'; // Aapka logo

// API Base URL (Aapki file se import kiya gaya)
import { API_BASE_URL } from '../api/baseurl'; 

// Static Footer Data
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
    heading: '', 
    links: [''],
    sections: [ 
      { subHeading: 'Support', links: ['Help Center', 'Forum', 'Webinars'] },
      { subHeading: 'Resources', links: ['Extensions',  'Free Tools', 'Business Name Generator', 'Logo Maker'] }
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

  // Define sequences for SECURITY and BUSINESS TOOLS
  const securitySequence = [
    'Web Audit',
    'SSL & Encryption',
    'Code Review',
    'Vulnerability Assessment'
  ];

  const businessToolsSequence = [
    'Technical SEO',
    'Optimization',
    'Content Strategy',
    'Technical Support'
  ];

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
      const allServices = await response.json();
      
      if (allServices && allServices.length > 0) {
        // Step 1: Pehle SECURITY services filter karte hain
        const securityServices = [];
        const securityRemaining = [...securitySequence];
        
        securitySequence.forEach(seqTitle => {
          const matchedService = allServices.find(service => {
            const title = service.title || service.name || '';
            return title.toLowerCase().includes(seqTitle.toLowerCase());
          });
          
          if (matchedService) {
            securityServices.push(matchedService);
            // Remove matched service from allServices
            const index = allServices.findIndex(s => s.id === matchedService.id);
            if (index > -1) {
              allServices.splice(index, 1);
            }
          }
        });

        // Step 2: BUSINESS TOOLS services filter karte hain
        const businessToolsServices = [];
        
        businessToolsSequence.forEach(seqTitle => {
          const matchedService = allServices.find(service => {
            const title = service.title || service.name || '';
            return title.toLowerCase().includes(seqTitle.toLowerCase());
          });
          
          if (matchedService) {
            businessToolsServices.push(matchedService);
            // Remove matched service from allServices
            const index = allServices.findIndex(s => s.id === matchedService.id);
            if (index > -1) {
              allServices.splice(index, 1);
            }
          }
        });

        // Step 3: Bache hue services ko Products aur Solutions mein divide karte hain
        const remainingServices = [...allServices];
        const totalRemaining = remainingServices.length;
        const half = Math.ceil(totalRemaining / 2);
        
        const productsServices = remainingServices.slice(0, half);
        const solutionsServices = remainingServices.slice(half);

        // Step 4: Update Footer Data
        const updatedFooterData = StaticFooterData.map(col => {
            if (col.heading === 'Products') {
                return {
                    ...col,
                    links: productsServices.map(s => ({ title: s.title, slug: s.slug })),
                };
            }
            
            if (col.heading === 'Solutions') {
                // Solutions ke links update karte hain
                const solutionsLinks = solutionsServices.map(s => ({ title: s.title, slug: s.slug }));
                
                // SECURITY aur BUSINESS TOOLS sections ko update karte hain
                const updatedSections = col.sections?.map(section => {
                    if (section.subHeading === 'SECURITY') {
                        return {
                            ...section,
                            links: securityServices.map(s => ({ title: s.title, slug: s.slug }))
                        };
                    }
                    
                    if (section.subHeading === 'BUSINESS TOOLS') {
                        return {
                            ...section,
                            links: businessToolsServices.map(s => ({ title: s.title, slug: s.slug }))
                        };
                    }
                    
                    return section;
                }) || [];

                return {
                    ...col,
                    links: solutionsLinks,
                    sections: updatedSections
                };
            }
            
            return col; 
        });
        
        setFooterData(updatedFooterData);
        
        // Debug log for checking distribution
        console.log('Footer Services Distribution:', {
          securityServices: securityServices.map(s => s.title || s.name),
          businessToolsServices: businessToolsServices.map(s => s.title || s.name),
          productsServices: productsServices.map(s => s.title || s.name),
          solutionsServices: solutionsServices.map(s => s.title || s.name)
        });
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
        // 1. Main Heading as an Accordion Item (only if has links)
        if (col.links && col.links.length > 0 && (col.heading || col.links[0] !== '')) {
            flattened.push({
                id: linkIndex++,
                heading: col.heading,
                links: col.links,
                type: 'main',
            });
        }

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

  // Render Branding Section
  const renderBrandingSection = (isMobileView) => (
    <div className={`sq-footer-branding ${isMobileView ? 'sq-footer-branding-mobile' : ''}`}>
        <img src={HeaderLogoImage} alt="Devknit Logo" className="sq-footer-logo" />
        <p className="sq-footer-tagline">A website makes it real</p>
    </div>
  );

  const renderAccordion = () => {
    const flattenedData = getFlattenedAccordionData();

    return (
        <div className="footer-accordion-container">
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
        
        {renderBrandingSection(false)}
        
        <div className="sq-footer-links-grid">
          {footerData.map((col, index) => (
            <div key={index} className="sq-footer-column">
              {col.heading && <h4 className="sq-footer-heading">{col.heading}</h4>}
              
              {col.links && col.links.length > 0 && (col.heading || col.links[0] !== '') && (
                <ul className="sq-footer-list">
                  {renderLinks(col.links)}
                </ul>
              )}

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


  // Main Footer Render
  return (
    <footer className={`sq-footer-container ${isMobile ? 'footer-mobile' : ''}`}>
      
      {isMobile ? renderAccordion() : renderDesktopGrid()}
      
      <div className="sq-footer-bottom-bar">
        <div className="sq-footer-bottom-left">
          
        </div>
        
        <hr className="sq-footer-separator" />

        <div className="sq-footer-bottom-content">
          <div className="sq-footer-language">
            
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