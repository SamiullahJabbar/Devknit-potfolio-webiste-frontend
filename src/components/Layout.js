import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../api/baseurl';

// Import your logos - update these paths according to your project structure
import HeaderLogoImage from '../images/2.svg';
// import TranslateWidget from "./TranslateWidget";

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
  const logoSize = 90;
  // const footerLogoSize = 150; // Not used in Header

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('Fetching services from:', `${API_BASE_URL}services/`);
        const response = await fetch(`${API_BASE_URL}services/`);
        if (response.ok) {
          const data = await response.json();
          console.log('Services fetched:', data);
          setServices(data);
        } else {
          console.error('Failed to fetch services, status:', response.status);
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
      // Adjusted mobile breakpoint to 992px for a typical large menu/dropdown
      setIsMobile(window.innerWidth <= 992); 
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      // Clear timeouts on unmount
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
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Dropdown handlers with delay
  const handleServicesMouseEnter = () => {
    if (isMobile) return; // Disable hover on mobile
    clearTimeout(servicesTimeoutRef.current);
    setIsServicesOpen(true);
    setIsResourcesOpen(false);
  };

  const handleServicesMouseLeave = () => {
    if (isMobile) return; // Disable hover on mobile
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 300);
  };

  const handleResourcesMouseEnter = () => {
    if (isMobile) return; // Disable hover on mobile
    clearTimeout(resourcesTimeoutRef.current);
    setIsResourcesOpen(true);
    setIsServicesOpen(false);
  };

  const handleResourcesMouseLeave = () => {
    if (isMobile) return; // Disable hover on mobile
    resourcesTimeoutRef.current = setTimeout(() => {
      setIsResourcesOpen(false);
    }, 300);
  };

  // Cancel timeouts when entering dropdown content
  const handleDropdownMouseEnter = (type) => {
    if (isMobile) return;
    if (type === 'services') clearTimeout(servicesTimeoutRef.current);
    if (type === 'resources') clearTimeout(resourcesTimeoutRef.current);
  };

  // Group services for dropdown display - FIXED VERSION
  // Show ALL services in mobile view without limits
  const getServicesByCategory = (startIndex, count) => {
    // Return all services if mobile or if the slice exceeds total services
    if (isMobile) return services; 
    return services.slice(startIndex, startIndex + count);
  };

  // Get services for different categories
  // Note: These will only be used for desktop view since isMobile check is now in getServicesByCategory
  const websiteServices = getServicesByCategory(0, 8);
  const commerceServices = getServicesByCategory(8, 8);
  const marketingServices = getServicesByCategory(16, 4);
  const businessToolsServices = getServicesByCategory(20, 3);
  const professionalServices = getServicesByCategory(23, 2);

  // --- Header Inline CSS Styles (Updated for Responsiveness) ---

  const headerStyle = {
    backgroundColor: '#000000',
    color: 'white',
    padding: isMobile ? '0 20px' : '0 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '65px',
    borderBottom: '1px solid #333',
    position: 'relative',
    zIndex: 1000,
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
    // Show on Desktop/Tablet, Hide on Mobile
    display: isMobile ? 'none' : 'flex', 
    alignItems: 'center', 
  };
  
  const utilityContainerStyle = { 
    // Show on Desktop/Tablet, Hide on Mobile
    display: isMobile ? 'none' : 'flex', 
    alignItems: 'center', 
    flexShrink: 0, 
  };
  
  const menuItemStyle = { 
    position: 'relative', 
    margin: '0 15px', // Reduced margin for smaller screens
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
    padding: '10px 15px', // Reduced padding
    marginLeft: '15px', // Reduced margin
    fontSize: '13px', // Reduced font size
    fontWeight: 'bold', 
    cursor: 'pointer', 
    borderRadius: '4px', 
    letterSpacing: '1px', 
    textTransform: 'uppercase',
  };

  const mobileMenuButtonStyle = {
    // Show only on Mobile
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
    // Keep it centered for large screen, but prevent it from taking up too much width
    top: '55px', 
    left: '50%', 
    transform: 'translateX(-50%)', 
    backgroundColor: '#000000', 
    border: '1px solid #333', 
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6)', 
    zIndex: 100, 
    // Use fixed max-width for desktop
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
    borderRight: '1px solid #333', // Desktop only border
  };
  
  const lastColumnStyle = { 
    ...dropdownColumnStyle, 
    borderRight: 'none', 
  };
  
  const dropdownColumnTitleStyle = { 
    fontSize: '14px', 
    fontWeight: 'bold', 
    color: '#CCCCCC', 
    marginBottom: '15px', 
    textTransform: 'uppercase', 
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
    borderLeft: '1px solid #333',
  };
  
  const specialBoxStyle = { 
    backgroundColor: '#111111', 
    padding: '15px', 
    borderRadius: '4px', 
    marginBottom: '10px', 
    width: '200px', 
    cursor: 'pointer', 
    transition: 'background-color 0.2s ease',
  };
  
  const specialBoxTitleStyle = { 
    fontSize: '14px', 
    fontWeight: 'bold', 
    marginBottom: '5px', 
  };
  
  const specialBoxDescriptionStyle = { 
    fontSize: '12px', 
    color: '#CCCCCC', 
    lineHeight: '1.4', 
  };

  // ************ Mobile Menu Styles ************

  const mobileMenuStyle = {
    position: 'fixed',
    top: '65px',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: 999,
    padding: '20px',
    overflowY: 'auto',
    transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease',
  };

  const mobileMenuItemStyle = {
    padding: '15px 0',
    borderBottom: '1px solid #333',
    fontSize: '16px',
    cursor: 'pointer',
  };

  const mobileSubmenuStyle = {
    paddingLeft: '10px',
    backgroundColor: '#111111',
    margin: '10px 0',
    borderRadius: '4px',
    maxHeight: '400px', // Fixed height for scrolling
    overflowY: 'auto', // Enable scrolling
  };

  const mobileSubmenuItemStyle = {
    padding: '12px 0',
    borderBottom: '1px solid #333',
    fontSize: '14px',
    cursor: 'pointer',
  };
  
  const mobileSubmenuLastItemStyle = {
    padding: '12px 0',
    borderBottom: 'none',
    fontSize: '14px',
    cursor: 'pointer',
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

  // --- Header Dropdown Content with API data (Desktop Only) ---

  const servicesContent = !isMobile && (
    <div 
      style={{ ...dropdownMenuBaseStyle, ...(isServicesOpen && showDropdownStyle) }}
      onMouseEnter={() => handleDropdownMouseEnter('services')}
      onMouseLeave={handleServicesMouseLeave}
    >
      <div style={dropdownColumnStyle}>
        <div style={dropdownColumnTitleStyle}>WEBSITE</div>
        {websiteServices.length > 0 ? (
          websiteServices.map((service) => (
            <div 
              key={service.id} 
              style={dropdownItemStyle}
              onMouseEnter={(e) => e.target.style.color = '#CCCCCC'}
              onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
              onClick={() => handleServiceNavigation(service.slug)}
            >
              {service.title}
            </div>
          ))
        ) : (
          <div style={dropdownItemStyle}>No website services available</div>
        )}
        <div 
          style={dropdownItemStyle}
          onMouseEnter={(e) => e.target.style.color = '#CCCCCC'}
          onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
          onClick={() => handleNavigation('/features')}
        >
          View All Features
        </div>
      </div>
      <div style={dropdownColumnStyle}>
        <div style={dropdownColumnTitleStyle}>COMMERCE</div>
        {commerceServices.length > 0 ? (
          commerceServices.map((service) => (
            <div 
              key={service.id} 
              style={dropdownItemStyle}
              onMouseEnter={(e) => e.target.style.color = '#CCCCCC'}
              onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
              onClick={() => handleServiceNavigation(service.slug)}
            >
              {service.title}
            </div>
          ))
        ) : (
          <div style={dropdownItemStyle}>No commerce services available</div>
        )}
      </div>
      <div style={dropdownColumnStyle}>
        <div style={dropdownColumnTitleStyle}>MARKETING</div>
        {marketingServices.length > 0 ? (
          marketingServices.map((service) => (
            <div 
              key={service.id} 
              style={dropdownItemStyle}
              onMouseEnter={(e) => e.target.style.color = '#CCCCCC'}
              onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
              onClick={() => handleServiceNavigation(service.slug)}
            >
              {service.title}
            </div>
          ))
        ) : (
          <div style={dropdownItemStyle}>No marketing services available</div>
        )}
        <div style={{ marginTop: '20px' }}>
          <div style={dropdownColumnTitleStyle}>BUSINESS TOOLS</div>
          {businessToolsServices.length > 0 ? (
            businessToolsServices.map((service) => (
              <div 
                key={service.id} 
                style={dropdownItemStyle}
                onMouseEnter={(e) => e.target.style.color = '#CCCCCC'}
                onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
                onClick={() => handleServiceNavigation(service.slug)}
              >
                {service.title}
              </div>
            ))
          ) : (
            <div style={dropdownItemStyle}>No business tools available</div>
          )}
        </div>
      </div>
      <div style={specialBoxContainerStyle}>
        <div style={dropdownColumnTitleStyle}>FOR PROFESSIONALS</div>
        {professionalServices.length > 0 ? (
          professionalServices.map((service) => (
            <div 
              key={service.id}
              style={specialBoxStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#222222'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#111111'}
              onClick={() => handleServiceNavigation(service.slug)}
            >
              <div style={specialBoxTitleStyle}>{service.title}</div>
              <div style={specialBoxDescriptionStyle}>
                {service.short_description || 'Powerful solutions for professionals'}
              </div>
            </div>
          ))
        ) : (
          <div style={specialBoxStyle}>
            <div style={specialBoxTitleStyle}>Professional Services</div>
            <div style={specialBoxDescriptionStyle}>
              Expert solutions for your business needs
            </div>
          </div>
        )}
      </div>
    </div>
  );
  const resourcesContent = (
  <div
    style={{
      ...dropdownMenuBaseStyle,
      minWidth: isMobile ? '90vw' : '700px',
      ...(isResourcesOpen && showDropdownStyle),
    }}
    onMouseEnter={() => handleDropdownMouseEnter('resources')}
    onMouseLeave={handleResourcesMouseLeave}
  >
    {/* ===== LEFT COLUMN: Help Center, Forum, Webinars ===== */}
    <div style={dropdownColumnStyle}>
      {/* Title updated to match the image */}
      <div style={dropdownColumnTitleStyle}>24/7 SUPPORT</div> 

      {/* 1. Help Center */}
      <div
        style={dropdownItemStyle}
        onMouseEnter={(e) => (e.target.style.color = '#CCCCCC')}
        onMouseLeave={(e) => (e.target.style.color = '#FFFFFF')}
        onClick={() => handleNavigation('')}
      >
        Help Center
      </div>
      {/* Description added */}
      <p style={specialBoxDescriptionStyle}>In-depth guides and videos about the platform, our services, and how to get started.</p>
      

      {/* 2. Forum */}
      <div
        style={{ ...dropdownItemStyle, marginTop: '20px' }} /* Margin added for spacing */
        onMouseEnter={(e) => (e.target.style.color = '#CCCCCC')}
        onMouseLeave={(e) => (e.target.style.color = '#FFFFFF')}
        onClick={() => handleNavigation('')}
      >
        Forum
      </div>
      {/* Description added */}
      <p style={specialBoxDescriptionStyle}>An online community for Squarespace users to discuss best practices and seek advice.</p>
      

      {/* 3. Webinars */}
      <div
        style={{ ...dropdownItemStyle, marginTop: '20px' }} /* Margin added for spacing */
        onMouseEnter={(e) => (e.target.style.color = '#CCCCCC')}
        onMouseLeave={(e) => (e.target.style.color = '#FFFFFF')}
        onClick={() => handleNavigation('/')}
      >
        Webinars
      </div>
      {/* Description added */}
      <p style={specialBoxDescriptionStyle}>Free online sessions where you'll learn the basics and refine your Squarespace skills.</p>
      
    </div>
     

    {/* ===== RIGHT COLUMN: Blog, Hire an Expert (Contact Us removed to match image) ===== */}
    <div style={dropdownColumnStyle}>
      <div style={dropdownColumnTitleStyle}>&nbsp;</div> {/* Keep empty title for alignment */}

      {/* 1. Blog */}
      <div style={{ marginBottom: '30px' }}>
        {/* Style changed to dropdownItemStyle for consistency in rendering as a link/title */}
        <div
          style={dropdownItemStyle}
          onMouseEnter={(e) => (e.target.style.color = '#CCCCCC')}
          onMouseLeave={(e) => (e.target.style.color = '#FFFFFF')}
          onClick={() => handleNavigation('/articles')}
        >
          Blog
        </div>
        <p style={specialBoxDescriptionStyle}>
          Stories and solutions for the modern entrepreneur.
        </p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        {/* Style changed to dropdownItemStyle for consistency in rendering as a link/title */}
        <div
          style={dropdownItemStyle}
          onMouseEnter={(e) => (e.target.style.color = '#CCCCCC')}
          onMouseLeave={(e) => (e.target.style.color = '#FFFFFF')}
          onClick={() => handleNavigation('/ContactUs')}
        >
          Contact us
        </div>
        <p style={specialBoxDescriptionStyle}>
          Let's connect and explore opportunities to collaborate on projects, events, or mutual growth strategies.
        </p>
      </div>

      {/* 2. Hire an Expert (Contact us removed to match image) */}
      <div style={{ marginBottom: '20px' }}>
        <div
          style={dropdownItemStyle}
          onMouseEnter={(e) => (e.target.style.color = '#CCCCCC')}
          onMouseLeave={(e) => (e.target.style.color = '#FFFFFF')}
          onClick={() => handleNavigation('')}
        >
          Hire an Expert
        </div>
        <p style={specialBoxDescriptionStyle}>
          Let us do the work of finding you the perfect Expert to help you stand out online.
        </p>
      </div>

      {/* Contact us section removed as it was not in the image */}
    </div>
  </div>
);
  

  // Mobile menu content - FIXED: Show ALL services with scrolling
  const mobileMenuContent = isMobile && (
    <div style={mobileMenuStyle}>
      <div 
        style={mobileMenuItemStyle}
        onClick={() => {
          setIsServicesOpen(!isServicesOpen);
          setIsResourcesOpen(false);
        }}
      >
        Services {isServicesOpen ? '−' : '+'}
      </div>
      {isServicesOpen && (
        <div style={mobileSubmenuStyle}>
          {services.length > 0 ? (
            services.map((service, index) => (
              <div 
                key={service.id}
                style={index === services.length - 1 ? mobileSubmenuLastItemStyle : mobileSubmenuItemStyle}
                onClick={() => handleServiceNavigation(service.slug)}
              >
                {service.title}
              </div>
            ))
          ) : (
            <div style={mobileSubmenuLastItemStyle}>No services available</div>
          )}
          <div 
            style={{...mobileSubmenuLastItemStyle, borderTop: '1px solid #333', marginTop: '5px'}}
            onClick={() => handleNavigation('/services')}
          >
            View All Services
          </div>
        </div>
      )}
      
      <div 
        style={mobileMenuItemStyle}
        onClick={() => {
          setIsResourcesOpen(!isResourcesOpen);
          setIsServicesOpen(false);
        }}
      >
        Resources {isResourcesOpen ? '−' : '+'}
      </div>
      {isResourcesOpen && (
        <div style={mobileSubmenuStyle}>
          {[
            { text: 'Help Center', path: '/help-center' },
            { text: 'Forum', path: '/forum' },
            { text: 'Blog', path: '/blog' },
            { text: 'Webinars', path: '/webinars' },
            { text: 'Hire an Expert', path: '/hire-expert' }
          ].map((item, index, array) => (
            <div 
              key={item.text}
              style={index === array.length - 1 ? mobileSubmenuLastItemStyle : mobileSubmenuItemStyle}
              onClick={() => handleNavigation(item.path)}
            >
              {item.text}
            </div>
          ))}
        </div>
      )}
      
      <div 
        style={{...mobileMenuItemStyle, borderBottom: 'none', marginTop: '20px'}}
        onClick={() => handleNavigation('/ContactUs')}
      >
       
        <button style={{...buttonStyle, marginLeft: '0', width: '100%'}}>
          START PROJECT
        </button>
      </div>
    </div>
  );

  // --- Header Render ---

  return (
    <header style={headerStyle}>
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
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>
      
      {/* Mobile Menu Content */}
      {mobileMenuContent}
    </header>
  );
};

// --- 2. Footer Component (Fixed with logo size control) ---

const Footer = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  // Adjusted mobile breakpoint to 768px (standard mobile/tablet distinction)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); 
  
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

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle service navigation
  const handleServiceNavigation = (slug) => {
    navigate(`/services/${slug}`);
  };

  // Check screen size for mobile responsiveness
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Logo sizes
  const footerLogoSize = 160;

  // Group services for footer display - FIXED: Show ALL services without limits
  const distributeServices = () => {
    const totalServices = services.length;
    
    if (totalServices === 0) return { products: [], services: [], security: [], businessTools: [] };
    
    // Distribute services evenly across 4 columns
    const cols = 4;
    const baseCount = Math.floor(totalServices / cols);
    let remainder = totalServices % cols;
    
    let index = 0;
    const result = { products: [], services: [], security: [], businessTools: [] };

    // Products
    let count = baseCount + (remainder-- > 0 ? 1 : 0);
    result.products = services.slice(index, index + count);
    index += count;

    // Services
    count = baseCount + (remainder-- > 0 ? 1 : 0);
    result.services = services.slice(index, index + count);
    index += count;

    // Security
    count = baseCount + (remainder-- > 0 ? 1 : 0);
    result.security = services.slice(index, index + count);
    index += count;

    // Business Tools (remaining services)
    result.businessTools = services.slice(index);

    return result;
  };

  const { products, services: servicesData, security, businessTools } = distributeServices();

  const socialLinks = [
    { text: 'Instagram', path: 'https://instagram.com', icon: '' },
    { text: 'YouTube', path: 'https://youtube.com', icon: '' },
    { text: 'LinkedIn', path: 'https://linkedin.com', icon: '' },
    { text: 'Facebook', path: 'https://facebook.com', icon: '' },
    { text: 'X', path: 'https://twitter.com', icon: '' },
  ];

  const policyLinks = [
    // { text: 'Terms of Service', path: '/terms' },
    // { text: 'Privacy Policy', path: '/privacy' },
    // { text: 'Cookie Policy', path: '/cookies' },
  ];

  // --- Footer Inline CSS Styles (Updated for Responsiveness) ---

  const footerStyle = {
    backgroundColor: '#000000',
    color: 'white',
    padding: isMobile ? '30px 20px 10px 20px' : '50px 80px 10px 80px',
    fontSize: '13px',
  };

  const mainContentStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid #333',
    paddingBottom: '40px',
  };

  const logoSectionStyle = {
    width: isMobile ? '100%' : '250px',
    flexShrink: 0,
    marginBottom: isMobile ? '30px' : '0',
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
    cursor: 'pointer',
  };

  const taglineStyle = {
    fontSize: isMobile ? '18px' : '24px', // Adjusted for mobile
    fontWeight: 'normal',
    lineHeight: '1.2',
    marginTop: '20px',
  };

  const linksContainerStyle = {
    display: 'flex',
    flexGrow: 1,
    // Use wrap on mobile to stack columns
    flexDirection: isMobile ? 'row' : 'row', 
    justifyContent: 'space-between',
    paddingLeft: isMobile ? '0' : '50px',
    flexWrap: 'wrap', // Added wrap to allow columns to stack
  };

  const columnStyle = {
    // Set width to 50% on mobile for a 2-column layout, auto on desktop
    width: isMobile ? '50%' : '180px', 
    lineHeight: '1.8',
    marginBottom: isMobile ? '25px' : '0',
    flex: isMobile ? '0 0 50%' : '0 0 auto',
    // Special handling for the last (Social & Policy) column on mobile to take full width
    '@media (max-width: 768px)': {
      ...(isMobile && { 
        // Force Social & Policy column to full width on mobile
        '&:last-child': { width: '100%', flex: '0 0 100%' }
      })
    }
  };

  const columnTitleStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#CCCCCC',
    textTransform: 'uppercase',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'block',
    padding: '2px 0',
    transition: 'color 0.2s ease',
  };

  const copyrightSectionStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'center',
    paddingTop: '20px',
    fontSize: '11px',
    color: '#AAAAAA',
    gap: isMobile ? '15px' : '0',
  };

  const bottomLinksStyle = {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    // Order changed to put bottom links above copyright text on mobile
    order: isMobile ? 1 : 1, 
  };

  const copyrightTextStyle = {
    order: isMobile ? 2 : 2,
  };

  const socialIconStyle = {
    marginRight: '8px',
    fontSize: '14px',
  };

  // Helper function to render service links
  const renderServiceLinks = (title, serviceArray) => (
    <div 
      style={columnStyle}
    >
      <div style={columnTitleStyle}>{title}</div>
      {serviceArray.length > 0 ? (
        serviceArray.map((service) => (
          <div key={service.id}>
            <a 
              style={linkStyle}
              onMouseEnter={(e) => e.target.style.color = '#CCCCCC'}
              onMouseLeave={(e) => e.target.style.color = 'white'}
              onClick={(e) => {
                e.preventDefault();
                handleServiceNavigation(service.slug);
              }}
            >
              {service.title}
            </a>
          </div>
        ))
      ) : (
        <div style={linkStyle}>No services available</div>
      )}
    </div>
  );

  // Helper function to render regular links
  const renderLinks = (title, links) => (
    <div 
      style={{
        // Custom style for the last column (Social & Policy)
        ...columnStyle,
        width: isMobile ? '100%' : '180px',
        flex: isMobile ? '0 0 100%' : '0 0 auto',
      }}
    >
      <div style={columnTitleStyle}>{title}</div>
      {links.map((link) => (
        <div key={link.text}>
          <a 
            href={link.path} 
            style={linkStyle}
            onMouseEnter={(e) => e.target.style.color = '#CCCCCC'}
            onMouseLeave={(e) => e.target.style.color = 'white'}
            onClick={(e) => {
              if (link.path.startsWith('/')) {
                e.preventDefault();
                handleNavigation(link.path);
              }
            }}
            target={link.path.startsWith('http') ? '_blank' : '_self'}
            rel={link.path.startsWith('http') ? 'noopener noreferrer' : ''}
          >
            {link.icon && <span style={socialIconStyle}>{link.icon}</span>}
            {link.text}
          </a>
        </div>
      ))}
    </div>
  );

  // --- Footer Render ---

  return (
    <footer style={footerStyle}>
      {/* Main Content Area */}
      <div style={mainContentStyle}>
        
        {/* Left Section (Logo and Tagline) */}
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

        {/* Right Section (Link Columns) */}
        <div style={linksContainerStyle}>
          
          {/* Column 1 - Products */}
          {renderServiceLinks('Products', products)}

          {/* Column 2 - Services */}
          {renderServiceLinks('Services', servicesData)}

          {/* Column 3 - Security */}
          {renderServiceLinks('Security', security)}

          {/* Column 4 - Business Tools */}
          {renderServiceLinks('Business Tools', businessTools)}

          {/* Column 5 - Social & Policy (Takes full width on mobile) */}
          <div style={{
              ...columnStyle,
              width: isMobile ? '100%' : '180px',
              flex: isMobile ? '0 0 100%' : '0 0 auto',
            }}
          >
            {renderLinks('Social', socialLinks)}
            <div style={{marginTop: '20px'}}>
              {/* {renderLinks('Policy', policyLinks)} */}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section (Copyright, Bottom Links) */}
      <div style={copyrightSectionStyle}>
        {/* Center: Bottom Links */}
        <div style={bottomLinksStyle}>
          <a 
            href="#" 
            style={linkStyle}
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/terms');
            }}
          >
            {/* Terms */}
          </a>
          <a 
            href="#" 
            style={linkStyle}
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/privacy');
            }}
          >
            {/* Privacy */}
          </a>
          <a 
            href="#" 
            style={linkStyle}
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/security-resources');
            }}
          >
            {/* Security Resources */}
          </a>
          <a 
            href="#" 
            style={linkStyle}
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/sitemap');
            }}
          >
            {/* Sitemap */}
          </a>
        </div>

        {/* Right: Copyright */}
        <div style={copyrightTextStyle}>
          © 2025 Devknit, Inc.
        </div>
      </div>
    </footer>
  );
};

// --- 3. Layout Component (To combine Header and Footer) ---

const Layout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            
            {/* Main content area */}
            <main style={{ flexGrow: 1, backgroundColor: '#282c34', color: 'white' }}>
                {children}
            </main>
            
            <Footer />
        </div>
    );
};

export default Layout;