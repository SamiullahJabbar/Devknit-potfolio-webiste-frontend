import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../api/baseurl'; 
import HeaderLogoImage from '../images/devknit.png';
import './Header.css';

// --- UPDATED: GOOGLE TRANSLATE INITIALIZATION FUNCTION ---
const INCLUDED_LANGUAGES = 'en,ru,uk,kk,uz,ky,tk';

function googleTranslateElementInit() {
  if (window.google && window.google.translate) {
    const desktopIdExists = document.getElementById('google_translate_element');
    const mobileIdExists = document.getElementById('google_translate_element_mobile');

    if (desktopIdExists) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en', 
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          includedLanguages: INCLUDED_LANGUAGES
        }, 'google_translate_element');
    }

    if (mobileIdExists) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en', 
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          includedLanguages: INCLUDED_LANGUAGES
        }, 'google_translate_element_mobile');
    }
  }
}

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
  const [categories, setCategories] = useState([]);
  const [categoryServices, setCategoryServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [displayCategories, setDisplayCategories] = useState([]); // Final display categories
  
  const servicesTimeoutRef = useRef(null);
  const resourcesTimeoutRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Fixed sequence for categories - word matching
  const CATEGORY_SEQUENCE = ['DEVELOPMENT', 'MAINTENANCE', 'SECURITY', 'BUSINESS TOOLS'];

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
        
        // Create a map of backend categories
        const categoriesMap = {};
        categoriesData.forEach(cat => {
          categoriesMap[cat.id] = cat;
        });
        
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
        
        // NOW: Determine which categories to display in which order
        // Step 1: Find categories that match our sequence
        const matchedCategories = [];
        const unmatchedCategories = [...categoriesData];
        
        CATEGORY_SEQUENCE.forEach(seqWord => {
          const categoryIndex = unmatchedCategories.findIndex(cat => {
            const catName = cat.name.toUpperCase();
            return catName.includes(seqWord) || seqWord.includes(catName);
          });
          
          if (categoryIndex !== -1) {
            matchedCategories.push(unmatchedCategories[categoryIndex]);
            unmatchedCategories.splice(categoryIndex, 1);
          }
        });
        
        // Step 2: Combine matched categories (in sequence order) with unmatched categories
        const finalDisplayCategories = [...matchedCategories];
        
        // Add remaining categories but ensure we don't exceed 4 columns total
        const remainingSlots = Math.max(0, 4 - matchedCategories.length);
        if (remainingSlots > 0) {
          // Take only as many categories as we have slots
          finalDisplayCategories.push(...unmatchedCategories.slice(0, remainingSlots));
        }
        
        setDisplayCategories(finalDisplayCategories);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories([]);
        setCategoryServices({});
        setDisplayCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndServices();
  }, []);

  // Get services for a category by ID
  const getServicesForCategory = (categoryId) => {
    return categoryServices[categoryId]?.services || [];
  };

  // Get category name for display (with fallback)
  const getCategoryDisplayName = (category, position) => {
    if (category) return category.name;
    
    // If no category found for this position, use default from sequence
    if (position < CATEGORY_SEQUENCE.length) {
      return CATEGORY_SEQUENCE[position];
    }
    
    return `Category ${position + 1}`;
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

  const renderDropdownLink = (service) => (
      <div 
          key={service.id} 
          className="dropdown-item-style"
          onMouseEnter={(e) => e.target.style.color = '#AAAAAA'}
          onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
          onClick={() => handleServiceNavigation(service.slug)}
      >
          {service.title}
      </div>
  );

  // --- SERVICES DROPDOWN CONTENT (Desktop) ---
  const servicesContent = !isMobile && (
    <div 
      className={`dropdown-menu services-dropdown-menu ${isServicesOpen ? 'show' : ''}`}
      onMouseEnter={() => handleDropdownMouseEnter('services')}
      onMouseLeave={handleServicesMouseLeave}
    >
      {loading ? (
        <div className="dropdown-loading">Loading services...</div>
      ) : displayCategories.length === 0 ? (
        <div className="dropdown-error">No categories available</div>
      ) : (
        <>
          {/* COLUMN 1: First category (DEVELOPMENT or first backend category) */}
          <div className="dropdown-column dropdown-column-1">
            <div className="dropdown-column-title">
              {displayCategories[0] ? displayCategories[0].name : 'DEVELOPMENT'}
            </div>
            {(() => {
              const category = displayCategories[0];
              const services = category ? getServicesForCategory(category.id) : [];
              
              return services.length > 0 ? (
                services.map((service) => renderDropdownLink(service))
              ) : (
                <div className="dropdown-item-style">No services available</div>
              );
            })()}
            
            <div 
              className="dropdown-item-style dropdown-view-all-features"
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = '#CCCCCC'}
              onClick={() => handleNavigation('/projects')}
            >
              View All Features
            </div>
          </div>

          {/* COLUMN 2: Second category (MAINTENANCE or second backend category) */}
          {displayCategories.length > 1 && (
            <div className="dropdown-column dropdown-column-2">
              <div className="dropdown-column-title">
                {displayCategories[1].name}
              </div>
              {(() => {
                const services = getServicesForCategory(displayCategories[1].id);
                return services.length > 0 ? (
                  services.map((service) => renderDropdownLink(service))
                ) : (
                  <div className="dropdown-item-style">No services available</div>
                );
              })()}
            </div>
          )}

          {/* COLUMN 3: Third and Fourth categories combined (if available) */}
          {(displayCategories.length > 2 || displayCategories.length === 1) && (
            <div className="dropdown-column dropdown-column-3-security-tools">
              {/* Third category (SECURITY or third backend category) */}
              {displayCategories.length > 2 && (
                <>
                  <div className="dropdown-column-title">
                    {displayCategories[2].name}
                  </div>
                  {(() => {
                    const services = getServicesForCategory(displayCategories[2].id);
                    return services.length > 0 ? (
                      services.map((service) => renderDropdownLink(service))
                    ) : (
                      <div className="dropdown-item-style">No services available</div>
                    );
                  })()}
                </>
              )}

              {/* Fourth category (BUSINESS TOOLS or fourth backend category) */}
              {displayCategories.length > 3 && (
                <div className="dropdown-tools-section">
                  <div className="dropdown-column-title">
                    {displayCategories[3].name}
                  </div>
                  {(() => {
                    const services = getServicesForCategory(displayCategories[3].id);
                    return services.length > 0 ? (
                      services.map((service) => renderDropdownLink(service))
                    ) : (
                      <div className="dropdown-item-style">No services available</div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </>
      )}
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

  // RESOURCES DROPDOWN CONTENT (Desktop) - SAME AS BEFORE
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
          '/HelpCenter', 
          'In-depth guides and videos about the platform, our services, and how to get started.'
        )}

        {renderResourceLink(
          'Forum',
          '/Forum', 
          'An online community for Devknit users to discuss best practices and seek advice.'
        )}

        {renderResourceLink(
          'Webinars',
          '', 
          "Free online sessions where you'll learn the basics and refine your Devknit skills."
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
          '/Expert', 
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
  const mobileServicesContent = loading ? [] : 
    displayCategories.map(category => {
      const services = getServicesForCategory(category.id);
      return {
        title: category.name,
        items: services.map(service => ({
          text: service.title,
          path: `/services/${service.slug}`
        }))
      };
    });

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
        {loading ? (
          <div className="mobile-submenu-loading">Loading services...</div>
        ) : mobileServicesContent.length > 0 ? (
          mobileServicesContent.map((group) => (
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
          ))
        ) : (
          <div className="mobile-submenu-error">No services available</div>
        )}

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
        <HeaderLogo src={HeaderLogoImage} alt="Devknit Logo" />
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