import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../api/baseurl'; 
import HeaderLogoImage from '../images/devknit.png';
import './Header.css';

// --- UPDATED: GOOGLE TRANSLATE INITIALIZATION FUNCTION ---
// Languages list: English, Russian, Ukrainian, Kazakh, Uzbek, Kyrgyz, Turkmen
const INCLUDED_LANGUAGES = 'en,ru,uk,kk,uz,ky,tk';

function googleTranslateElementInit() {
  if (window.google && window.google.translate) {
    const desktopIdExists = document.getElementById('google_translate_element');
    const mobileIdExists = document.getElementById('google_translate_element_mobile');

    if (desktopIdExists) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en', 
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          includedLanguages: INCLUDED_LANGUAGES // <--- UPDATED
        }, 'google_translate_element'); // Desktop ID
    }

    if (mobileIdExists) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en', 
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          includedLanguages: INCLUDED_LANGUAGES // <--- UPDATED
        }, 'google_translate_element_mobile'); // Mobile ID
    }
  }
}

// Global scope mein function ko attach karein
window.googleTranslateElementInit = googleTranslateElementInit; 
// ----------------------------------------------------

const HeaderLogo = ({ src, alt }) => (
  <div className="header-logo-container-wrapper">
    <img 
      src={src} 
      alt={alt} 
      className="header-logo-img"
    />
  </div>
);

const Header = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState({
    development: [],
    maintenance: [],
    security: [],
    businessTools: []
  });
  const [loading, setLoading] = useState(true);
  
  const servicesTimeoutRef = useRef(null);
  const resourcesTimeoutRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Define the exact sequence for each category
  const categorySequence = {
    development: [
      'Mobile Development',
      'Integrations', 
      'Web Design',
      'Maintenance and Support',
      'SEO & Analytics'
    ],
    maintenance: [
      'Hosting & Deployment',
      'Web Security',
      'UI/UX & Branding',
      'Shopify Store Setup'
    ],
    security: [
      'Web Audit',
      'SSL & Encryption',
      'Code Review',
      'Vulnerability Assessment'
    ],
    businessTools: [
      'Technical SEO',
      'Optimization',
      'Content Strategy',
      'Technical Support'
    ]
  };

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}services/`);
        if (response.ok) {
          const data = await response.json();
          setServices(data);
          
          // Organize services into the exact sequence
          organizeServicesBySequence(data);
        } else {
          console.error('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Organize services into exact sequence
  const organizeServicesBySequence = (servicesList) => {
    // Initialize arrays for each category with matched services
    let development = [];
    let maintenance = [];
    let security = [];
    let businessTools = [];
    let unmatched = [];

    // Pehlay exact sequence match karne ka try karo
    servicesList.forEach(service => {
      const title = service.title || service.name || '';
      const lowerTitle = title.toLowerCase();
      
      let matched = false;
      
      // Check development sequence
      for (const seqTitle of categorySequence.development) {
        if (lowerTitle.includes(seqTitle.toLowerCase())) {
          development.push(service);
          matched = true;
          break;
        }
      }
      
      // If not matched yet, check maintenance
      if (!matched) {
        for (const seqTitle of categorySequence.maintenance) {
          if (lowerTitle.includes(seqTitle.toLowerCase())) {
            maintenance.push(service);
            matched = true;
            break;
          }
        }
      }
      
      // If not matched yet, check security
      if (!matched) {
        for (const seqTitle of categorySequence.security) {
          if (lowerTitle.includes(seqTitle.toLowerCase())) {
            security.push(service);
            matched = true;
            break;
          }
        }
      }
      
      // If not matched yet, check business tools
      if (!matched) {
        for (const seqTitle of categorySequence.businessTools) {
          if (lowerTitle.includes(seqTitle.toLowerCase())) {
            businessTools.push(service);
            matched = true;
            break;
          }
        }
      }
      
      // If still not matched, add to unmatched array
      if (!matched) {
        unmatched.push(service);
      }
    });

    // Ab unmatched services ko distribute karte hain
    // BUSINESS TOOLS aur SECURITY mein sirf 4 items tak hi allow karenge
    const maxItemsPerCategory = 4;
    
    // Sabse pehle ensure karte hain ke BUSINESS TOOLS aur SECURITY 4 se zyada na ho
    if (businessTools.length > maxItemsPerCategory) {
      // Extra items ko unmatched mein daal do
      const extraBusinessTools = businessTools.slice(maxItemsPerCategory);
      businessTools = businessTools.slice(0, maxItemsPerCategory);
      unmatched.push(...extraBusinessTools);
    }
    
    if (security.length > maxItemsPerCategory) {
      // Extra items ko unmatched mein daal do
      const extraSecurity = security.slice(maxItemsPerCategory);
      security = security.slice(0, maxItemsPerCategory);
      unmatched.push(...extraSecurity);
    }

    // Ab unmatched services ko DEVELOPMENT aur MAINTENANCE mein distribute karte hain
    // Pehle DEVELOPMENT ko bharne ka try karenge
    while (unmatched.length > 0 && development.length < 6) { // Max 6 items in development
      const service = unmatched.shift();
      development.push(service);
    }

    // Phir bache hue MAINTENANCE mein daal do
    while (unmatched.length > 0 && maintenance.length < 6) { // Max 6 items in maintenance
      const service = unmatched.shift();
      maintenance.push(service);
    }

    // Agar phir bhi bache hain to round-robin distribution
    if (unmatched.length > 0) {
      // Sabse pehle BUSINESS TOOLS aur SECURITY ko priority denge agar unme jagah ho
      const categories = [businessTools, security, development, maintenance];
      
      let categoryIndex = 0;
      while (unmatched.length > 0) {
        const service = unmatched.shift();
        categories[categoryIndex].push(service);
        categoryIndex = (categoryIndex + 1) % categories.length;
      }
    }

    // Final result - limit to appropriate numbers per category
    const result = {
      development: development.slice(0, 6), // Max 6 items in development
      maintenance: maintenance.slice(0, 6), // Max 6 items in maintenance
      security: security.slice(0, 4), // Max 4 items in security
      businessTools: businessTools.slice(0, 4) // Max 4 items in business tools
    };

    // Debug log for checking distribution
    console.log('Services Distribution:', {
      development: result.development.map(s => s.title || s.name),
      maintenance: result.maintenance.map(s => s.title || s.name),
      security: result.security.map(s => s.title || s.name),
      businessTools: result.businessTools.map(s => s.title || s.name)
    });

    setFilteredServices(result);
  };

  // Check screen size for mobile responsiveness & Init Translate on resize/load
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 992); 
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    if (window.google) { 
        googleTranslateElementInit();
    }

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      clearTimeout(servicesTimeoutRef.current);
      clearTimeout(resourcesTimeoutRef.current);
    };
  }, []);

  // Close dropdowns when route changes
  useEffect(() => {
    setIsServicesOpen(false);
    setIsResourcesOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleServiceNavigation = (slug) => {
    navigate(`/services/${slug}`);
    if(isMobile) setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
    if(isMobile) setIsMobileMenuOpen(false);
  };

  // Dropdown handlers with delay (Desktop only)
  const handleServicesMouseEnter = () => {
    if (isMobile) return; 
    clearTimeout(servicesTimeoutRef.current);
    setIsServicesOpen(true);
    setIsResourcesOpen(false);
  };

  const handleServicesMouseLeave = () => {
    if (isMobile) return; 
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 300);
  };

  const handleResourcesMouseEnter = () => {
    if (isMobile) return; 
    clearTimeout(resourcesTimeoutRef.current);
    setIsResourcesOpen(true);
    setIsServicesOpen(false);
  };

  const handleResourcesMouseLeave = () => {
    if (isMobile) return; 
    resourcesTimeoutRef.current = setTimeout(() => {
      setIsResourcesOpen(false);
    }, 300);
  };

  const handleDropdownMouseEnter = (type) => {
    if (isMobile) return;
    if (type === 'services') clearTimeout(servicesTimeoutRef.current);
    if (type === 'resources') clearTimeout(resourcesTimeoutRef.current);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, isMobile]);

  const renderDropdownLink = (item, handleNav, isApi = true) => (
      <div 
          key={isApi ? item.id : item.text} 
          className="dropdown-item-style"
          onMouseEnter={(e) => e.target.style.color = '#AAAAAA'}
          onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
          onClick={() => handleNav(isApi ? item.slug : item.path)}
      >
          {isApi ? item.title : item.text}
      </div>
  );

  // --- SERVICES DROPDOWN CONTENT (Desktop) ---
  const servicesContent = !isMobile && (
    <div 
      className={`dropdown-menu services-dropdown-menu ${isServicesOpen ? 'show' : ''}`}
      onMouseEnter={() => handleDropdownMouseEnter('services')}
      onMouseLeave={handleServicesMouseLeave}
    >
      
      {/* COLUMN 1: DEVELOPMENT */}
      <div className="dropdown-column dropdown-column-1">
        <div className="dropdown-column-title">DEVELOPMENT</div>
        {filteredServices.development.length > 0 ? (
          filteredServices.development.map((service) => (
            renderDropdownLink(service, handleServiceNavigation, true)
          ))
        ) : (
          <div className="dropdown-item-style">No development services available</div>
        )}
        
        <div 
          className="dropdown-item-style dropdown-view-all-features"
          onMouseEnter={(e) => e.target.style.color = 'white'}
          onMouseLeave={(e) => e.target.style.color = '#CCCCCC'}
          onClick={() => handleNavigation('/projects')}
        >
          View All Features
        </div>
      </div>

      {/* COLUMN 2: MAINTENANCE */}
      <div className="dropdown-column dropdown-column-2">
        <div className="dropdown-column-title">MAINTENANCE</div>
        {filteredServices.maintenance.length > 0 ? (
          filteredServices.maintenance.map((service) => (
            renderDropdownLink(service, handleServiceNavigation, true)
          ))
        ) : (
          <div className="dropdown-item-style">No maintenance services available</div>
        )}
      </div>
      
      {/* COLUMN 3: SECURITY & BUSINESS TOOLS */}
      <div className="dropdown-column dropdown-column-3-security-tools">
        <div className="dropdown-column-title">SECURITY</div>
        {filteredServices.security.length > 0 ? (
          filteredServices.security.map((service) => (
            renderDropdownLink(service, handleServiceNavigation, true)
          ))
        ) : (
          <div className="dropdown-item-style">No security services available</div>
        )}
        
        <div className="dropdown-tools-section">
          <div className="dropdown-column-title">BUSINESS TOOLS</div>
          {filteredServices.businessTools.length > 0 ? (
            filteredServices.businessTools.map((service) => (
              renderDropdownLink(service, handleServiceNavigation, true)
            ))
          ) : (
            <div className="dropdown-item-style">No business tools available</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderResourceLink = (text, path, description) => (
    <div className="resource-link-container">
      <div
        className="resource-link-title"
        onMouseEnter={(e) => (e.target.style.color = '#AAAAAA')}
        onMouseLeave={(e) => (e.target.style.color = '#FFFFFF')}
        onClick={() => handleNavigation(path)}
      >
        {text}
      </div>
      <p className="resource-link-description">
        {description}
      </p>
    </div>
  );

  // RESOURCES DROPDOWN CONTENT (Desktop)
  const resourcesContent = (
    <div
      className={`dropdown-menu resources-dropdown-menu ${isResourcesOpen ? 'show' : ''}`}
      onMouseEnter={() => handleDropdownMouseEnter('resources')}
      onMouseLeave={handleResourcesMouseLeave}
    >
      
      {/* COLUMN 1: 24/7 SUPPORT */}
      <div className="dropdown-column dropdown-column-1">
        <div className="dropdown-column-title">24/7 SUPPORT</div>

        {renderResourceLink(
          'Help Center',
          '', 
          'In-depth guides and videos about the platform, our services, and how to get started.'
        )}

        {renderResourceLink(
          'Forum',
          '', 
          'An online community for Squarespace users to discuss best practices and seek advice.'
        )}

        {renderResourceLink(
          'Webinars',
          '', 
          "Free online sessions where you'll learn the basics and refine your Squarespace skills."
        )}
      </div>
       
      {/* COLUMN 2: Blog, Hire an Expert */}
      <div className="dropdown-column dropdown-column-2-blog-contact">
        <div className="dropdown-column-title resource-empty-title">&nbsp;</div> 

        {renderResourceLink(
          'Blog',
          '/articles', 
          'Stories and solutions for the modern entrepreneur.'
        )}

        {renderResourceLink(
          'Hire an Expert',
          '', 
          'Let us do the work of finding you the perfect Expert to help you stand out online.'
        )}

        {renderResourceLink(
          'Contact us',
          '/ContactUs', 
          'Ready to stand out? Connect with us, and we will match you with the perfect Expert.'
        )}
      </div>

      {/* COLUMN 3: GET INSPIRED */}
      <div className="special-box-container dropdown-column-3-inspired">
        <div className="dropdown-column-title">GET INSPIRED</div>
        
        <div 
          className="special-box-style special-box-inspired"
          onClick={() => handleNavigation('')} 
        >
          <div className="special-box-title resource-title-link">Made with Devknit</div>
          <div className="special-box-description">
            A collection of inspirational websites by real Devknit users.
          </div>
        </div>

        {/* FOR B2B Section - Added below in same column */}
        <div 
          className="special-box-style special-box-inspired"
          onClick={() => handleNavigation('')} 
        >
          <div className="special-box-title resource-title-link">Circle</div>
          <div className="special-box-description">
            The partner program for freelancers and agencies.
          </div>
        </div>
      </div>
    </div>
  );

  // --- Mobile Services Content ---
  const mobileServicesContent = [
    { 
      title: 'DEVELOPMENT', 
      items: filteredServices.development.map(s => ({ 
        text: s.title || s.name, 
        path: `/services/${s.slug}` 
      })) 
    },
    { 
      title: 'MAINTENANCE', 
      items: filteredServices.maintenance.map(s => ({ 
        text: s.title || s.name, 
        path: `/services/${s.slug}` 
      })) 
    },
    { 
      title: 'SECURITY', 
      items: filteredServices.security.map(s => ({ 
        text: s.title || s.name, 
        path: `/services/${s.slug}` 
      })) 
    },
    { 
      title: 'BUSINESS TOOLS', 
      items: filteredServices.businessTools.map(s => ({ 
        text: s.title || s.name, 
        path: `/services/${s.slug}` 
      })) 
    },
  ];

  const mobileResourcesLinks = [
    { type: 'link', text: 'Help Center', path: '' },
    { type: 'link', text: 'Forum', path: '' },
    { type: 'link', text: 'Webinars', path: '' },
    { type: 'link', text: 'Blog', path: '/articles' },
    { type: 'link', text: 'Hire an Expert', path: '' }, 
    { type: 'title', text: 'GET INSPIRED' }, 
    { 
        type: 'box', 
        title: 'Made with Devknit', 
        description: 'A collection of inspirational websites by real Devknit users.', 
        path: '/made-with-devknit' 
    }, 
    { type: 'link', text: 'Contact us', path: '/ContactUs' }, 
  ];
  
  const renderMobileMenuIcon = (isOpen) => (
    <span className={`mobile-menu-item-icon ${isOpen ? 'open' : ''}`}>
       {isOpen ? '∧' : '∨'}
    </span>
  );

  const mobileMenuContent = isMobile && (
    <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
      
      {/* SERVICES MENU */}
      <div 
        className="mobile-menu-item"
        onClick={() => {
          setIsServicesOpen(!isServicesOpen);
          setIsResourcesOpen(false);
        }}
      >
        Services 
        {renderMobileMenuIcon(isServicesOpen)}
      </div>
      
      <div 
        className={`mobile-submenu services-submenu ${isServicesOpen ? 'open' : ''}`}
      >
        {mobileServicesContent.map((group) => (
          <div key={group.title}>
              <div className="mobile-submenu-title">{group.title}</div>
              {group.items.map((item) => (
                <div 
                  key={item.text}
                  className="mobile-submenu-link"
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.text}
                </div>
              ))}
          </div>
        ))}

        <div 
            className="mobile-submenu-link view-all-features"
            onClick={() => handleNavigation('/projects')}
        >
            View All Features
        </div>
      </div>

      {/* RESOURCES MENU */}
      <div 
        className="mobile-menu-item mobile-menu-item-bordered"
        onClick={() => {
          setIsResourcesOpen(!isResourcesOpen);
          setIsServicesOpen(false);
        }}
      >
        Resources 
        {renderMobileMenuIcon(isResourcesOpen)}
      </div>
      
      <div 
        className={`mobile-submenu resources-submenu ${isResourcesOpen ? 'open' : ''}`}
      >
          {mobileResourcesLinks.map((item, index) => {
            if (item.type === 'link') {
              return (
                <div 
                  key={index} 
                  className="mobile-submenu-link"
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.text}
                </div>
              );
            } else if (item.type === 'title') {
              return (
                <div key={index} className="mobile-submenu-title mobile-get-inspired-title">
                  {item.text}
                </div>
              );
            } else if (item.type === 'box') {
              return (
                <div 
                    key={index} 
                    className="mobile-get-inspired-box"
                    onClick={() => handleNavigation(item.path)}
                >
                    <div className="mobile-get-inspired-title-box">{item.title}</div>
                    <div className="mobile-get-inspired-description">{item.description}</div>
                </div>
              );
            }
            return null;
          })}
      </div>
      
      {/* START PROJECT BUTTON */}
      <div className="mobile-cta-container">
        <button 
          className="mobile-cta-button" 
          onClick={() => handleNavigation('/ContactUs')}
        >
          START PROJECT
        </button>
      </div>
    </div>
  );

  return (
    <header 
      className={`header-main ${isMobile ? 'header-mobile' : ''}`} 
    >
      <div 
        className="header-logo-container" 
        onClick={() => handleNavigation('/')}
      >
        <HeaderLogo src={HeaderLogoImage} alt="DevAurora Logo" />
      </div>
      
      {/* Desktop Menu */}
      <nav className={`header-center-menu ${isMobile ? 'hidden' : ''}`}>
        <div
          className="header-menu-item"
          onMouseEnter={handleServicesMouseEnter}
          onMouseLeave={handleServicesMouseLeave}
        >
          Services
          {servicesContent}
        </div>
        <div
          className="header-menu-item"
          onMouseEnter={handleResourcesMouseEnter}
          onMouseLeave={handleResourcesMouseLeave}
        >
          Resources
          {resourcesContent}
        </div>
      </nav>
      
      {/* Desktop Utility */}
      <div className={`header-utility-container ${isMobile ? 'hidden' : ''}`}>
        <div id="google_translate_element" className="header-translate-widget"></div>
        <button 
          className="header-cta-button" 
          onClick={() => handleNavigation('/ContactUs')}
        >
          START PROJECT
        </button>
      </div>
      
      {/* Mobile Menu & Translate Icon Container */}
      <div className={`mobile-utility-wrapper ${isMobile ? 'show' : ''}`}> 
        <div id="google_translate_element_mobile" className="google-translate-mobile-placeholder"></div>
        <button 
          className={`mobile-menu-toggle-button ${isMobile ? 'show' : ''}`}
          onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              if(isMobileMenuOpen) {
                   setIsServicesOpen(false);
                   setIsResourcesOpen(false);
              }
          }}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      
      {/* Mobile Menu Content */}
      {mobileMenuContent}
    </header>
  );
};

export default Header;