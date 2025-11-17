import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { API_BASE_URL } from '../api/baseurl';
import '../css/articles.css';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Articles Data
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}articles/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch articles');
                }
                const data = await response.json();
                const articlesData = Array.isArray(data) ? data : (data.results || data.data || []);
                setArticles(articlesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="articles-loading">
                    <div className="articles-loading-spinner"></div>
                    <p>Loading Articles...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="articles-error">
                    <h2>Error Loading Articles</h2>
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="try-again-btn"
                    >
                        Try Again
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Hero Section */}
            <section className="articles-hero">
                <div className="hero-container">
                    <h1 className="hero-title">
                        Latest Articles
                    </h1>
                    <p className="hero-subtitle">
                        Insights, stories, and expertise from our team
                    </p>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="articles-grid-section">
                <div className="articles-container">
                    {articles.length === 0 ? (
                        <div className="empty-state">
                            <h3>No Articles Found</h3>
                            <p>Check back later for new articles.</p>
                        </div>
                    ) : (
                        <>
                            {/* Articles Grid */}
                            <div className="articles-grid">
                                {articles.map((article) => (
                                    <article 
                                        key={article.id}
                                        className="article-card"
                                    >
                                        <Link 
                                            to={`/articles/${article.slug}`}
                                            className="article-card-link"
                                        >
                                            {article.image && (
                                                <div className="article-image-container">
                                                    <img 
                                                        src={article.image} 
                                                        alt={article.title}
                                                        className="article-image"
                                                    />
                                                </div>
                                            )}
                                            <div className="article-card-content">
                                                <div className="article-header">
                                                    <div className="article-title-wrapper">
                                                        <h2 className="article-title">
                                                            {article.title}
                                                        </h2>
                                                    </div>
                                                </div>

                                                {article.meta_description && (
                                                    <p className="article-description">
                                                        {article.meta_description}
                                                    </p>
                                                )}

                                                <div className="article-meta">
                                                    <span className="publish-date">
                                                        {new Date(article.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                        
                                        {/* Read More Button
                                        <div className="article-actions">
                                            <Link 
                                                to={`/articles/${article.slug}`}
                                                className="read-more-btn"
                                            >
                                                Read Article
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </Link>
                                        </div> */}
                                    </article>
                                ))}
                            </div>

                            {/* Newsletter Section */}
                            <div className="newsletter-section">
                                <h3 className="newsletter-title">
                                    Stay Updated
                                </h3>
                                <p className="newsletter-description">
                                    Get the latest articles and insights delivered to your inbox
                                </p>
                                <form className="newsletter-form">
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email address"
                                        className="newsletter-input"
                                        required
                                    />
                                    <button 
                                        type="submit" 
                                        className="subscribe-btn"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default Articles;