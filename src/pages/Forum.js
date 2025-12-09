import React from 'react';
import '../css/Forum.css';
import ForumHeroImage from '../images/forum.png';
import { FaCode, FaShoppingCart, FaUsers, FaEdit } from 'react-icons/fa';
import { FiFileText, FiSearch, FiLayers, FiImage } from 'react-icons/fi';
import Layout from '../components/Layout';

const Forum = () => {
  const topics = [
    {
      title: "Welcome to the Forum",
      icon: <FaUsers className="devkni-topic-icon" />, 
      links: ["Forum Resources", "What's new at Squarespace", "Getting Started With Squarespace"],
     
    },
    {
      title: "Customize with code",
      icon: <FaCode className="devkni-topic-icon" />, 
      links: ["Code Blocks", "Fonts, colors and images", "Other"],
      
    },
    {
      title: "Commerce",
      icon: <FaShoppingCart className="devkni-topic-icon" />, 
      links: ["Setting up your store", "Customer Management", "Finances and Customers"],
     
    },
    {
      title: "Feedback on Your Site",
      icon: <FiFileText className="devkni-topic-icon" />, 
      links: [],
      
    },
    {
      title: "Images & Videos",
      icon: <FiImage className="devkni-topic-icon" />, 
      links: ["Best Practices", "Mobile"],
       
    },
    {
      title: "Pages & Content",
      icon: <FaEdit className="devkni-topic-icon" />, 
      links: ["Site Structure & Navigation", "Site Design & Styles", "Blogs", "Blocks"],
      
    },
    {
      title: "SEO",
      icon: <FiSearch className="devkni-topic-icon" />, 
      links: ["Best Practices", "Third Party SEO tools", "Appearance in search engines and Social"],
      
    },
    {
      title: "Squarespace products", 
      icon: <FiLayers className="devkni-topic-icon" />, 
      links: ["Bio Sites", "Unfold", "Acuity Scheduling", "Paywalls and digital products", "Email Campaigns", "Domains"],
    
    },
    {
      title: "Resources", 
      icon: <FiLayers className="devkni-topic-icon" />, 
      links: [],
      
    }
  ];

  return (
    <Layout>
    
    <div className="devkni-forum-container">
      
      {/* 1. Hero Section - Class names updated */}
      <div className="devkni-forum-hero-container">
        {/* Left Column: Text and Search Bar */}
        <div className="devkni-left-column">
          <h1 className="devkni-solution-heading">Find Solution</h1>
          <div className="devkni-search-bar-wrapper">
            <input 
              type="text" 
              placeholder="Search for topics, users, or keywords..." 
              className="devkni-search-input"
            />
          </div>
        </div>
        {/* Right Column: Image */}
        <div className="devkni-right-column">
          <img 
            src={ForumHeroImage} 
            alt="Forum Hero Visual" 
            className="devkni-hero-image-styled"
          />
        </div>
      </div>
      <div className="devkni-forum-topics-section">
        <div className="devkni-topics-header-container">
          <h2 className="devkni-browse-heading">Browse by topic</h2>
          <div className="devkni-divider-line"></div>
        </div>
        
        <div className="devkni-topics-grid-container">
          <div className="devkni-topics-grid">
            {topics.map((topic, index) => (
              <div key={index} className="devkni-topic-card">
                
                {/* 1. Icon & Title */}
                {topic.icon} 
                <h3 className="devkni-topic-title">{topic.title}</h3>
                
                {/* 2. Links List */}
                {topic.links.length > 0 && (
                  <ul className="devkni-topic-links-list">
                    {topic.links.map((link, linkIndex) => (
                      <li key={linkIndex} className="devkni-topic-link-item">
                        <a href="#" className="devkni-topic-link-text">{link}</a>
                      </li>
                    ))}
                  </ul>
                )}
                
                {/* 3. Post Count at the bottom */}
                <div className="devkni-post-count-text-wrapper">
                   {topic.postCount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

     
      <div className="devkni-company-footer-banner">
        <div className="devkni-company-info">
          <h3 className="devkni-company-name">Devknit</h3>
          <a href="/" className="devkni-home-button">Home</a>
        </div>
      </div>

    </div>
    </Layout>
  );
};

export default Forum;