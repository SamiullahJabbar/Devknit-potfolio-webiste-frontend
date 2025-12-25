import React, { useState, useEffect } from 'react';
import './Footer.css';
import HeaderLogoImage from '../images/1.svg';

// API Base URL
import { API_BASE_URL } from '../api/baseurl'; 

const Footer = () => {
  const [footerData, setFooterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [categories, setCategories] = useState([]);
  const [categoryServices, setCategoryServices] = useState({});

  // Define keywords for matching
  const FOOTER_KEYWORDS = {
    'Products': ['DEVELOPMENT', 'PRODUCT', 'PRODUCTS'],
    'Solutions': ['MAINTENANCE', 'SOLUTION', 'SOLUTIONS'],
    'SECURITY': ['SECURITY', 'SECURE'],
    'BUSINESS TOOLS': ['BUSINESS TOOLS', 'BUSINESS', 'TOOLS']
  };

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Function to check if category matches keywords
  const categoryMatches = (categoryName, keywords) => {
    const catNameUpper = categoryName.toUpperCase();
    return keywords.some(keyword => catNameUpper.includes(keyword));
  };

  // Get matching category name for footer section
  const getMatchingCategoryName = (categoryName, sectionKey) => {
    const keywords = FOOTER_KEYWORDS[sectionKey];
    if (keywords && categoryMatches(categoryName, keywords)) {
      return categoryName; // Use the actual category name from backend
    }
    return sectionKey; // Fallback to default section key
  };

  // Fetch categories and their services from API
  useEffect(() => {
    const fetchCategoriesAndServices = async () => {
      try {
        // Fetch all categories
        const categoriesResponse = await fetch(`${API_BASE_URL}categories/`);
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        // Fetch services for each category
        const servicesPromises = categoriesData.map(async (category) => {
          try {
            const servicesResponse = await fetch(`${API_BASE_URL}categories/${category.id}/services/`);
            if (servicesResponse.ok) {
              const servicesData = await servicesResponse.json();
              return { categoryId: category.id, services: servicesData };
            }
            return { categoryId: category.id, services: [] };
          } catch (error) {
            console.error(`Error fetching services for category ${category.name}:`, error);
            return { categoryId: category.id, services: [] };
          }
        });

        const servicesResults = await Promise.all(servicesPromises);
        
        // Organize services by category ID
        const organizedServices = {};
        servicesResults.forEach(result => {
          const category = categoriesData.find(cat => cat.id === result.categoryId);
          if (category) {
            organizedServices[category.id] = {
              categoryName: category.name,
              services: result.services
            };
          }
        });
        
        setCategoryServices(organizedServices);
        
        // Now update footer data based on API categories
        updateFooterDataWithAPI(categoriesData, organizedServices);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use fallback static data if API fails
        setFooterData(getFallbackFooterData());
      } finally {
        setLoading(false);
      }
    };

    const updateFooterDataWithAPI = (apiCategories, apiServices) => {
      // Initialize objects to store matched categories
      const matchedCategories = {
        'Products': null,
        'Solutions': null,
        'SECURITY': null,
        'BUSINESS TOOLS': null
      };
      
      const otherCategories = [];
      
      // First pass: Match categories to footer sections
      apiCategories.forEach(category => {
        const categoryName = category.name;
        const services = apiServices[category.id]?.services || [];
        
        let matched = false;
        
        // Check each footer section
        Object.keys(FOOTER_KEYWORDS).forEach(sectionKey => {
          if (categoryMatches(categoryName, FOOTER_KEYWORDS[sectionKey])) {
            matchedCategories[sectionKey] = {
              categoryName: categoryName,
              services: services,
              displayName: categoryName // Use actual category name
            };
            matched = true;
          }
        });
        
        if (!matched) {
          otherCategories.push({
            categoryName: categoryName,
            services: services,
            displayName: categoryName
          });
        }
      });
      
      // Prepare footer data structure
      const updatedFooterData = [];
      
      // 1. Products Section (DEVELOPMENT)
      const productsCategory = matchedCategories['Products'];
      updatedFooterData.push({
        heading: productsCategory?.displayName || 'Products',
        links: productsCategory ? 
          productsCategory.services.map(service => ({
            title: service.title,
            slug: service.slug
          })) : [
            'Website Templates', 'Webinars', 'Domains', 'AI Website Builder', 'Design Intelligence', 
            'Online Stores', 'Services', 'Invoicing', 'Scheduling', 'Content & Memberships', 
            'Donations', 'Payments', 'Marketing Tools', 'Email Campaigns', 'Professional Email', 
            'Feature List', 'Pricing'
          ],
        type: 'main'
      });
      
      // 2. Solutions Section (MAINTENANCE + other categories)
      const solutionsCategory = matchedCategories['Solutions'];
      const otherSolutionsLinks = [];
      
      // Add services from other unmatched categories
      otherCategories.forEach(cat => {
        otherSolutionsLinks.push(...cat.services.map(service => ({
          title: service.title,
          slug: service.slug
        })));
      });
      
      // Combine with MAINTENANCE services if available
      const allSolutionsLinks = solutionsCategory ? 
        [
          ...solutionsCategory.services.map(service => ({
            title: service.title,
            slug: service.slug
          })),
          ...otherSolutionsLinks
        ] : otherSolutionsLinks;
      
      updatedFooterData.push({
        heading: solutionsCategory?.displayName || 'Solutions',
        links: allSolutionsLinks.slice(0, 11), // Limit to 11 items
        sections: [
          { 
            subHeading: matchedCategories['SECURITY']?.displayName || 'SECURITY', 
            links: matchedCategories['SECURITY'] ? 
              matchedCategories['SECURITY'].services.map(service => ({
                title: service.title,
                slug: service.slug
              })).slice(0, 4) : ['Web Audit', 'SSL & Encryption', 'Code Review', 'Vulnerability Assessment']
          },
          { 
            subHeading: matchedCategories['BUSINESS TOOLS']?.displayName || 'BUSINESS TOOLS', 
            links: matchedCategories['BUSINESS TOOLS'] ? 
              matchedCategories['BUSINESS TOOLS'].services.map(service => ({
                title: service.title,
                slug: service.slug
              })).slice(0, 4) : ['Technical SEO', 'Optimization', 'Content Strategy', 'Technical Support']
          }
        ],
        type: 'main'
      });
      
      // 3. Support & Resources Section (Static)
      updatedFooterData.push({
        heading: '',
        links: [''],
        sections: [ 
          { 
            subHeading: 'Support', 
            links: [
              { title: 'Help Center', href: '/HelpCenter' },
              { title: 'Forum', href: '/forum' },
              { title: 'Webinars', href: '/Webinar' }
            ] 
          },
          { 
            subHeading: 'Resources', 
            links: ['Extensions', 'Free Tools', 'Business Name Generator', 'Logo Maker'] 
          }
        ],
        type: 'static'
      });
      
      // 4. Company Section (Static) - UPDATED
      updatedFooterData.push({
        heading: 'Company',
        links: [
          { title: 'About', href: '/about' },
          { title: 'Careers', href: '/careers' },
          { title: 'Contact Us', href: '/ContactUs' }
        ],
        sections: [
          { 
            subHeading: 'Follow', 
            links: [
              { title: 'Instagram', href: 'https://www.instagram.com/devknitofficial?igsh=MmlmN29xa3hwNDdu&utm_source=qr', external: true },
              { title: 'LinkedIn', href: 'https://www.linkedin.com/company/devknit7/', external: true },
              { title: 'Facebook', href: 'https://facebook.com', external: true },
              { title: 'X', href: 'https://x.com/devkni2', external: true }
            ] 
          }
        ],
        type: 'static'
      });
      
      setFooterData(updatedFooterData);
      
      // Debug log
      console.log('Footer API Integration:', {
        matchedCategories: Object.keys(matchedCategories).map(key => ({
          section: key,
          category: matchedCategories[key]?.displayName || 'Not found',
          servicesCount: matchedCategories[key]?.services.length || 0
        })),
        otherCategories: otherCategories.map(c => c.categoryName),
        totalCategories: apiCategories.length
      });
    };

    // Fallback static data
    const getFallbackFooterData = () => {
      return [
        { 
          heading: 'Products', 
          links: [
            'Website Templates', 'Webinars', 'Domains', 'AI Website Builder', 'Design Intelligence', 
            'Online Stores', 'Services', 'Invoicing', 'Scheduling', 'Content & Memberships', 
            'Donations', 'Payments', 'Marketing Tools', 'Email Campaigns', 'Professional Email', 
            'Feature List', 'Pricing'
          ],
          type: 'static'
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
          ],
          type: 'static'
        },
        { 
          heading: '', 
          links: [''],
          sections: [ 
            { 
              subHeading: 'Support', 
              links: [
                { title: 'Help Center', href: '/HelpCenter' },
                { title: 'Forum', href: '/Forum' },
                { title: 'Webinars', href: '/Webinar' }
              ] 
            },
            { 
              subHeading: 'Resources', 
              links: ['Extensions', 'Free Tools', 'Business Name Generator', 'Logo Maker'] 
            }
          ],
          type: 'static'
        },
        { 
          heading: 'Company', 
          links: [
            { title: 'About', href: '/ContactUs' },
            { title: 'Careers', href: '/' },
            { title: 'Contact Us', href: '/ContactUs' }
          ],
          sections: [
            { 
              subHeading: 'Follow', 
              links: [
                { title: 'Instagram', href: 'https://www.instagram.com/devknitofficial?igsh=MmlmN29xa3hwNDdu&utm_source=qr', external: true },
                { title: 'LinkedIn', href: 'https://www.linkedin.com/company/devknit7/', external: true },
                { title: 'Facebook', href: 'https://facebook.com', external: true },
                { title: 'X', href: 'https://x.com/devkni2', external: true }
              ] 
            }
          ],
          type: 'static'
        }
      ];
    };

    fetchCategoriesAndServices();
  }, []);

  useEffect(() => {
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
                type: col.type || 'main',
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
    if (loading) {
      return <li>Loading...</li>;
    }
    
    return links.map((link, i) => {
      // Check if link is an object with href (for custom links)
      if (typeof link === 'object') {
        const { title, href, external, slug } = link;
        
        // For external social links
        if (external) {
          return (
            <li key={i}>
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className={isAccordion ? 'footer-accordion-link' : ''}
              >
                {title}
              </a>
            </li>
          );
        }
        
        // For internal custom links (About, Careers, Contact Us, etc.)
        if (href) {
          return (
            <li key={i}>
              <a href={href} className={isAccordion ? 'footer-accordion-link' : ''}>
                {title}
              </a>
            </li>
          );
        }
        
        // For service links with slug
        if (slug) {
          return (
            <li key={i}>
              <a href={`/services/${slug}`} className={isAccordion ? 'footer-accordion-link' : ''}>
                {title}
              </a>
            </li>
          );
        }
      }
      
      // For old string format (backward compatibility)
      if (typeof link === 'string') {
        const slug = link.toLowerCase().replace(/ /g, '-');
        const href = `/services/${slug}`;
        
        return (
          <li key={i}>
            <a href={href} className={isAccordion ? 'footer-accordion-link' : ''}>
              {link}
            </a>
          </li>
        );
      }
      
      return null;
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
      
      {loading ? (
        <div className="footer-loading">Loading...</div>
      ) : isMobile ? renderAccordion() : renderDesktopGrid()}
      
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