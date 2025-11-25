import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#000000' }}>
            <Header />
            
            <main style={{ 
                flexGrow: 1, 
                backgroundColor: 'transparent',
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