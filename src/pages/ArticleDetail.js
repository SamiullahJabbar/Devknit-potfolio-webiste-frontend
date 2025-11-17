import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { API_BASE_URL } from '../api/baseurl';

const ArticleDetail = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Article Data
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}articles/${slug}/`);
                if (!response.ok) {
                    throw new Error('Article not found');
                }
                const data = await response.json();
                setArticle(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchArticle();
        }
    }, [slug]);

    // Fetch Projects Data
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}projects/`);
                if (response.ok) {
                    const data = await response.json();
                    const projectsData = Array.isArray(data) ? data : (data.results || data.data || []);
                    setProjects(projectsData.slice(0, 3));
                }
            } catch (err) {
                console.error('Failed to fetch projects:', err);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <Layout>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    minHeight: '60vh', 
                    textAlign: 'center', 
                    padding: '40px 20px' 
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #000000',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '20px'
                    }}></div>
                    <p>Loading Article...</p>
                </div>
            </Layout>
        );
    }

    if (error || !article) {
        return (
            <Layout>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    minHeight: '60vh', 
                    textAlign: 'center', 
                    padding: '40px 20px' 
                }}>
                    <h2>Article Not Found</h2>
                    <p>{error || 'The article you are looking for does not exist.'}</p>
                    <Link to="/articles" style={{ 
                        color: '#000000', 
                        textDecoration: 'none', 
                        fontWeight: '600', 
                        marginTop: '20px',
                        borderBottom: '2px solid #000000',
                        paddingBottom: '2px'
                    }}>
                        Back to Articles
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Article Header */}
            <section style={{ 
                background: '#ffffff', 
                padding: '80px 20px 60px', 
                borderBottom: '1px solid #e0e0e0' 
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        fontSize: '0.9rem', 
                        marginBottom: '20px', 
                        color: '#666666' 
                    }}>
                        <Link to="/" style={{ color: '#666666', textDecoration: 'none' }}>Home</Link>
                        <span>/</span>
                        <Link to="/articles" style={{ color: '#666666', textDecoration: 'none' }}>Articles</Link>
                        <span>/</span>
                        <span style={{ color: '#000000', fontWeight: '600' }}>{article.title}</span>
                    </div>
                    
                    <div style={{ 
                        display: 'flex', 
                        gap: '20px', 
                        marginBottom: '30px', 
                        fontSize: '0.9rem', 
                        color: '#666666' 
                    }}>
                        <span>
                            Published on {new Date(article.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                        <span>
                            {Math.ceil(article.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)} min read
                        </span>
                    </div>

                    <h1 style={{ 
                        fontSize: '3rem', 
                        fontWeight: '800', 
                        lineHeight: '1.2', 
                        marginBottom: '20px', 
                        color: '#000000' 
                    }}>
                        {article.title}
                    </h1>
                    
                    {article.meta_description && (
                        <p style={{ 
                            fontSize: '1.2rem', 
                            lineHeight: '1.6', 
                            color: '#666666', 
                            marginBottom: '40px' 
                        }}>
                            {article.meta_description}
                        </p>
                    )}

                    {article.image && (
                        <div style={{ 
                            width: '100%', 
                            borderRadius: '8px', 
                            overflow: 'hidden', 
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
                        }}>
                            <img 
                                src={article.image} 
                                alt={article.title}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Article Content */}
            <section style={{ padding: '60px 20px', background: '#ffffff' }}>
                <div style={{ 
                    maxWidth: '800px', 
                    margin: '0 auto',
                    fontSize: '1.1rem',
                    lineHeight: '1.8',
                    color: '#333333'
                }}>
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>
            </section>

            {/* Related Projects Section */}
            {projects.length > 0 && (
                <section style={{ 
                    padding: '80px 20px', 
                    background: '#ffffff', 
                    borderTop: '1px solid #e0e0e0' 
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                            <h2 style={{ 
                                fontSize: '2.5rem', 
                                fontWeight: '800', 
                                marginBottom: '15px', 
                                color: '#000000' 
                            }}>
                                Featured Projects
                            </h2>
                            <p style={{ 
                                fontSize: '1.1rem', 
                                color: '#666666', 
                                maxWidth: '600px', 
                                margin: '0 auto' 
                            }}>
                                Explore our latest work and success stories
                            </p>
                        </div>
                        
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            gap: '60px', 
                            flexWrap: 'wrap',
                            marginTop: '60px'
                        }}>
                            {projects.map((project, index) => (
                                <div key={project.id} style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    maxWidth: '320px',
                                    margin: '10px 0'
                                }}>
                                    {/* Mobile Display Wrapper */}
                                    <div style={{ 
                                        width: '280px', 
                                        height: '580px', 
                                        background: '#FFFFFF', 
                                        borderRadius: '28px', 
                                        boxShadow: '0 15px 40px rgba(0, 43, 91, 0.12), 0 0 0 1px rgba(0, 43, 91, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        marginBottom: '30px'
                                    }}>
                                        {project.mobile_view_video ? (
                                            <video
                                                src={project.mobile_view_video} 
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    display: 'block',
                                                    borderRadius: '25px'
                                                }}
                                                autoPlay 
                                                loop 
                                                muted
                                                playsInline 
                                                controls={false}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                                                color: '#000000',
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                borderRadius: '25px'
                                            }}>
                                                <span>Project Preview</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Title Box */}
                                    <div style={{ textAlign: 'center', width: '100%', padding: '0 10px' }}>
                                        <Link 
                                            to={`/projects/${project.slug}`} 
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '12px',
                                                textDecoration: 'none',
                                                padding: '16px 32px',
                                                borderRadius: '12px',
                                                background: '#000000',
                                                color: '#FFFFFF',
                                                minWidth: '280px',
                                                maxWidth: '320px',
                                                border: '2px solid #000000',
                                                boxShadow: '0 8px 25px rgba(0, 43, 91, 0.2)'
                                            }}
                                        >
                                            <div style={{ 
                                                fontSize: '1.3rem', 
                                                fontWeight: '700', 
                                                margin: '0', 
                                                lineHeight: '1.3',
                                                textAlign: 'center',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                                                    {project.title}
                                                </span>
                                            </div>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '70px' }}>
                            <Link 
                                to="/projects" 
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    background: '#000000',
                                    color: '#FFFFFF',
                                    textDecoration: 'none',
                                    padding: '16px 40px',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '1.1rem'
                                }}
                            >
                                View All Projects
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Newsletter Section */}
            {/* <section style={{ 
                padding: '60px 20px', 
                background: '#f8f8f8', 
                borderTop: '1px solid #e0e0e0', 
                textAlign: 'center' 
            }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ 
                        fontSize: '2.2rem', 
                        fontWeight: '700', 
                        marginBottom: '15px', 
                        color: '#000000' 
                    }}>
                        Stay Updated
                    </h2>
                    <p style={{ 
                        fontSize: '1.1rem', 
                        marginBottom: '30px', 
                        color: '#666666' 
                    }}>
                        Get the latest articles and insights delivered to your inbox
                    </p>
                    <form style={{ 
                        display: 'flex', 
                        gap: '15px', 
                        maxWidth: '400px', 
                        margin: '0 auto' 
                    }}>
                        <input 
                            type="email" 
                            placeholder="Enter your email address"
                            style={{
                                flex: '1',
                                padding: '12px 16px',
                                border: '1px solid #cccccc',
                                borderRadius: '6px',
                                background: '#ffffff',
                                color: '#000000',
                                fontSize: '1rem'
                            }}
                            required
                        />
                        <button 
                            type="submit" 
                            style={{
                                padding: '12px 24px',
                                background: '#000000',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section> */}

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </Layout>
    );
};

export default ArticleDetail;