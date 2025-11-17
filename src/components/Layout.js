import React, { useState, useEffect } from 'react';

// --- BLACK & WHITE WITH YELLOW COLOR SCHEME ---
const colors = {
  black: '#000000',
  white: '#FFFFFF',
  yellow: '#FFD700',
  darkGray: '#333333',
  lightGray: '#f5f5f5',
  mediumGray: '#666666'
};

// --- PREMIUM STYLES ---
const getStyles = (isMobile) => ({
  // === ENHANCED HEADER ===
  headerContainer: {
    width: '100%',
    backgroundColor: colors.white,
    backdropFilter: 'blur(20px)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: `1px solid ${colors.lightGray}`
  },
  topStrip: {
    height: '3px',
    background: `linear-gradient(90deg, ${colors.black}, ${colors.yellow})`,
    width: '100%'
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: isMobile ? '12px 20px' : '20px 50px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    gap: isMobile ? '8px' : '12px'
  },
  logoIcon: {
    width: isMobile ? '32px' : '40px',
    height: isMobile ? '32px' : '40px',
    background: colors.black,
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.white,
    fontWeight: 'bold',
    fontSize: isMobile ? '14px' : '18px'
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column'
  },
  logoName: {
    fontSize: isMobile ? '1.3rem' : '1.8rem',
    fontWeight: '800',
    color: colors.black,
    lineHeight: '1'
  },
  logoTagline: {
    fontSize: isMobile ? '0.7rem' : '0.9rem',
    color: colors.mediumGray,
    fontWeight: '500',
    letterSpacing: '0.3px',
    display: isMobile ? 'none' : 'block'
  },                                                                    
  mainNav: {
    display: isMobile ? 'none' : 'flex',
    gap: isMobile ? '20px' : '40px',
    alignItems: 'center' // Added to align both menus properly
  },
  navLink: {
    textDecoration: 'none',
    color: colors.black,
    fontSize: isMobile ? '0.9rem' : '1.05rem',
    fontWeight: '600',
    padding: '8px 0',
    position: 'relative',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    height: '100%'
  },
  navLinkHover: {
    color: colors.black
  },
  navLinkUnderline: {
    position: 'absolute',
    bottom: '-5px',
    left: '0',
    width: '0',
    height: '2px',
    background: colors.yellow,
    transition: 'width 0.3s ease'
  },
  ctaButton: {
    background: colors.yellow,
    color: colors.black,
    padding: isMobile ? '10px 16px' : '14px 32px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: isMobile ? '0.8rem' : '1rem',
    border: 'none',
    cursor: 'pointer',
    boxShadow: `0 6px 20px rgba(255, 215, 0, 0.3)`,
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    display: isMobile ? 'none' : 'block'
  },
  ctaButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px rgba(255, 215, 0, 0.4)`,
    background: '#FFED4E'
  },
  mobileMenuButton: {
    display: isMobile ? 'flex' : 'none',
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: colors.black,
    padding: '8px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mobileMenuButtonHover: {
    backgroundColor: colors.lightGray
  },
  mobileNav: {
    display: isMobile ? 'flex' : 'none',
    flexDirection: 'column',
    backgroundColor: colors.white,
    padding: '20px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    borderTop: `1px solid ${colors.lightGray}`
  },
  mobileNavLink: {
    textDecoration: 'none',
    color: colors.black,
    fontSize: '1.1rem',
    fontWeight: '600',
    padding: '15px 0',
    borderBottom: `1px solid ${colors.lightGray}`,
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  mobileNavLinkHover: {
    color: colors.black,
    transform: 'translateX(10px)'
  },
  mobileCtaButton: {
    background: colors.yellow,
    color: colors.black,
    padding: '16px 24px',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
    marginTop: '15px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'block',
    transition: 'all 0.3s ease'
  },
  mobileCtaButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 20px rgba(255, 215, 0, 0.4)`,
    background: '#FFED4E'
  },

  // === ENHANCED FOOTER ===
  footerContainer: {
    backgroundColor: colors.black,
    color: colors.white,
    position: 'relative',
    overflow: 'hidden'
  },
  footerPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: colors.black,
    opacity: 0.95
  },
  footerTop: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: isMobile ? '40px 20px 30px' : '80px 50px 60px',
    position: 'relative',
    zIndex: 2
  },
  footerColumns: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : (isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
    gap: isMobile ? '30px' : '50px'
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  colHeading: {
    fontSize: isMobile ? '1.1rem' : '1.3rem',
    fontWeight: '700',
    marginBottom: isMobile ? '15px' : '25px',
    color: colors.yellow,
    position: 'relative'
  },
  colHeadingUnderline: {
    position: 'absolute',
    bottom: '-8px',
    left: '0',
    width: '40px',
    height: '3px',
    background: colors.yellow,
    borderRadius: '2px'
  },
  footerList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '12px' : '15px'
  },
  footerLink: {
    textDecoration: 'none',
    color: '#B0B7C3',
    fontSize: isMobile ? '0.9rem' : '1rem',
    transition: 'all 0.3s ease',
    display: 'block',
    padding: '5px 0'
  },
  footerLinkHover: {
    color: colors.yellow,
    transform: 'translateX(8px)'
  },
  contactInfo: {
    color: '#B0B7C3',
    lineHeight: '1.8',
    fontSize: isMobile ? '0.9rem' : '1rem'
  },
  phoneNumber: {
    color: colors.yellow,
    fontWeight: '700',
    fontSize: isMobile ? '1.1rem' : '1.3rem',
    margin: isMobile ? '10px 0' : '15px 0'
  },
  emailLink: {
    color: colors.yellow,
    fontWeight: '600',
    textDecoration: 'none'
  },
  footerBottom: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: isMobile ? '20px 15px' : '40px 50px',
    borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
    position: 'relative',
    zIndex: 2,
    textAlign: 'center'
  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: isMobile ? '10px' : '15px',
    marginBottom: isMobile ? '20px' : '30px'
  },
  socialIcon: {
    width: isMobile ? '40px' : '44px',
    height: isMobile ? '40px' : '44px',
    borderRadius: isMobile ? '10px' : '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#B0B7C3',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    backdropFilter: 'blur(10px)',
    fontSize: isMobile ? '1rem' : '1.1rem'
  },
  socialIconHover: {
    backgroundColor: colors.yellow,
    color: colors.black,
    transform: 'translateY(-3px)',
    boxShadow: `0 8px 25px rgba(255, 215, 0, 0.4)`
  },
  copyrightText: {
    color: '#8B949E',
    fontSize: isMobile ? '0.8rem' : '0.9rem',
    marginBottom: '8px'
  },
  legalText: {
    color: '#6E7681',
    fontSize: isMobile ? '0.75rem' : '0.8rem'
  }
});

// --- ENHANCED LAYOUT COMPONENT ---
const Layout = ({ children }) => {
  const [hoverStates, setHoverStates] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [resourcesSubmenuOpen, setResourcesSubmenuOpen] = useState(false);

  // Check screen size
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

  const handleMouseEnter = (element) => {
    setHoverStates(prev => ({ ...prev, [element]: true }));
  };

  const handleMouseLeave = (element) => {
    setHoverStates(prev => ({ ...prev, [element]: false }));
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleResourcesSubmenu = () => {
    setResourcesSubmenuOpen(!resourcesSubmenuOpen);
  };

  const styles = getStyles(isMobile);

  // Navigation items - Only Services and Resources
  const navItems = [
    { name: 'Services', path: '/Projects' },
    { 
      name: 'Resources', 
      path: '/resources',
      submenu: [
        { name: 'Articles', path: '/articles' },
        { name: 'Projects', path: '/Projects' },
        // { name: 'Case Studies', path: '/case-studies' }
      ]
    }
  ];

  // === PREMIUM HEADER ===
  const renderHeader = () => (
    <header style={styles.headerContainer}>
      <div style={styles.topStrip}></div>
      <div style={styles.headerContent}>
        
        {/* Premium Logo */}
        <a href="/" style={styles.logoSection}>
          <div style={styles.logoIcon}>D</div>
          <div style={styles.logoText}>
            <div style={styles.logoName}>DEVKNIT</div>
            <div style={styles.logoTagline}>Web Development & Digital Solutions</div>
          </div>
        </a>

        {/* Premium Navigation - Only Services and Resources */}
        <nav style={styles.mainNav}>
          {navItems.map((item) => (
            <div key={item.name} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              {item.name === 'Resources' ? (
                // Resources with clickable submenu
                <div
                  style={{
                    ...styles.navLink,
                    ...(hoverStates[`nav${item.name}`] ? styles.navLinkHover : {})
                  }}
                  onMouseEnter={() => handleMouseEnter(`nav${item.name}`)}
                  onMouseLeave={() => handleMouseLeave(`nav${item.name}`)}
                  onClick={toggleResourcesSubmenu}
                >
                  {item.name}
                  <span style={{
                    ...styles.navLinkUnderline,
                    width: hoverStates[`nav${item.name}`] ? '100%' : '0'
                  }}></span>
                </div>
              ) : (
                // Regular navigation item
                <a 
                  href={item.path}
                  style={{
                    ...styles.navLink,
                    ...(hoverStates[`nav${item.name}`] ? styles.navLinkHover : {})
                  }}
                  onMouseEnter={() => handleMouseEnter(`nav${item.name}`)}
                  onMouseLeave={() => handleMouseLeave(`nav${item.name}`)}
                >
                  {item.name}
                  <span style={{
                    ...styles.navLinkUnderline,
                    width: hoverStates[`nav${item.name}`] ? '100%' : '0'
                  }}></span>
                </a>
              )}
              
              {/* Submenu for Resources - Show on hover AND when clicked */}
              {item.submenu && (hoverStates[`nav${item.name}`] || resourcesSubmenuOpen) && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  backgroundColor: colors.white,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  padding: '10px 0',
                  minWidth: '200px',
                  zIndex: 1000,
                  border: `1px solid ${colors.lightGray}`
                }}
                onMouseEnter={() => handleMouseEnter(`nav${item.name}`)}
                onMouseLeave={() => {
                  handleMouseLeave(`nav${item.name}`);
                  setResourcesSubmenuOpen(false);
                }}
                >
                  {item.submenu.map((subItem) => (
                    <a
                      key={subItem.name}
                      href={subItem.path}
                      style={{
                        display: 'block',
                        padding: '12px 20px',
                        textDecoration: 'none',
                        color: colors.black,
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = colors.lightGray;
                        e.target.style.color = colors.black;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = colors.black;
                      }}
                      onClick={() => setResourcesSubmenuOpen(false)}
                    >
                      {subItem.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Premium CTA Button - Yellow */}
        <button 
          style={{
            ...styles.ctaButton,
            ...(hoverStates.ctaButton ? styles.ctaButtonHover : {})
          }}
          onMouseEnter={() => handleMouseEnter('ctaButton')}
          onMouseLeave={() => handleMouseLeave('ctaButton')}
          onClick={() => window.location.href = '/ContactUs'}
        >
          Start Project
        </button>

        {/* Mobile Menu Button */}
        <button 
          style={{
            ...styles.mobileMenuButton,
            ...(hoverStates.mobileMenuButton ? styles.mobileMenuButtonHover : {})
          }}
          onClick={toggleMobileMenu}
          onMouseEnter={() => handleMouseEnter('mobileMenuButton')}
          onMouseLeave={() => handleMouseLeave('mobileMenuButton')}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileNav}>
          {navItems.map((item) => (
            <div key={item.name}>
              {item.name === 'Resources' ? (
                // Resources with clickable submenu in mobile
                <div
                  style={{
                    ...styles.mobileNavLink,
                    ...(hoverStates[`mobileNav${item.name}`] ? styles.mobileNavLinkHover : {})
                  }}
                  onMouseEnter={() => handleMouseEnter(`mobileNav${item.name}`)}
                  onMouseLeave={() => handleMouseLeave(`mobileNav${item.name}`)}
                  onClick={toggleResourcesSubmenu}
                >
                  {item.name} {resourcesSubmenuOpen ? '▲' : '▼'}
                </div>
              ) : (
                // Regular mobile navigation item
                <a 
                  href={item.path}
                  style={{
                    ...styles.mobileNavLink,
                    ...(hoverStates[`mobileNav${item.name}`] ? styles.mobileNavLinkHover : {})
                  }}
                  onMouseEnter={() => handleMouseEnter(`mobileNav${item.name}`)}
                  onMouseLeave={() => handleMouseLeave(`mobileNav${item.name}`)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              )}
              
              {/* Mobile Submenu for Resources */}
              {item.submenu && resourcesSubmenuOpen && item.name === 'Resources' && (
                <div>
                  {item.submenu.map((subItem) => (
                    <a
                      key={subItem.name}
                      href={subItem.path}
                      style={{
                        ...styles.mobileNavLink,
                        paddingLeft: '20px',
                        fontSize: '0.95rem',
                        color: colors.mediumGray
                      }}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setResourcesSubmenuOpen(false);
                      }}
                    >
                      └ {subItem.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a 
            href="/ContactUs"
            style={{
              ...styles.mobileCtaButton,
              ...(hoverStates.mobileCtaButton ? styles.mobileCtaButtonHover : {})
            }}
            onMouseEnter={() => handleMouseEnter('mobileCtaButton')}
            onMouseLeave={() => handleMouseLeave('mobileCtaButton')}
            onClick={() => setMobileMenuOpen(false)}
          >
            Start Project
          </a>
        </div>
      )}
    </header>
  );

  // === PREMIUM FOOTER ===
  const renderFooter = () => (
    <footer style={styles.footerContainer}>
      <div style={styles.footerPattern}></div>
      
      <div style={styles.footerTop}>
        <div style={styles.footerColumns}>
          
          {/* Services Column */}
          <div style={styles.footerCol}>
    <h4 style={styles.colHeading}>
        Services
        <span style={styles.colHeadingUnderline}></span>
    </h4>
    <ul style={styles.footerList}>
        {[
            { name: 'Web Development', path: '/projects/' },
            { name: 'UI/UX Design', path: '/projects/' },
            { name: 'SEO Optimization', path: '/projects/' },
            { name: 'E-commerce Solutions', path: '/projects/' },
            // { name: 'Digital Marketing', path: '/services/digital-marketing' }
        ].map((service, index) => (
            <li key={service.name}>
                <a 
                    // 🚀 Naya path use kiya gaya hai
                    href={service.path}
                    style={{
                        // ⚠️ Note: Aapki hoverStates ki keys ab 'service.name' par depend karengi ya aapko unhe badalna hoga
                        ...styles.footerLink,
                        ...(hoverStates[service.name] ? styles.footerLinkHover : {})
                    }}
                    // 🚀 Hover keys ko service.name ke hisaab se update kiya gaya
                    onMouseEnter={() => handleMouseEnter(service.name)}
                    onMouseLeave={() => handleMouseLeave(service.name)}
                >
                    {service.name}
                </a>
            </li>
        ))}
    </ul>
</div>

          {/* Portfolio Column */}
          <div style={styles.footerCol}>
    <h4 style={styles.colHeading}>
        Portfolio
        <span style={styles.colHeadingUnderline}></span>
    </h4>
    <ul style={styles.footerList}>
        {[
            // 🚀 Har item ko object mein badal diya gaya
            // { name: 'Case Studies', path: '/portfolio/case-studies' },
            { name: 'Web Applications', path: '/projects' },
            { name: 'Mobile Apps', path: '/projects' },
            { name: 'E-commerce Stores', path: '/projects' },
            { name: 'Brand Projects', path: '/projects' }
        ].map((item, index) => (
            <li key={item.name}>
                <a 
                    // 🚀 Ab yeh item.path ko use karega
                    href={item.path}
                    style={{
                        // ⚠️ Note: Maine hover key ko item.name use karne ke bajaye purana index wala tareeqa rakha hai, 
                        // taaki aapki purani hover logic theek rahe agar aap chahein toh.
                        ...styles.footerLink,
                        ...(hoverStates[`portfolio${index}`] ? styles.footerLinkHover : {})
                    }}
                    onMouseEnter={() => handleMouseEnter(`portfolio${index}`)}
                    onMouseLeave={() => handleMouseLeave(`portfolio${index}`)}
                >
                    {item.name}
                </a>
            </li>
        ))}
    </ul>
</div>

          {/* Resources Column */}
          <div style={styles.footerCol}>
            <h4 style={styles.colHeading}>
              Resources
              <span style={styles.colHeadingUnderline}></span>
            </h4>
            <ul style={styles.footerList}>
              {[
                { name: 'Articles', path: '/articles' },
                { name: 'Projects', path: '/Projects' },
                // { name: 'Case Studies', path: '/Projects' },
                { name: 'Development Guides', path: '/projects' },
                { name: 'SEO Tips', path: '/projects' }
              ].map((resource, index) => (
                <li key={resource.name}>
                  <a 
                    href={resource.path}
                    style={{
                      ...styles.footerLink,
                      ...(hoverStates[`resource${index}`] ? styles.footerLinkHover : {})
                    }}
                    onMouseEnter={() => handleMouseEnter(`resource${index}`)}
                    onMouseLeave={() => handleMouseLeave(`resource${index}`)}
                  >
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div style={styles.footerCol}>
            <h4 style={styles.colHeading}>
              Contact
              <span style={styles.colHeadingUnderline}></span>
            </h4>
            <div style={styles.contactInfo}>
              <p>Professional Web Development</p>
              <p style={styles.phoneNumber}>+1 (555) 123-4567</p>
              <p>
                <a 
                  href="mailto:hello@devknit.com"
                  style={{
                    ...styles.footerLink,
                    ...styles.emailLink,
                    ...(hoverStates.email ? { color: colors.yellow } : {})
                  }}
                  onMouseEnter={() => handleMouseEnter('email')}
                  onMouseLeave={() => handleMouseLeave('email')}
                >
                  hello@devknit.com
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>

      <div style={styles.footerBottom}>
        <div style={styles.socialLinks}>
          {['LinkedIn', 'GitHub', 'Dribbble', 'Twitter'].map((platform) => (
            <a
              key={platform}
              href={`https://${platform.toLowerCase()}.com/devknit`}
              aria-label={platform}
              style={{
                ...styles.socialIcon,
                ...(hoverStates[platform.toLowerCase()] ? styles.socialIconHover : {})
              }}
              onMouseEnter={() => handleMouseEnter(platform.toLowerCase())}
              onMouseLeave={() => handleMouseLeave(platform.toLowerCase())}
            >
              {platform === 'Twitter' ? '𝕏' : platform.slice(0,2)}
            </a>
          ))}
        </div>
        
        <p style={styles.copyrightText}>
          © 2025 DEVKNIT - Web Development & Digital Solutions
        </p>
        <p style={styles.legalText}>
          Professional Web Development Services | Custom Digital Solutions
        </p>
      </div>
    </footer>
  );

  return (
    <div>
      {renderHeader()}
      <main>{children}</main>
      {renderFooter()}
    </div>
  );
};

export default Layout;