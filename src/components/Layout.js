// File: Layout.js (Combining Header, Footer, and Layout Components)

// *************************************************************
// NEW IMPORT: Adding the responsive adjustments CSS file here
// Make sure this file exists in the same directory!
import './responsive.css'; 
// *************************************************************

// --- 1. Header Component (Original Code - UNTOUCHED) ---

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../api/baseurl'; 

// Import your logos - update these paths according to your project structure
import HeaderLogoImage from '../images/1.svg';

// --- CSS IMPORTS ---
import './Header.css'; // For Header Mobile Styles
import './Footer.css'; // For Footer Mobile Styles

// Custom component for the logo image with size control
const HeaderLogo = ({ src, alt, size = 30 }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img 
      src={src} 
      alt={alt} 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        marginRight: '10px',
        objectFit: 'contain'
      }} 
    />
  </div>
);

// Footer logo component with size control
const FooterLogo = ({ src, alt, size = 30 }) => (
  <img 
    src={src} 
    alt={alt} 
    style={{ 
      width: `${size}px`, 
      height: `${size}px`, 
      marginRight: '10px',
      objectFit: 'contain'
    }} 
  />
);

const Header = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Refs for dropdown timeouts
  const servicesTimeoutRef = useRef(null);
  const resourcesTimeoutRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Logo sizes - easily adjustable here
  const logoSize = 120;

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}services/`);
        if (response.ok) {
          const data = await response.json();
          setServices(data);
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

  // Check screen size for mobile responsiveness
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 992); 
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
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

  // Handle navigation to service detail page
  const handleServiceNavigation = (slug) => {
    navigate(`/services/${slug}`);
    if(isMobile) setIsMobileMenuOpen(false);
  };

  // Handle navigation - FIXED: Scroll to top when navigating
  const handleNavigation = (path) => {
    navigate(path);
    // Scroll to top immediately when navigating
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

  // Cancel timeouts when entering dropdown content (Desktop only)
  const handleDropdownMouseEnter = (type) => {
    if (isMobile) return;
    if (type === 'services') clearTimeout(servicesTimeoutRef.current);
    if (type === 'resources') clearTimeout(resourcesTimeoutRef.current);
  };

  // --- SERVICE GROUPING LOGIC (Dynamic Half-Half Division) ---
  const totalServices = services.length;
  const halfCount = Math.ceil(totalServices / 2); 

  const developmentServices = services.slice(0, halfCount); 
  const maintenanceServices = services.slice(halfCount, totalServices); 

  // STATIC DATA for SECURITY and BUSINESS TOOLS 
  const staticSecurityServices = [
    { text: 'Web Audit', path: '' },
    { text: 'SSL & Encryption', path: '' },
    { text: 'Code Review', path: '' },
    { text: 'Vulnerability Assessment', path: '' },
  ];

  const staticBusinessTools = [
    { text: 'Technical SEO', path: '' },
    { text: 'Optimization', path: '' },
    { text: 'Content Strategy', path: '' },
    { text: 'Technical Support', path: '' },
  ];
  // -----------------------------------------------------------------


  // --- Header Inline CSS Styles (Desktop/Base) ---

  const headerStyle = {
    backgroundColor: '#000000',
    color: 'white',
    padding: '0 40px', 
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '65px',
    borderBottom: '1px solid #333',
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    width: '100%',
    zIndex: 1000,
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  };

  const logoContainerStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    fontSize: '18px', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    flexShrink: 0, 
    zIndex: 1001,
  };
  
  const centerMenuStyle = { 
    display: isMobile ? 'none' : 'flex', 
    alignItems: 'center', 
  };
  
  const utilityContainerStyle = { 
    display: isMobile ? 'none' : 'flex', 
    alignItems: 'center', 
    flexShrink: 0, 
  };
  
  const menuItemStyle = { 
    position: 'relative', 
    margin: '0 15px', 
    padding: '5px 0', 
    cursor: 'pointer', 
    fontWeight: '500', 
    fontSize: '15px', 
    letterSpacing: '0.5px', 
  };

  const buttonStyle = {
    backgroundColor: 'white', 
    color: '#000000', 
    border: 'none', 
    padding: '10px 15px', 
    marginLeft: '15px', 
    fontSize: '13px', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    borderRadius: '1px', 
    letterSpacing: '1px', 
    textTransform: 'uppercase',
  };

  const mobileMenuButtonStyle = {
    display: isMobile ? 'block' : 'none',
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    zIndex: 1001,
  };

  // ************ Dropdown Styles (Desktop Only) ************
  
  const dropdownMenuBaseStyle = {
    position: 'absolute', 
    top: '55px', 
    left: '50%', 
    transform: 'translateX(-50%)', 
    backgroundColor: '#000000', 
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6)', 
    zIndex: 100, 
    minWidth: '950px',
    maxWidth: '950px',
    padding: '25px', 
    display: 'flex', 
    flexDirection: 'row',
    borderRadius: '4px', 
    opacity: 0, 
    visibility: 'hidden', 
    transition: 'opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease', 
    pointerEvents: 'none',
    transform: 'translateX(-50%) scale(0.95)',
  };
  
  const showDropdownStyle = { 
    opacity: 1, 
    visibility: 'visible', 
    pointerEvents: 'auto', 
    transform: 'translateX(-50%) scale(1)',
  };
  
  const dropdownColumnStyle = { 
    padding: '0 20px', 
    flex: 1, 
  };
  
  const dropdownColumnTitleStyle = { 
    fontSize: '14px', 
    fontWeight: 'bold', 
    color: '#878787', 
    marginBottom: '20px', 
    textTransform: 'uppercase', 
    paddingTop: '5px', 
  };
  
  const dropdownItemStyle = { 
    fontSize: '13px', 
    padding: '7px 0', 
    cursor: 'pointer', 
    whiteSpace: 'nowrap', 
    color: '#FFFFFF',
    transition: 'color 0.2s ease',
  };
  
  const specialBoxContainerStyle = { 
    paddingLeft: '30px', 
    width: '240px', 
    flexShrink: 0,
  };
  
  const specialBoxStyle = { 
    backgroundColor: '#000000', 
    padding: '15px', 
    borderRadius: '4px', 
    marginBottom: '10px', 
    width: '100%', 
    cursor: 'pointer', 
    transition: 'background-color 0.2s ease',
  };
  
  const specialBoxTitleStyle = { 
    fontSize: '14px', 
    fontWeight: 'bold', 
    marginBottom: '5px', 
    color: 'white',
  };
  
  const specialBoxDescriptionStyle = { 
    fontSize: '13px', 
    color: '#AAAAAA', 
    lineHeight: '1.4', 
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

  // Helper function to render the link item with proper hover state (Desktop only)
  const renderDropdownLink = (item, handleNav, isApi = true) => (
      <div 
          key={isApi ? item.id : item.text} 
          style={dropdownItemStyle}
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
      style={{ 
        ...dropdownMenuBaseStyle, 
        minWidth: '950px',
        maxWidth: '950px',
        ...(isServicesOpen && showDropdownStyle) 
      }}
      onMouseEnter={() => handleDropdownMouseEnter('services')}
      onMouseLeave={handleServicesMouseLeave}
    >
      
      {/* ===== COLUMN 1: DEVELOPMENT (API data + View All Features) ===== */}
      <div style={{ ...dropdownColumnStyle, paddingRight: '20px' }}>
        <div style={dropdownColumnTitleStyle}>DEVELOPMENT</div>
        {developmentServices.length > 0 ? (
          developmentServices.map((service) => (
            renderDropdownLink(service, handleServiceNavigation, true)
          ))
        ) : (
          <div style={dropdownItemStyle}>No development services available</div>
        )}
        
        {/* View All Features Link (Route: /projects as requested) */}
        <div 
          style={{
              ...dropdownItemStyle, 
              marginTop: '55px', 
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#ffffffff' 
          }}
          onMouseEnter={(e) => e.target.style.color = 'white'}
          onMouseLeave={(e) => e.target.style.color = '#CCCCCC'}
          onClick={() => handleNavigation('/projects')}
        >
          View All Features
        </div>
      </div>

      {/* ===== COLUMN 2: MAINTENANCE (API data) ===== */}
      <div style={{ ...dropdownColumnStyle, paddingLeft: '20px', paddingRight: '20px' }}>
        <div style={dropdownColumnTitleStyle}>MAINTENANCE</div>
        {maintenanceServices.length > 0 ? (
          maintenanceServices.map((service) => (
            renderDropdownLink(service, handleServiceNavigation, true)
          ))
        ) : (
          <div style={dropdownItemStyle}>No maintenance services available</div>
        )}
      </div>
      
      {/* ===== COLUMN 3: SECURITY & BUSINESS TOOLS (Static Data) ===== */}
      <div style={{ ...dropdownColumnStyle, paddingLeft: '20px', paddingRight: '20px', borderRight: '1px solid #333' }}>
        {/* SECURITY */}
        <div style={dropdownColumnTitleStyle}>SECURITY</div>
        {staticSecurityServices.map((item) => (
            renderDropdownLink(item, handleNavigation, false)
        ))}
        
        {/* BUSINESS TOOLS */}
        <div style={{ marginTop: '20px' }}>
          <div style={dropdownColumnTitleStyle}>BUSINESS TOOLS</div>
          {staticBusinessTools.map((item) => (
            renderDropdownLink(item, handleNavigation, false)
          ))}
        </div>
      </div>
      
      {/* ===== COLUMN 4: FOR B2B (Special Box - Circle) ===== */}
      <div style={{ ...specialBoxContainerStyle, paddingLeft: '10px', borderLeft: '1px solid #333' }}>
        <div style={dropdownColumnTitleStyle}>FOR B2B</div>
        
        {/* Circle Special Box (Static Data) */}
        <div 
          style={{
            ...specialBoxStyle,
            marginTop: '10px', 
            backgroundColor: '#1c1c1c', 
            padding: '10px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'} 
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1c1c1c'} 
          onClick={() => handleNavigation('')} 
        >
          <div style={specialBoxTitleStyle}>Circle</div>
          <div style={specialBoxDescriptionStyle}>
            The partner program for freelancers and agencies
          </div>
        </div>
        
      </div>
    </div>
  );

  // Helper function to render Resources link with description (Desktop only)
  const renderResourceLink = (text, path, description) => (
    <div style={{ marginBottom: '25px' }}>
      <div
        style={{ 
            ...dropdownItemStyle, 
            padding: '0', 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#FFFFFF' 
        }}
        onMouseEnter={(e) => (e.target.style.color = '#AAAAAA')}
        onMouseLeave={(e) => (e.target.style.color = '#FFFFFF')}
        onClick={() => handleNavigation(path)}
      >
        {text}
      </div>
      <p
        style={{ 
            ...specialBoxDescriptionStyle, 
            marginTop: '5px',
            fontSize: '13px', 
            color: '#AAAAAA', 
        }}
      >
        {description}
      </p>
    </div>
  );

  // ************ RESOURCES DROPDOWN CONTENT (Desktop) ************
  const resourcesContent = (
    <div
      style={{
        ...dropdownMenuBaseStyle,
        minWidth: '780px',
        maxWidth: '780px',
        ...(isResourcesOpen && showDropdownStyle),
      }}
      onMouseEnter={() => handleDropdownMouseEnter('resources')}
      onMouseLeave={handleResourcesMouseLeave}
    >
      
      {/* ===== COLUMN 1: 24/7 SUPPORT (Help Center, Forum, Webinars) ===== */}
      <div style={{ ...dropdownColumnStyle, padding: '0 20px' }}>
        <div style={dropdownColumnTitleStyle}>24/7 SUPPORT</div>

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
       

      {/* ===== COLUMN 2: Blog, Hire an Expert ===== */}
      <div style={{ ...dropdownColumnStyle, padding: '0 20px', borderRight: '1px solid #333' }}>
        <div style={dropdownColumnTitleStyle}>&nbsp;</div> 

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

      {/* ===== COLUMN 3: GET INSPIRED (Special Text Link) ===== */}
      <div style={{ ...specialBoxContainerStyle, paddingLeft: '30px', borderLeft: '2px solid #333' }}>
        <div style={dropdownColumnTitleStyle}>GET INSPIRED</div>
        
        {/* Made with Devknit Link */}
        <div 
            style={{
                ...specialBoxStyle,
                marginTop: '30px',
                padding: '0', 
                backgroundColor: 'transparent'
            }}
            onClick={() => handleNavigation('')} 
        >
            <div 
                style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    transition: 'color 0.2s ease',
                    cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#AAAAAA')}
                onMouseLeave={(e) => (e.target.style.color = '#FFFFFF')}
            >
                Made with Devknit
            </div>
            <div 
                style={{
                    fontSize: '13px', 
                    color: '#AAAAAA', 
                    lineHeight: '1.4',
                    marginTop: '5px'
                }}
            >
                A collection of inspirational websites by real Devknit users.
            </div>
        </div>

      </div>
    </div>
  );


  // --- MOBILE MENU CONTENT (Fixed B2B and View All Features) ---

  // Services Links for Mobile (Combined all links)
  const mobileServicesContent = [
    { title: 'DEVELOPMENT', items: developmentServices.map(s => ({ text: s.title, path: `/services/${s.slug}` })) },
    { title: 'MAINTENANCE', items: maintenanceServices.map(s => ({ text: s.title, path: `/services/${s.slug}` })) },
    { title: 'SECURITY', items: staticSecurityServices.map(s => ({ text: s.text, path: s.path })) },
    { title: 'BUSINESS TOOLS', items: staticBusinessTools.map(s => ({ text: s.text, path: s.path })) },
  ];

  // Resources Links for Mobile (Updated with special types for GET INSPIRED)
  const mobileResourcesLinks = [
    { type: 'link', text: 'Help Center', path: '' },
    { type: 'link', text: 'Forum', path: '' },
    { type: 'link', text: 'Webinars', path: '' },
    { type: 'link', text: 'Blog', path: '' },
    { type: 'link', text: 'Hire an Expert', path: '' }, 
    
    // START OF GET INSPIRED Section
    { type: 'title', text: 'GET INSPIRED' }, 
    { 
        type: 'box', 
        title: 'Made with Devknit', 
        description: 'A collection of inspirational websites by real Devknit users.', 
        path: '/made-with-devknit' 
    }, 
    // END OF GET INSPIRED Section
    
    { type: 'link', text: 'Contact us', path: '/ContactUs' }, 
  ];
  
  // Custom Mobile Menu Icon (to match the image)
  const renderMobileMenuIcon = (isOpen) => (
    <span className={`mobile-menu-item-icon ${isOpen ? 'open' : ''}`}>
       {isOpen ? '∧' : '∨'}
    </span>
  );

  const mobileMenuContent = isMobile && (
    <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
      
      {/* --- SERVICES MENU (All Submenus inside this one collapsible section) --- */}
      <div 
        className="mobile-menu-item"
        onClick={() => {
          setIsServicesOpen(!isServicesOpen);
          setIsResourcesOpen(false); // Close Resources when opening Services
        }}
      >
        Services 
        {renderMobileMenuIcon(isServicesOpen)}
      </div>
      
      <div 
        className="mobile-submenu"
        style={{
          maxHeight: isServicesOpen ? '1200px' : '0', // Increased MaxHeight for all content
          padding: isServicesOpen ? '10px 0' : '0',
          borderBottom: isServicesOpen ? '1px solid #333' : 'none', 
          marginBottom: isServicesOpen ? '5px' : '0', 
        }}
      >
        {/* --- DEVELOPMENT, MAINTENANCE, SECURITY, BUSINESS TOOLS --- */}
        {mobileServicesContent.map((group, groupIndex) => (
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

        {/* --- View All Features Link --- */}
        <div 
            className="mobile-submenu-link view-all-features"
            onClick={() => handleNavigation('/projects')}
        >
            View All Features
        </div>

        {/* --- FOR B2B / Circle Box --- */}
        <div className="mobile-b2b-section"> 
            <div className="mobile-submenu-title">FOR B2B</div>
            <div
                className="mobile-circle-box"
                onClick={() => handleNavigation('/circle-program')}
            >
                <div className="mobile-circle-title">Circle</div>
                <div className="mobile-circle-description">
                    The partner program for freelancers and agencies
                </div>
            </div>
        </div>
      </div>


   {/* --- RESOURCES MENU (Separate Collapsible Section) --- */}
      <div 
        className="mobile-menu-item"
        style={{ 
             borderTop: '1px solid #333' // Always show top border for Resources
        }}
        onClick={() => {
          setIsResourcesOpen(!isResourcesOpen);
          setIsServicesOpen(false); // Close Services when opening Resources
        }}
      >
        Resources 
        {renderMobileMenuIcon(isResourcesOpen)}
      </div>
      
      <div 
        className="mobile-submenu"
        style={{
          maxHeight: isResourcesOpen ? '800px' : '0', // Increased MaxHeight
          padding: isResourcesOpen ? '10px 0' : '0',
          borderBottom: isResourcesOpen ? '1px solid #333' : 'none'
        }}
      >
          {mobileResourcesLinks.map((item, index) => {
            // Using index as key since the list is static
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
              // GET INSPIRED Heading
              return (
                <div key={index} className="mobile-submenu-title mobile-get-inspired-title">
                  {item.text}
                </div>
              );
            } else if (item.type === 'box') {
              // Made with Devknit Box
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

      
      {/* --- START PROJECT BUTTON --- */}
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

  // --- Header Render ---

  return (
    <header 
      style={headerStyle}
      className={isMobile ? 'header-mobile' : ''} 
    >
      <div 
        style={logoContainerStyle} 
        onClick={() => handleNavigation('/')}
      >
        <HeaderLogo src={HeaderLogoImage} alt="DevAurora Logo" size={logoSize} />
      </div>
      
      {/* Desktop Menu */}
      <div style={centerMenuStyle}>
        <div
          style={menuItemStyle}
          onMouseEnter={handleServicesMouseEnter}
          onMouseLeave={handleServicesMouseLeave}
        >
          Services
          {servicesContent}
        </div>
        <div
          style={menuItemStyle}
          onMouseEnter={handleResourcesMouseEnter}
          onMouseLeave={handleResourcesMouseLeave}
        >
          Resources
          {resourcesContent}
        </div>
      </div>
      
      {/* Desktop Utility */}
      <div style={utilityContainerStyle}>
        <div id="google_translate_element"></div>
        <button 
          style={buttonStyle} 
          onClick={() => handleNavigation('/ContactUs')}
        >
          START PROJECT
        </button>
      </div>
      
      {/* Mobile Menu Button */}
      <button 
        style={mobileMenuButtonStyle}
        onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            // Reset collapsible states when closing the main menu
            if(isMobileMenuOpen) {
                 setIsServicesOpen(false);
                 setIsResourcesOpen(false);
            }
        }}
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>
      
      {/* Mobile Menu Content */}
      {mobileMenuContent}
    </header>
  );
};

// --- 2. Footer Component (Original Code - UNTOUCHED) ---

const Footer = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); 
  
  // State to manage the open/closed state of mobile footer sections
  const [openSection, setOpenSection] = useState({});

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}services/`);
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          console.error('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  // Handle navigation - FIXED: Scroll to top when navigating
  const handleNavigation = (path) => {
    navigate(path);
    // Scroll to top immediately when navigating
    window.scrollTo(0, 0);
  };

  // Handle service navigation
  const handleServiceNavigation = (slug) => {
    navigate(`/services/${slug}`);
    // Scroll to top immediately when navigating
    window.scrollTo(0, 0);
  };

  // Check screen size for mobile responsiveness
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Agar desktop par wapis jayein, toh accordion state reset kar dein
      if (window.innerWidth > 768) {
        setOpenSection({});
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Accordion Toggle Function
  const toggleSection = (title) => {
    setOpenSection(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };


  // Logo sizes
  const footerLogoSize = 220;

  // --- DYNAMIC SERVICE GROUPING LOGIC FOR FOOTER ---
  const distributeServices = () => {
    const allServices = services;
    
    // 1. PRODUCTS: First 7 services (Assuming the API returns at least 7)
    const products = allServices.slice(0, 7);
    
    // 2. SOLUTIONS: Remaining services
    const solutions = allServices.slice(7);
    
    return { products, solutions };
  };

  const { products, solutions } = distributeServices();

  // --- STATIC DATA ---
  
  const staticSecurity = [
    { text: 'Web Audit', path: '' },
    { text: 'SSL & Encryption', path: '' },
    { text: 'Code Review', path: '' },
    { text: 'Vulnerability Assessment', path: '' },
  ];
  
  const staticBusinessTools = [
    { text: 'Technical SEO', path: '' },
    { text: 'Optimization', path: '' },
    { text: 'Content Strategy', path: '' },
    { text: 'Technical Support', path: '' },
  ];

  const staticPrograms = [
    { text: 'Circle', path: '' },
    { text: 'Affiliates', path: '' },
  ];
  
  const staticSupport = [
    { text: 'Help Center', path: '' },
    { text: 'Forum', path: '' },
    { text: 'Webinars', path: '' },
    { text: 'Hire an Expert', path: '' },
    { text: 'Developer Blog', path: '' },
    { text: 'Developer Platform', path: '' },
    { text: 'System Status', path: '' },
  ];
  
  const staticResources = [
    { text: 'Extensions', path: '' },
    { text: 'Squarespace Blog', path: '' },
    { text: 'Free Tools', path: '' },
    { text: 'Business Name Generator', path: '' },
    { text: 'Logo Maker', path: '' },
  ];
  
  const staticCompany = [
    { text: 'About', path: '' },
    { text: 'Careers', path: '' },
    { text: 'Our History', path: '' },
    { text: 'Our Brand', path: '' },
    { text: 'Accessibility', path: '' },
    { text: 'Newsroom', path: '' },
    { text: 'Press & Media', path: '' },
    { text: 'Contact Us', path: '' },
  ];

  const socialLinks = [
    { text: 'Instagram', path: 'https://instagram.com/devknit' },
    { text: 'Youtube', path: 'https://youtube.com/devknit' },
    { text: 'LinkedIn', path: 'https://linkedin.com/company/devknit' },
    { text: 'Facebook', path: 'https://facebook.com/devknit' },
    { text: 'X', path: 'https://twitter.com/devknit' },
  ];
  
  // --- Footer Inline CSS Styles ---

  const footerStyle = {
    backgroundColor: '#000000',
    color: 'white',
    // NEW: Add borderTop only for Desktop View
    borderTop: isMobile ? 'none' : '1px solid #333',
    // NEW: Added gray line at the top for desktop
    padding: isMobile ? '50px 20px 10px 20px' : '50px 20px 10px 20px',
    fontSize: '13px',
    position: 'relative',
    top: '-35px',
  };
    
  const mainContentStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'flex-start', 
    alignItems: 'flex-start', 
    paddingBottom: '30px',
    width: isMobile ? '100%' : '200%', 
    // Set to 'none' for desktop to remove the horizontal line
    borderBottom: isMobile ? 'none' : 'none', 
    boxSizing: 'border-box',
  };

  const logoSectionStyle = { 
    // Desktop styles
    width: '200px', 
    flexShrink: 0,
    alignSelf: 'flex-start',
    marginRight: '140px',
    marginLeft: '20',
    paddingLeft: '-5%',
    marginTop: '-80px', 
    transform: 'translateY(-5px)', 
  };
  
  const logoContainerStyle = {
    // Desktop styles
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '0px',
    cursor: 'pointer',
    width: 'fit-content',
    marginLeft: '20',
  };

  const taglineStyle = {
    // Desktop styles
    fontSize: '30px', 
    fontWeight: 'normal',
    lineHeight: '0', 
    marginTop: '10px', 
    color: 'white',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    display: 'block', 
    width: '100%',
    marginLeft: '13px', 
    paddingLeft: '0',
    marginTop: '-30px', 
    transform: 'translateY(-5px)', 
  };

  const linksContainerStyle = {
    // Desktop styles
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    gap: '15px', 
    marginRight: '100px', 
    marginLeft: '210px', 
    flexWrap: 'wrap', 
    justifyContent: 'flex-start', 
    gap: '180px',
    // Removed horizontal line above copyright section for desktop
    borderBottom: 'none', 
    paddingBottom: '40px',
    maxWidth: 'calc(100% - 300px)', 
    width: '100%', 
    boxSizing: 'border-box', 
  };
  
  const columnWrapperStyle = {
      // Desktop styles
      display: 'flex',
      flexDirection: 'column',
      gap: '30px', 
      width: 'auto',
  };
  
  const columnStyle = {
    // Desktop styles
    lineHeight: '1.8', 
    flex: '0 0 auto',
    marginRight: '0px' 
  };
  
  const columnTitleStyle = {
    // Desktop styles
    fontSize: '14px', 
    fontWeight: 'bold',
    marginBottom: '20px', 
    color: 'white', 
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const linkStyle = {
    // Desktop styles
    color: '#CCCCCC', 
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'block',
    fontSize: '13px',
    padding: '6px 0', 
    transition: 'color 0.2s ease',
  };

  const copyrightSectionStyle = {
    // DESKTOP/BASE STYLES (now shared with mobile)
    display: 'flex',
    flexDirection: 'row',
    // **********************************************
    // NEW CHANGE APPLIED: 'flex-end' to push all items to the far right in desktop
    // **********************************************
    justifyContent: isMobile ? 'space-between' : 'flex-end', 
    alignItems: 'center',
    paddingTop: isMobile ? '0px' : '20px', // Adjusted padding for desktop
    fontSize: '11px',
    color: '#AAAAAA',
    marginTop: isMobile ? '-20px' : '20px', // Adjusted margin for desktop separation
    transform: 'translateY(-5px)',
    // Add border above this section for desktop
    borderTop: isMobile ? 'none' : '2px solid #333',
    paddingBottom: '-10%px', 
  };

  const bottomLinksStyle = {
    // DESKTOP/BASE STYLES (now shared with mobile)
    display: 'flex',
    gap: '40px', 
    flexWrap: 'wrap',
    // DESKTOP: Order 2. Order needs to be set relative to other flex items
    order: isMobile ? 1 : 2, 
    marginLeft: isMobile ? 'auto' : '0', 
    paddingLeft: isMobile ? '60%' : '0',
    marginRight: isMobile ? 'auto' : '0',
    // NEW: Text color for desktop links should be grayish (#AAAAAA)
    color: '#AAAAAA',
  };

  const copyrightTextStyle = {
    // DESKTOP/BASE STYLES (now shared with mobile)
    // DESKTOP: Order 3
    order: isMobile ? 2 : 3,
    fontSize: '11px', 
    whiteSpace: 'nowrap',
    // NEW: Copyright text color should be white for desktop
    color: isMobile ? '#AAAAAA' : '#FFFFFF', 
    // Ensure space between links and copyright for desktop
    marginLeft: '30px', 
  };

  // NEW: Language Selector Styles for Desktop Left Side
  const languageSelectorContainerStyle = {
    display: 'flex',
    alignItems: 'left',
    // DESKTOP: Order 1
    order: isMobile ? '0' : '1', 
    // Hide this if in mobile mode for the primary desktop section
    // When using 'flex-end' on parent, this will be pushed to the right along with others.
    display: isMobile ? 'none' : 'flex',
    marginLeft: '100px',
  }

  const languageDropdownStyle = {
      // Inline styles for the dropdown to match the dark theme and font
      backgroundColor: 'transparent',
      border: 'none',
      color: '#AAAAAA', // Half-white
      fontSize: '11px',
      padding: '5px',
      cursor: 'pointer',
      appearance: 'none', // Remove default dropdown arrow
      outline: 'none',
      marginLeft: '67px',
      // NOTE: The icon will need to be added using a custom element or CSS class outside of inline styles
  }

  // Helper function to render links for both desktop and mobile
  const renderLinks = (title, links, isApi = false) => {
    const isOpen = openSection[title];

    if (isMobile) {
      return (
        // Mobile Accordion Structure (NO CHANGE)
        <div key={title} className="footer-accordion-item">
          {/* Accordion Title (Clickable) */}
          <div 
            className={`footer-accordion-title ${isOpen ? 'open' : ''}`}
            onClick={() => toggleSection(title)}
          >
            {title}
            <span className="footer-accordion-icon">{isOpen ? '∧' : '∨'}</span>
          </div>
          
          {/* Accordion Content (Links) */}
          <div 
            className="footer-accordion-content"
            style={{ 
              maxHeight: isOpen ? '500px' : '0' // Max height for transition
            }}
          >
            {links.map((item) => (
              <div key={isApi ? item.id : item.text}>
                <a 
                  href="#" 
                  className="footer-accordion-link"
                  onClick={(e) => {
                    e.preventDefault();
                    if (isApi) {
                      handleServiceNavigation(item.slug);
                    } else {
                      handleNavigation(item.path);
                    }
                  }}
                >
                  {isApi ? item.title : item.text}
                </a>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Desktop Column Structure (NO CHANGE)
    return (
      <div key={title}>
        <div style={columnTitleStyle}>{title}</div>
        {links.map((item) => (
          <div key={isApi ? item.id : item.text}>
            <a 
              href="#" 
              style={linkStyle}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = '#CCCCCC'}
              onClick={(e) => {
                e.preventDefault();
                if (isApi) {
                  handleServiceNavigation(item.slug);
                } else {
                  handleNavigation(item.path);
                }
              }}
            >
              {isApi ? item.title : item.text}
            </a>
          </div>
        ))}
      </div>
    );
  };

  // --- Footer Render ---

  return (
    <footer style={footerStyle} className={isMobile ? 'footer-mobile' : ''}>
      
      {/* NEW: Gray line at the top for desktop only */}
      {!isMobile && (
        <div style={{
          height: '1px',
          backgroundColor: '#333',
          width: '100%',
          marginBottom: '50px'
        }}></div>
      )}
      
      {/* Main Content Area */}
      <div style={mainContentStyle} className={isMobile ? 'footer-main-mobile' : ''}>
        
        {/* Left Section (Logo and Tagline) - Desktop Only */}
        {!isMobile && (
          <div style={logoSectionStyle}>
            <div 
              style={logoContainerStyle}
              onClick={() => handleNavigation('/')}
            >
              <FooterLogo 
                src={HeaderLogoImage} 
                alt="Devknit Logo" 
                size={footerLogoSize}
              />
            </div>
            <div style={taglineStyle}>
              A website makes it real
            </div>
          </div>
        )}

        {/* Right Section (Link Columns / Accordions) */}
        {isMobile ? (
          // Mobile Accordions
          <div className="footer-accordion-container">
            {renderLinks('Products', products, true)}
            {renderLinks('Solutions', solutions, true)}
            {/* {renderLinks('From Squarespace', staticFromSquarespace, false)} */}
            {renderLinks('Security', staticSecurity, false)}
            {renderLinks('Business Tools', staticBusinessTools, false)}
            {renderLinks('Programs', staticPrograms, false)}
            {renderLinks('Support', staticSupport, false)}
            {renderLinks('Resources', staticResources, false)}
            {renderLinks('Company', staticCompany, false)}
            {renderLinks('Follow', socialLinks, false)}
          </div>
        ) : (
          // Desktop Link Columns (NO CHANGE)
          <div style={linksContainerStyle}>
             {/* Column 1 - PRODUCTS (API First 7) */}
             <div style={columnStyle}>
               {renderLinks('Products', products, true)}
             </div>
 
             {/* Column 2 - SOLUTIONS, SECURITY, BUSINESS TOOLS (Grouped Column) */}
             <div style={columnWrapperStyle}>
                {/* Solutions Section (API Remaining) */}
                {renderLinks('Solutions', solutions, true)}
                
                {/* Security Section */}
                {renderLinks('Security', staticSecurity, false)}
                
                {/* Business Tools Section */}
                {renderLinks('Business Tools', staticBusinessTools, false)}
             </div>
             
             {/* Column 3 - PROGRAMS, SUPPORT, RESOURCES (Grouped Column) */}
             <div style={columnWrapperStyle}>
                {/* Programs Section */}
                {renderLinks('Programs', staticPrograms, false)}
 
                {/* Support Section */}
                {renderLinks('Support', staticSupport, false)}
 
                 {renderLinks('Resources', staticResources, false)}
             </div>
             
             {/* Column 4 - COMPANY, FOLLOW (Grouped Column) */}
             <div style={columnWrapperStyle}>
                {/* Company Section */}
                {renderLinks('Company', staticCompany, false)}
                
                {/* Follow Section */}
               {renderLinks('Follow', socialLinks, false)}
             </div>
          </div>
        )}
      </div>

      {/* Mobile Logo Section (Footer Accordions ke baad dikhega) */}
      {isMobile && (
        <div className="footer-logo-mobile-section">
          <div 
            className="footer-logo-container-mobile"
            onClick={() => handleNavigation('/')}
          >
            <FooterLogo 
              src={HeaderLogoImage} 
              alt="Devknit Logo" 
              size={footerLogoSize * 1} 
            />
             {/* <span className="footer-logo-text-mobile">Devknit</span> */}
          </div>
          <div className="footer-tagline-mobile">
            A website makes it real
          </div>
          
          {/* Language Selector (Jaisa image_30be5e.png mein hai) */}
                  </div>
      )}
      

      {/* ==================================================================
        UPDATED: Bottom Section (Copyright, Bottom Links) 
        Now pushed to the right using 'flex-end' on copyrightSectionStyle.
        ==================================================================
      */}
      <div style={copyrightSectionStyle} className={isMobile ? 'copyright-section-mobile' : 'copyright-section-desktop'}>
          
          {/* LANGUAGE SELECTOR (DESKTOP LEFT SIDE) */}
          {!isMobile && (
              <div style={languageSelectorContainerStyle}>
                  {/* Icon Placeholder (Using a simple Unicode character or external icon) */}
                  {/* <span style={{ fontSize: '14px', color: '#AAAAAA', marginRight: '1000px' }}>🌐</span>  */}
                  <select style={languageDropdownStyle}>
                      {/* <option value="en">English</option> */}
                      {/* <option value="ur">Urdu</option> */}
                      {/* <option value="es">Spanish</option> */}
                  </select>
              </div>
          )}

          {/* Bottom Links (Desktop and Mobile) */}
          <div style={bottomLinksStyle} className={isMobile ? 'bottom-links-mobile' : 'bottom-links-desktop'}>
            <a 
              href="#" 
              style={{...linkStyle, color: '#AAAAAA'}} // Force half-white/grayish
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = '#AAAAAA'}
              onClick={(e) => { e.preventDefault(); handleNavigation('/terms'); }}
            >
              Terms
            </a>
            <a 
              href="#" 
              style={{...linkStyle, color: '#AAAAAA'}} // Force half-white/grayish
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = '#AAAAAA'}
              onClick={(e) => { e.preventDefault(); handleNavigation('/privacy'); }}
            >
              Privacy
            </a>
            <a 
              href="#" 
              style={{...linkStyle, color: '#AAAAAA'}} // Force half-white/grayish
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = '#AAAAAA'}
              onClick={(e) => { e.preventDefault(); handleNavigation('/security-measures'); }}
            >
              Security Measures
            </a>
            <a 
              href="#" 
              style={{...linkStyle, color: '#AAAAAA'}} // Force half-white/grayish
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = '#AAAAAA'}
              onClick={(e) => { e.preventDefault(); handleNavigation('/sitemap'); }}
            >
              Sitemap
            </a>
          </div>
          
          {/* Devknit Copyright Text (Desktop and Mobile) */}
          <div style={copyrightTextStyle} className={'copyright-text-desktop'}>
            © 2025 Devknit, Inc.
          </div>
          
          
      </div>

       {/* "From TIME" line - Rendered below copyright section in BOTH views */}
       <div className={isMobile ? 'extra-copyright-mobile' : 'extra-copyright-desktop'}>
          <div style={{fontSize: '11px', color: '#AAAAAA', marginTop: isMobile ? '0' : '5px', textAlign: isMobile ? 'left' : 'right', paddingBottom: '20px'}}>
              From TIME. © 2025 TIME USA LLC. All rights reserved Used under license.

          </div>
      </div>
    </footer>
  );
};

// --- 3. Layout Component (MODIFIED FOR WHITE GAP FIX) ---

const Layout = ({ children }) => {
    return (
        // Added backgroundColor: '#000000' to the wrapper div to ensure the entire background is black
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#000000' }}>
            <Header />
            
            <main style={{ 
                flexGrow: 1, 
                // Changed background color to transparent/black if needed, but it should contain children
                backgroundColor: 'transparent', // Changed to transparent so body background (now black) shows through
                color: 'white',
                marginTop: '65px' 
            }}>
                {children}
            </main>
            
            <Footer />
        </div>
    );
};

export default Layout;