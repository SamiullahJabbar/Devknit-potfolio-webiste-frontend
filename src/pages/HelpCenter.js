import React, { useState, useMemo, useEffect } from 'react';
import '../css/HelpCenter.css';
import { API_BASE_URL } from '../api/baseurl'; 
import Layout from '../components/Layout';

const HelpCenterHeader = ({ searchTerm, handleSearchChange }) => {
    // Note: Reverted to placeholder image div based on the provided code structure.
    return (
      <header className="help-center-header">
        <div className="header-content-container">
          
          {/* Left Section: Title and Search */}
          <div className="header-left-section">
            <h1 className="header-title">Devknit Help Center</h1>
            
            <div className="search-bar-container">
              <span className="search-icon"></span>
              <input 
                type="text" 
                placeholder="Find answers and resources"
                className="search-input"
                value={searchTerm} // Controlled component
                onChange={handleSearchChange}
              />
            </div>
          </div>
          
          {/* Right Section: Image Placeholder */}
          <div className="header-right-section">
            <div className="hero-image-placeholder">
              <div className="placeholder-content">
                              </div>
            </div>
          </div>
          
        </div>
      </header>
    );
  };


// --- 2. Services Section Component (UPDATED FOR API) ---

const ServiceCard = ({ service }) => {
    // Check if a feature image exists, otherwise use a fallback
    const imageUrl = service.feature_image ? service.feature_image : null;
    
    // Using short_description for text below the title, similar to the provided image layout
    const serviceDescription = service.short_description || "Click to learn more about this service.";

    return (
        <a href={`/services/${service.slug}`} className="service-card" title={service.title}>
            <div className="service-image-container">
                {imageUrl ? (
                    <img src={imageUrl} alt={service.title} className="service-image" />
                ) : (
                    // Fallback if no image is available
                    <div className="service-image-placeholder">{service.title}</div>
                )}
            </div>
            <h3 className="service-title">{service.title}</h3>
            {/* The provided image shows short descriptions/bullet points below the product title */}
            <p className="service-short-description">{serviceDescription}</p> 
            {/* You can add a button or list of key points here if required */}
        </a>
    );
};

const ServicesSection = ({ categories, allServices, searchTerm }) => {
    
    // Flatten all service titles for searching
    const searchableServices = useMemo(() => {
        return allServices.flatMap(category => 
            category.services.map(service => ({
                ...service,
                categoryName: category.name
            }))
        );
    }, [allServices]);

    const filteredServices = useMemo(() => {
        if (!searchTerm) {
            return allServices; // Return nested structure if no search term
        }
        
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        // Filter the flattened array
        const results = searchableServices.filter(service => 
            service.title.toLowerCase().includes(lowerSearchTerm) ||
            service.short_description.toLowerCase().includes(lowerSearchTerm) ||
            service.categoryName.toLowerCase().includes(lowerSearchTerm)
        );

        // Group the filtered services back by category for display consistency
        const groupedResults = {};
        results.forEach(service => {
            if (!groupedResults[service.categoryName]) {
                groupedResults[service.categoryName] = [];
            }
            groupedResults[service.categoryName].push(service);
        });

        return groupedResults;

    }, [searchableServices, allServices, searchTerm]);

    const displayServices = searchTerm ? Object.values(filteredServices).flat() : searchableServices;
    const isSearching = !!searchTerm;

    return (
        <section className="content-section services-section">
            <div className="content-container">
                <h2 className="section-title">Browse by Service (API Data)</h2>
                <div className="services-grid-cards">
                    {displayServices.length > 0 ? (
                        displayServices.map((service, index) => (
                            <ServiceCard key={service.id || index} service={service} />
                        ))
                    ) : (
                        <p className="no-results">No services found for "{searchTerm}"</p>
                    )}
                </div>
            </div>
        </section>
    );
};


// --- 3. FAQ Section Component (No API Data for FAQs, using static data) ---

// --- Static FAQ Data ---
const FAQS_DATA = [
    { 
        question: "What is the typical turnaround time for a Web Development project?", 
        answer: "The timeline for web development varies greatly based on complexity, required features, and integrations. A basic site may take 4-6 weeks, while large-scale applications can take 3-6 months or more." 
    },
    { 
        question: "How is Web Maintenance different from Web Security?", 
        answer: "Web Maintenance involves routine updates (plugins, core software), backups, and performance checks. Web Security focuses specifically on protection against threats, like performing vulnerability assessments and setting up SSL/encryption." 
    },
    // ... rest of the FAQS_DATA
    { 
        question: "What are the benefits of your SEO & Analytics services?", 
        answer: "Our SEO services improve your search ranking, drive organic traffic, and increase visibility. Analytics tools provide actionable insights into user behavior and site performance, ensuring continuous optimization." 
    },
    { 
        question: "Can you help set up and customize an existing Shopify store?", 
        answer: "Yes, we specialize in comprehensive Shopify Store Setup, including custom theme design, payment gateway integration, and inventory management configuration." 
    },
];

const FAQItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="faq-item">
            <button className="faq-question-button" onClick={() => setIsOpen(!isOpen)}>
                <span className="faq-question">{faq.question}</span>
                <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <p className="faq-answer">{faq.answer}</p>}
        </div>
    );
};

const FAQSection = ({ faqs, searchTerm }) => {
    const filterFAQs = (faqsArray) => {
        if (!searchTerm) return faqsArray;

        const lowerSearchTerm = searchTerm.toLowerCase();
        return faqsArray.filter(faq => 
            faq.question.toLowerCase().includes(lowerSearchTerm) ||
            faq.answer.toLowerCase().includes(lowerSearchTerm)
        );
    };

    const filteredFAQs = useMemo(() => filterFAQs(faqs), [faqs, searchTerm]);

    return (
        <section className="content-section faq-section">
            <div className="content-container">
                <h2 className="section-title">Frequently Asked Questions</h2>
                <div className="faq-list">
                    {filteredFAQs.map((faq, index) => (
                        <FAQItem key={index} faq={faq} />
                    ))}
                    {filteredFAQs.length === 0 && searchTerm && (
                        <p className="no-results">No FAQs found for "{searchTerm}"</p>
                    )}
                </div>
            </div>
        </section>
    );
};


// --- Main Component Jisme Sab Kuchh Hai (API Integration) ---
const HelpCenter = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Function to fetch all data
    const fetchAllData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Fetch Categories
            const categoriesResponse = await fetch(`${API_BASE_URL}categories/`);
            if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
            const categoriesData = await categoriesResponse.json();
            setCategories(categoriesData);

            // 2. Fetch Services for each Category
            const servicesPromises = categoriesData.map(category => 
                fetch(`${API_BASE_URL}categories/${category.id}/services/`)
                    .then(res => {
                        if (!res.ok) throw new Error(`Failed to fetch services for ${category.name}`);
                        return res.json();
                    })
                    .then(services => ({
                        id: category.id,
                        name: category.name,
                        slug: category.slug,
                        services: services 
                    }))
            );
            
            const servicesResults = await Promise.all(servicesPromises);
            setAllServices(servicesResults);
            
        } catch (err) {
            console.error("API Fetch Error:", err);
            setError("Error loading content. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []); // Run once on component mount

    return (
        <Layout>
        <div className="help-center-page">
            <HelpCenterHeader 
                searchTerm={searchTerm} 
                handleSearchChange={handleSearchChange} 
            />
            
            {isLoading && (
                <div className="loading-message content-section">
                    <div className="content-container">Loading services and FAQs...</div>
                </div>
            )}

            {error && (
                <div className="error-message content-section">
                    <div className="content-container error-text">{error}</div>
                </div>
            )}
            
            {!isLoading && !error && (
                <>
                  
                    <ServicesSection 
                        categories={categories}
                        allServices={allServices} 
                        searchTerm={searchTerm} 
                    />
                    
                    <FAQSection 
                        faqs={FAQS_DATA} 
                        searchTerm={searchTerm} 
                    />
                </>
            )}
        </div>
        </Layout>
    );
};

export default HelpCenter;